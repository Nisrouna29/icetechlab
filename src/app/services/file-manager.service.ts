import { Injectable, signal, computed, inject } from "@angular/core";
import { ApiService, ApiItem, DirectoryUploadItem } from "./api.service";
import { SnackbarService } from "./snackbar.service";
import { Observable, combineLatest, of, from } from "rxjs";
import { map, tap, catchError, switchMap, concatMap } from "rxjs/operators";

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size: string;
  modified: string;
  icon?: string;
  color?: string;
  thumbnail?: string;
  parentId?: string | null;
  mimeType?: string;
  filePath?: string;
  isUploading?: boolean;
  progress?: number;
}

@Injectable({
  providedIn: "root",
})
export class FileManagerService {
  // Signals for state management
  private _files = signal<FileItem[]>([]);
  private _selectedItems = signal<Set<string>>(new Set());
  private _currentPath = signal<string[]>([]);
  private _viewMode = signal<"grid" | "list">("grid");
  private _sortBy = signal<"name" | "date" | "size" | "type">("name");
  private _sortOrder = signal<"asc" | "desc">("asc");
  private _isLoading = signal<boolean>(true);
  private _currentFolderId = signal<string | null>(null);
  private _error = signal<string | null>(null);
  private _missingFolderName = signal<string | null>(null);
  private _itemToRename = signal<FileItem | null>(null);
  private _itemToMove = signal<FileItem | null>(null);
  private _itemToDelete = signal<FileItem | null>(null);
  private _allFolders = signal<FileItem[]>([]);
  private _folderItemCounts = signal<Map<string, number>>(new Map());
  private _lastValidPath: string[] = [];
  private _lastValidFolderId: string | null = null;

  // Computed signals
  files = computed(() => this._files());
  selectedItems = computed(() => this._selectedItems());
  currentPath = computed(() => this._currentPath());
  viewMode = computed(() => this._viewMode());
  isLoading = computed(() => this._isLoading());
  currentFolderId = computed(() => this._currentFolderId());
  error = computed(() => this._error());
  missingFolderName = computed(() => this._missingFolderName());
  itemToRename = computed(() => this._itemToRename());
  itemToMove = computed(() => this._itemToMove());
  itemToDelete = computed(() => this._itemToDelete());
  allFolders = computed(() => this._allFolders());
  folderItemCounts = computed(() => this._folderItemCounts());

  // Public methods
  clearFiles() {
    this._files.set([]);
    this._isLoading.set(true);
  }

  // Breadcrumb computed
  breadcrumbPath = computed(() => {
    const path = this._currentPath();
    const missingFolder = this._missingFolderName();

    // If we're at root (empty path), show "Home"
    if (path.length === 0) {
      return [{ name: "Home", path: [] }];
    }

    // Always start with Home
    const breadcrumb: Array<{ name: string; path: string[] }> = [
      { name: "Home", path: [] },
    ];

    // Add each folder in the path, filtering out missing folder
    const filteredPath = path.filter((segment) => segment !== missingFolder);
    filteredPath.forEach((segment, index) => {
      breadcrumb.push({
        name: segment,
        path: path.slice(0, path.indexOf(segment) + 1),
      });
    });

    return breadcrumb;
  });

  private snackbarService = inject(SnackbarService);

  constructor(private apiService: ApiService) {
    // Don't load root folder here - let the route handler decide what to load
    this.loadAllFolders();
  }

  /**
   * Load all folders for move modal
   */
  private loadAllFolders(): void {
    this.getAllFolders().subscribe({
      next: () => {
        // Load folder item counts after folders are loaded
        this.loadFolderItemCounts();
      },
      error: (error) => {
        console.error("Error loading folders:", error);
      },
    });
  }

  /**
   * Convert API item to FileItem
   */
  private convertApiItemToFileItem(apiItem: ApiItem): FileItem {
    return {
      id: apiItem.id,
      name: apiItem.name,
      type: apiItem.folder ? "folder" : "file",
       size: apiItem.folder
         ? "Loading..."
         : this.formatFileSize(apiItem.size || 0),
      modified: new Date(apiItem.modification).toLocaleDateString(),
      icon: this.getFileIcon(apiItem.name, apiItem.folder, apiItem.mimeType),
      color: this.getFileColor(apiItem.name, apiItem.folder, apiItem.mimeType),
      parentId: apiItem.parentId,
      mimeType: apiItem.mimeType,
      filePath: apiItem.filePath,
    };
  }

  private loadFolderItemCounts(): void {
    // Get all folders and load their item counts
    const folders = this._allFolders();

    if (folders.length === 0) {
      return;
    }

    const countObservables = folders.map((folder) =>
      this.apiService
        .getItems(folder.id)
        .pipe(map((items) => ({ folderId: folder.id, count: items.length })))
    );

    combineLatest(countObservables).subscribe({
      next: (results) => {
        const newCounts = new Map<string, number>();
        results.forEach((result) => {
          newCounts.set(result.folderId, result.count);
        });
        this._folderItemCounts.set(newCounts);

        // Update folder sizes in the current files list
        this.updateFolderSizes();
      },
      error: (error) => {
        console.error("Error loading folder item counts:", error);
      },
    });
  }

  // Method to refresh counts for current folder items
  refreshCurrentFolderCounts(): void {
    const currentFiles = this._files();
    const folderItems = currentFiles.filter(file => file.type === 'folder');
    
    if (folderItems.length === 0) {
      return;
    }

    const countObservables = folderItems.map((folder) =>
      this.apiService
        .getItems(folder.id)
        .pipe(map((items) => ({ folderId: folder.id, count: items.length })))
    );

    combineLatest(countObservables).subscribe({
      next: (results) => {
        const currentCounts = this._folderItemCounts();
        const newCounts = new Map(currentCounts);
        
        results.forEach((result) => {
          newCounts.set(result.folderId, result.count);
        });
        
        this._folderItemCounts.set(newCounts);
        this.updateFolderSizes();
      },
      error: (error) => {
        console.error("Error refreshing current folder counts:", error);
      },
    });
  }

  private updateFolderSizes(): void {
    const currentFiles = this._files();
    const counts = this._folderItemCounts();

    const updatedFiles = currentFiles.map((file) => {
      if (file.type === "folder") {
        const count = counts.get(file.id) || 0;
        return {
          ...file,
          size:
            count === 0 ? "Empty" : count === 1 ? "1 item" : `${count} items`,
        };
      }
      return file;
    });

    this._files.set(updatedFiles);
  }

  refreshFolderCounts(): void {
    this.loadFolderItemCounts();
  }

  // Public method to refresh counts for current folder items
  refreshCurrentFolderItemCounts(): void {
    this.refreshCurrentFolderCounts();
  }

  refreshAllFolders(): Observable<FileItem[]> {
    return this.getAllFolders();
  }

  // Navigation methods
  navigateToFolder(folderId: string, folderName: string) {
    const newPath = [...this._currentPath(), folderName];
    this._currentPath.set(newPath);
    this._currentFolderId.set(folderId);
    this.loadFolderContents(folderId);
  }

  navigateToPath(path: string[], folderId?: string | null) {
    // Clear files and set loading immediately to prevent showing previous content
    this._files.set([]);
    this._isLoading.set(true);

    this._currentPath.set(path);
    this._currentFolderId.set(folderId || null);

    // If no folderId provided, try to resolve it from the path
    if (!folderId && path.length > 0) {
      // For nested paths, we need to find the folder ID of the last folder in the path
      this.resolveFolderIdFromPath(path);
    } else {
      this.loadFolderContents(folderId);
    }
  }

  navigateToFolderByName(folderName: string, parentFolderId?: string | null) {
    // Find the folder by name in the current files or search for it
    const currentFiles = this._files();
    const folder = currentFiles.find(
      (file) => file.type === "folder" && file.name === folderName
    );

    if (folder) {
      // Found the folder, navigate to it
      const newPath = [...this._currentPath(), folderName];
      this.navigateToPath(newPath, folder.id);
    } else {
      // Folder not found in current view, try to navigate using the name as ID
      // This might happen when navigating directly via URL
      const newPath = [...this._currentPath(), folderName];
      this.navigateToPath(newPath, folderName);
    }
  }

  private resolveFolderIdFromPath(path: string[]) {
    // Start from root and navigate through each folder in the path
    let currentFolderId: string | null = null;
    let currentPath: string[] = [];

    // Load root first to get the initial folders (without showing them)
    this.apiService.getItems(null).subscribe({
      next: (apiItems) => {
        // Filter root items
        const rootItems = apiItems.filter((item) => item.parentId === null);
        this.navigateToTargetFolder(
          rootItems,
          path,
          0,
          currentFolderId,
          currentPath
        );
      },
      error: (error) => {
        console.error("Error loading root:", error);
        this._isLoading.set(false);
      },
    });
  }

  private navigateToTargetFolder(
    items: any[],
    path: string[],
    folderIndex: number,
    currentFolderId: string | null,
    currentPath: string[]
  ) {
    if (folderIndex >= path.length) {
      // We've reached the end of the path, load the final folder contents
      this.loadFolderContents(currentFolderId);
      return;
    }

    const targetFolderName = path[folderIndex];
    const targetFolder = items.find(
      (item) => item.folder && item.name === targetFolderName
    );

    if (targetFolder) {
      currentFolderId = targetFolder.id;
      currentPath.push(targetFolderName);
      this._currentPath.set([...currentPath]);
      this._currentFolderId.set(currentFolderId);

      // Load the contents of this folder to continue navigation (without showing them)
      this.apiService.getItems(currentFolderId).subscribe({
        next: (apiItems) => {
          // Filter items for current folder
          const filteredItems = apiItems.filter(
            (item) => item.parentId === currentFolderId
          );
          this.navigateToTargetFolder(
            filteredItems,
            path,
            folderIndex + 1,
            currentFolderId,
            currentPath
          );
        },
        error: (error) => {
          console.error("Error loading folder:", error);
          this._isLoading.set(false);
        },
      });
    } else {
      console.error("Folder not found:", targetFolderName);
      // Store the missing folder name
      this._missingFolderName.set(targetFolderName);
      // Store the last valid path and folder ID for navigation
      this._lastValidPath = [...currentPath];
      this._lastValidFolderId = currentFolderId;
      // If folder not found, load the current folder contents first, then set error
      this.loadFolderContents(currentFolderId);
      // Set error after a short delay to ensure it's not cleared by loadFolderContents
      setTimeout(() => {
        this._error.set(`Failed to load folder contents`);
      }, 100);
    }
  }

  private loadFolderContents(folderId?: string | null) {
    this._isLoading.set(true);
    this._error.set(null);
    // Files already cleared in navigateToPath to prevent showing previous content

    this.apiService.getItems(folderId).subscribe({
      next: (apiItems) => {
        // Filter items to show only those in the current folder
        const filteredItems = apiItems.filter((item) => {
          // If we're at root (folderId is null), show only items with parentId === null
          if (folderId === null) {
            return item.parentId === null;
          }
          // Otherwise, show only items with the current folderId as parent
          return item.parentId === folderId;
        });

        const fileItems = filteredItems.map((item) =>
          this.convertApiItemToFileItem(item)
        );
        this._files.set(fileItems);
        this._isLoading.set(false);
        this.clearSelection();

        // Update folder sizes if counts are available
        this.updateFolderSizes();
        
        // Refresh counts for the current folder items
        this.refreshCurrentFolderCounts();
      },
      error: (error) => {
        console.error("Error loading folder contents:", error);
        this._error.set(error.message || "Failed to load folder contents");
        this._isLoading.set(false);
        this._files.set([]);
      },
    });
  }

  // Selection methods
  toggleSelection(itemId: string) {
    const selected = new Set(this._selectedItems());
    if (selected.has(itemId)) {
      selected.delete(itemId);
    } else {
      selected.add(itemId);
    }
    this._selectedItems.set(selected);
  }

  selectAll() {
    const allIds = new Set(this._files().map((f) => f.id));
    this._selectedItems.set(allIds);
  }

  clearSelection() {
    this._selectedItems.set(new Set());
  }

  isSelected(itemId: string): boolean {
    return this._selectedItems().has(itemId);
  }

  // View methods
  setViewMode(mode: "grid" | "list") {
    this._viewMode.set(mode);
  }

  setSortBy(sortBy: "name" | "date" | "size" | "type") {
    this._sortBy.set(sortBy);
  }

  toggleSortOrder() {
    this._sortOrder.set(this._sortOrder() === "asc" ? "desc" : "asc");
  }

  // File operations
  createFolder(name: string): Observable<FileItem> {
    const currentFolderId = this._currentFolderId();
    return this.apiService
      .createFolder(name, currentFolderId || undefined)
      .pipe(
        map((apiItem) => this.convertApiItemToFileItem(apiItem)),
        tap(() => {
          // Reload current folder to show the new folder
          this.loadFolderContents(currentFolderId);
          // Refresh folder counts to update all folder sizes
          this.refreshFolderCounts();
          // Refresh all folders list for move modal
          this.refreshAllFolders().subscribe();
          // Show success snackbar
          this.snackbarService.success(`Folder "${name}" created successfully`);
        }),
        catchError((error) => {
          // Show specific error messages based on the error
          let errorMessage = "Failed to create folder";

          if (error.message) {
            if (
              error.message.includes("already exists") ||
              error.message.includes("duplicate")
            ) {
              errorMessage = `A folder with the name "${name}" already exists`;
            } else {
              errorMessage = error.message;
            }
          }

          this.snackbarService.error(errorMessage);
          throw error;
        })
      );
  }

  uploadFiles(files: File[]): Observable<any> {
    const currentFolderId = this._currentFolderId();
    return this.apiService.uploadFiles(files, currentFolderId || undefined);
  }

  /**
   * Process directory upload by creating folder structure and uploading files
   * @param files - Array of files from directory selection
   * @param rootFolderName - Name of the root folder to create
   */
  uploadDirectory(
    files: File[],
    rootFolderName?: string,
    allFolders: string[] = []
  ): Observable<any> {
    const currentFolderId = this._currentFolderId();

    // Process files to extract directory structure
    const directoryItems = this.processDirectoryStructure(
      files,
      rootFolderName
    );

    // Step 1: Create root folder first if it doesn't exist
    // Always create the root folder, even if it's empty
    return this.createRootFolderIfNeeded(rootFolderName, currentFolderId).pipe(
      switchMap((createdRootFolderId) => {
        // Step 2: Upload files to root folder first
        return this.uploadFilesToRootFolder(
          directoryItems,
          createdRootFolderId
        ).pipe(
          switchMap(() => {
            // Step 3: Create all subfolders (including empty ones)
            return this.createAllFolders(
              directoryItems,
              createdRootFolderId,
              allFolders
            );
          }),
          switchMap((folderMap) => {
            // Step 4: Upload files to subfolders
            return this.uploadFilesToSubfolders(
              directoryItems,
              folderMap,
              createdRootFolderId
            );
          })
        );
      }),
      switchMap(() => {
        return of(null);
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  /**
   * Process files to extract directory structure
   * @param files - Array of files from directory selection
   * @param rootFolderName - Optional root folder name
   */
  private processDirectoryStructure(
    files: File[],
    rootFolderName?: string
  ): DirectoryUploadItem[] {
    const directoryItems: DirectoryUploadItem[] = [];

    files.forEach((file) => {
      // Get the relative path from the file's webkitRelativePath
      let relativePath = (file as any).webkitRelativePath || file.name;

      // Only fallback to rootFolderName if no webkitRelativePath exists
      if (!(file as any).webkitRelativePath && rootFolderName) {
        // This shouldn't happen with our new drag and drop logic, but keep as fallback
        relativePath = `${rootFolderName}/${file.name}`;
      }

      // Split path into folder segments
      const pathSegments = relativePath.split("/");
      // Remove the filename from the path to get only folder segments
      const folderPath = pathSegments.slice(0, -1);
      directoryItems.push({
        file,
        relativePath,
        folderPath,
      });
    });

    return directoryItems;
  }

  /**
   * Upload files to root folder
   * @param directoryItems - Array of directory upload items
   * @param rootFolderId - Root folder ID
   */
  private uploadFilesToRootFolder(
    directoryItems: DirectoryUploadItem[],
    rootFolderId: string | null
  ): Observable<any> {
    // Filter files that belong to the root folder (no subfolder path)
    const rootFiles = directoryItems.filter(
      (item) => item.folderPath.length === 0
    );

    if (rootFiles.length === 0) {
      return of([]);
    }

    // Upload files to root folder
    return this.apiService.uploadFiles(
      rootFiles.map((item) => item.file),
      rootFolderId || undefined
    );
  }

  /**
   * Upload files to subfolders
   * @param directoryItems - Array of directory upload items
   * @param folderMap - Map of folder paths to folder IDs
   * @param rootFolderId - Root folder ID
   */
  private uploadFilesToSubfolders(
    directoryItems: DirectoryUploadItem[],
    folderMap: Map<string, string>,
    rootFolderId: string | null
  ): Observable<any> {
    // Filter files that belong to subfolders (have folder path)
    const subfolderFiles = directoryItems.filter(
      (item) => item.folderPath.length > 0
    );

    if (subfolderFiles.length === 0) {
      return of([]);
    }

    // Upload files to their respective subfolders
    return from(subfolderFiles).pipe(
      concatMap((item) => {
        const folderPath = item.folderPath.join("/");
        const folderId = folderMap.get(folderPath) || rootFolderId;

        return this.apiService.uploadSingleFile(
          item.file,
          folderId || undefined
        );
      })
    );
  }

  /**
   * Create root folder if needed and return its ID
   * @param rootFolderName - Name of the root folder
   * @param parentId - Parent folder ID
   */
  private createRootFolderIfNeeded(
    rootFolderName: string | undefined,
    parentId: string | null
  ): Observable<string | null> {
    if (!rootFolderName) {
      return of(parentId);
    }

    // Check if root folder already exists
    return this.apiService.getItems(parentId).pipe(
      switchMap((items) => {
        const existingFolder = items.find(
          (item) =>
            item.folder &&
            item.name === rootFolderName &&
            item.parentId === parentId
        );

        if (existingFolder) {
          return of(existingFolder.id);
        }

        // Create the root folder
        return this.apiService
          .createFolder(rootFolderName, parentId || undefined)
          .pipe(
            map((newFolder) => {
              return newFolder.id;
            })
          );
      })
    );
  }

  /**
   * Create all folders first and return a map of folder paths to folder IDs
   * @param directoryItems - Array of directory upload items
   * @param parentId - Parent folder ID
   */
  private createAllFolders(
    directoryItems: DirectoryUploadItem[],
    parentId: string | null,
    allFolders: string[] = []
  ): Observable<Map<string, string>> {
    // Get unique folder paths (excluding the root folder which is already created)
    const folderPaths = new Set<string>();

    // Add folders from files
    directoryItems.forEach((item) => {
      item.folderPath.forEach((_, index) => {
        const path = item.folderPath.slice(0, index + 1).join("/");
        if (path) {
          // Skip the root folder (first segment) as it's already created
          const pathSegments = path.split("/");
          if (pathSegments.length > 1) {
            // This is a subfolder, add it
            folderPaths.add(path);
          }
        }
      });
    });

    // Add empty folders from drag and drop
    allFolders.forEach((folderPath) => {
      // Skip the root folder as it's already created by createRootFolderIfNeeded
      const pathSegments = folderPath.split("/");
      if (pathSegments.length > 1) {
        // This is a subfolder, add it
        folderPaths.add(folderPath);
      }
    });

    // Create folders in order (parent folders first)
    const sortedPaths = Array.from(folderPaths).sort((a, b) => {
      const aDepth = a.split("/").length;
      const bDepth = b.split("/").length;
      return aDepth - bDepth;
    });

    // Create folder map to store path -> folderId
    const folderMap = new Map<string, string>();

    // Add the root folder to the map (parentId is the root folder ID)
    if (parentId) {
      folderMap.set("", parentId);
    }

    // Create folders sequentially
    return this.createFoldersSequentially(sortedPaths, parentId, folderMap);
  }

  /**
   * Create folders sequentially and build the folder map
   * @param sortedPaths - Array of folder paths sorted by depth
   * @param parentId - Parent folder ID
   * @param folderMap - Map to store path -> folderId
   */
  private createFoldersSequentially(
    sortedPaths: string[],
    parentId: string | null,
    folderMap: Map<string, string>
  ): Observable<Map<string, string>> {
    if (sortedPaths.length === 0) {
      return of(folderMap);
    }

    const path = sortedPaths[0];
    const remainingPaths = sortedPaths.slice(1);
    const pathSegments = path.split("/");
    const folderName = pathSegments[pathSegments.length - 1];
    const parentPath = pathSegments.slice(0, -1).join("/");

    // Get parent folder ID from map or use root parentId
    const parentFolderId = parentPath
      ? folderMap.get(parentPath) || parentId
      : parentId;

    return this.apiService
      .createFolder(folderName, parentFolderId || undefined)
      .pipe(
        switchMap((newFolder) => {
          // Add to map
          folderMap.set(path, newFolder.id);

          // Continue with remaining paths
          return this.createFoldersSequentially(
            remainingPaths,
            parentId,
            folderMap
          );
        }),
        catchError((error) => {
          throw error;
        })
      );
  }

  /**
   * Find or create parent folder for a given path
   * @param pathSegments - Array of path segments
   * @param rootParentId - Root parent ID
   */
  private findOrCreateParentFolder(
    pathSegments: string[],
    rootParentId: string | null
  ): Observable<ApiItem> {
    if (pathSegments.length === 0) {
      return of({} as ApiItem);
    }

    const folderName = pathSegments[0];
    const remainingPath = pathSegments.slice(1);

    // Check if folder already exists
    return this.apiService.getItems(rootParentId).pipe(
      switchMap((items) => {
        const existingFolder = items.find(
          (item) =>
            item.folder &&
            item.name === folderName &&
            item.parentId === rootParentId
        );

        if (existingFolder) {
          // Folder exists, continue with remaining path
          if (remainingPath.length > 0) {
            return this.findOrCreateParentFolder(
              remainingPath,
              existingFolder.id
            );
          }
          return of(existingFolder);
        } else {
          // Create folder and continue with remaining path
          return this.apiService
            .createFolder(folderName, rootParentId || undefined)
            .pipe(
              switchMap((newFolder) => {
                if (remainingPath.length > 0) {
                  return this.findOrCreateParentFolder(
                    remainingPath,
                    newFolder.id
                  );
                }
                return of(newFolder);
              })
            );
        }
      })
    );
  }

  /**
   * Find folder ID by path
   * @param folderPath - Folder path
   * @param rootParentId - Root parent ID
   */
  private findFolderByPath(
    folderPath: string,
    rootParentId: string | null
  ): Observable<string | null> {
    if (!folderPath) {
      return of(rootParentId);
    }

    const pathSegments = folderPath.split("/");
    let currentParentId = rootParentId;

    // Traverse path to find folder
    return this.apiService.getItems(currentParentId).pipe(
      switchMap((items) => {
        const segment = pathSegments[0];
        const remainingPath = pathSegments.slice(1);

        const folder = items.find(
          (item) =>
            item.folder &&
            item.name === segment &&
            item.parentId === currentParentId
        );

        if (folder) {
          if (remainingPath.length > 0) {
            return this.findFolderByPath(remainingPath.join("/"), folder.id);
          }
          return of(folder.id);
        }

        return of(null);
      })
    );
  }

  renameItem(itemId: string, newName: string): Observable<FileItem> {
    return this.apiService.renameItem(itemId, newName).pipe(
      map((apiItem) => this.convertApiItemToFileItem(apiItem)),
      tap((fileItem) => {
        // Reload current folder to show the updated name
        this.loadFolderContents(this._currentFolderId());
        // Refresh folder list for move modal if it's a folder
        if (fileItem.type === "folder") {
          this.getAllFolders().subscribe();
        }
        // Show success snackbar
        this.snackbarService.success(
          `${fileItem.type === "folder" ? "Folder" : "File"} "${fileItem.name}" renamed successfully!`
        );
      }),
      catchError((error) => {
        // Show error snackbar
        this.snackbarService.error(
          `Failed to rename item: ${error.message || "Unknown error"}`
        );
        throw error;
      })
    );
  }

  deleteItem(item: FileItem): Observable<void> {
    return this.apiService.deleteItem(item.id).pipe(
      tap(() => {
        // Reload current folder to reflect changes
        this.loadFolderContents(this._currentFolderId());
        // Refresh folder counts to update all folder sizes
        this.refreshFolderCounts();
        // Refresh all folders list for move modal
        this.refreshAllFolders().subscribe();
        // Show success snackbar
        this.snackbarService.success(
          `${item.type === "folder" ? "Folder" : "File"} deleted successfully`
        );
      }),
      catchError((error) => {
        // Show specific error messages based on the error
        let errorMessage = `Failed to delete ${item.type}`;

        if (error.message) {
          if (
            error.message.includes("Cannot delete folder that contains items")
          ) {
            errorMessage =
              "Cannot delete folder that contains items. Please empty the folder first.";
          } else if (error.message.includes("NOT_FOUND")) {
            errorMessage = "Item not found. It may have been already deleted.";
          } else {
            errorMessage = error.message;
          }
        }

        this.snackbarService.error(errorMessage);
        throw error;
      })
    );
  }

  moveItem(itemId: string, newParentId: string | null): Observable<FileItem> {
    return this.apiService.moveItem(itemId, newParentId).pipe(
      map((apiItem) => this.convertApiItemToFileItem(apiItem)),
      tap((fileItem) => {
        // Reload current folder to reflect changes
        this.loadFolderContents(this._currentFolderId());
        // Refresh all folders first, then refresh counts
        this.refreshAllFolders().subscribe({
          next: () => {
            // Now refresh folder counts with updated folder list
            this.refreshFolderCounts();
          },
          error: (error) => {
            console.error("Error refreshing folders:", error);
            // Still try to refresh counts even if folder refresh fails
            this.refreshFolderCounts();
          },
        });
        // Show success snackbar
        const destination = newParentId ? "folder" : "root";
        this.snackbarService.success(
          `${fileItem.type === "folder" ? "Folder" : "File"} "${fileItem.name}" moved to ${destination} successfully!`
        );
      }),
      catchError((error) => {
        // Show error snackbar
        this.snackbarService.error(
          `Failed to move item: ${error.message || "Unknown error"}`
        );
        throw error;
      })
    );
  }

  downloadFile(itemId: string): Observable<Blob> {
    return this.apiService.downloadFile(itemId);
  }

  getAllFolders(): Observable<FileItem[]> {
    return this.apiService.getAllFolders().pipe(
      map((apiItems) =>
        apiItems.map((item) => this.convertApiItemToFileItem(item))
      ),
      tap((folders) => {
        this._allFolders.set(folders);
      })
    );
  }

  getFileIcon(
    fileName: string,
    isFolder: boolean = false,
    mimeType?: string
  ): string {
    if (isFolder) {
      return "fa-solid fa-folder";
    }

    const fileNameLower = fileName.toLowerCase();

    // Image files
    if (
      mimeType?.startsWith("image/") ||
      /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/.test(fileNameLower)
    ) {
      return "fa-solid fa-file-image";
    }

    // Video files
    if (
      mimeType?.startsWith("video/") ||
      /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/.test(fileNameLower)
    ) {
      return "fa-solid fa-file-video";
    }

    // Audio files
    if (
      mimeType?.startsWith("audio/") ||
      /\.(mp3|wav|flac|aac|ogg)$/.test(fileNameLower)
    ) {
      return "fa-solid fa-file-audio";
    }

    // Document files
    if (mimeType === "application/pdf" || fileNameLower.endsWith(".pdf")) {
      return "fa-solid fa-file-pdf";
    }

    if (
      mimeType?.includes("wordprocessingml") ||
      /\.(doc|docx)$/.test(fileNameLower)
    ) {
      return "fa-solid fa-file-word";
    }

    if (
      mimeType?.includes("spreadsheetml") ||
      /\.(xls|xlsx)$/.test(fileNameLower)
    ) {
      return "fa-solid fa-file-excel";
    }

    if (
      mimeType?.includes("presentationml") ||
      /\.(ppt|pptx)$/.test(fileNameLower)
    ) {
      return "fa-solid fa-file-powerpoint";
    }

    // Archive files
    if (/\.(zip|rar|7z|tar|gz)$/.test(fileNameLower)) {
      return "fa-solid fa-file-zipper";
    }

    // Text files
    if (
      mimeType?.startsWith("text/") ||
      /\.(txt|md|json|xml|html|css|js|ts)$/.test(fileNameLower)
    ) {
      return "fa-solid fa-file-lines";
    }

    // Default file icon
    return "fa-solid fa-file";
  }

  getFileColor(
    fileName: string,
    isFolder: boolean = false,
    mimeType?: string
  ): string {
    if (isFolder) {
      return "text-yellow-500";
    }

    const fileNameLower = fileName.toLowerCase();

    // Image files
    if (
      mimeType?.startsWith("image/") ||
      /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/.test(fileNameLower)
    ) {
      return "text-green-500";
    }

    // Video files
    if (
      mimeType?.startsWith("video/") ||
      /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/.test(fileNameLower)
    ) {
      return "text-purple-500";
    }

    // Audio files
    if (
      mimeType?.startsWith("audio/") ||
      /\.(mp3|wav|flac|aac|ogg)$/.test(fileNameLower)
    ) {
      return "text-pink-500";
    }

    // Document files
    if (mimeType === "application/pdf" || fileNameLower.endsWith(".pdf")) {
      return "text-red-500";
    }

    if (
      mimeType?.includes("wordprocessingml") ||
      /\.(doc|docx)$/.test(fileNameLower)
    ) {
      return "text-blue-600";
    }

    if (
      mimeType?.includes("spreadsheetml") ||
      /\.(xls|xlsx)$/.test(fileNameLower)
    ) {
      return "text-green-600";
    }

    if (
      mimeType?.includes("presentationml") ||
      /\.(ppt|pptx)$/.test(fileNameLower)
    ) {
      return "text-orange-500";
    }

    // Archive files
    if (/\.(zip|rar|7z|tar|gz)$/.test(fileNameLower)) {
      return "text-yellow-600";
    }

    // Text files
    if (
      mimeType?.startsWith("text/") ||
      /\.(txt|md|json|xml|html|css|js|ts)$/.test(fileNameLower)
    ) {
      return "text-gray-600";
    }

    // Default color
    return "text-gray-500";
  }

  getFileType(fileName: string): string {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const typeMap: { [key: string]: string } = {
      // Documents
      pdf: "PDF Document",
      doc: "Word Document",
      docx: "Word Document",
      xls: "Excel Spreadsheet",
      xlsx: "Excel Spreadsheet",
      ppt: "PowerPoint Presentation",
      pptx: "PowerPoint Presentation",

      // Images
      jpg: "JPEG Image",
      jpeg: "JPEG Image",
      png: "PNG Image",
      gif: "GIF Image",
      bmp: "Bitmap Image",
      svg: "SVG Vector Image",
      webp: "WebP Image",

      // Videos
      mp4: "MP4 Video",
      avi: "AVI Video",
      mov: "QuickTime Video",
      wmv: "Windows Media Video",
      flv: "Flash Video",
      webm: "WebM Video",
      mkv: "Matroska Video",

      // Audio
      mp3: "MP3 Audio",
      wav: "WAV Audio",
      flac: "FLAC Audio",
      aac: "AAC Audio",
      ogg: "OGG Audio",

      // Archives
      zip: "ZIP Archive",
      rar: "RAR Archive",
      "7z": "7-Zip Archive",
      tar: "TAR Archive",
      gz: "GZIP Archive",

      // Text/Code files
      txt: "Text File",
      md: "Markdown File",
      json: "JSON File",
      xml: "XML File",
      html: "HTML File",
      css: "CSS Stylesheet",
      js: "JavaScript File",
      ts: "TypeScript File",
    };
    return typeMap[extension || ""] || "Unknown File";
  }

  /**
   * Clear any error state
   */
  clearError(): void {
    this._error.set(null);
    this._missingFolderName.set(null);
  }

  /**
   * Refresh current folder
   */
  refresh(): void {
    this.loadFolderContents(this._currentFolderId());
  }

  /**
   * Set item to rename
   */
  setItemToRename(item: FileItem): void {
    this._itemToRename.set(item);
  }

  /**
   * Clear item to rename
   */
  clearItemToRename(): void {
    this._itemToRename.set(null);
  }

  /**
   * Set item to move
   */
  setItemToMove(item: FileItem): void {
    this._itemToMove.set(item);
  }

  /**
   * Clear item to move
   */
  clearItemToMove(): void {
    this._itemToMove.set(null);
  }

  /**
   * Set item to delete
   */
  setItemToDelete(item: FileItem): void {
    this._itemToDelete.set(item);
  }

   /**
    * Clear item to delete
    */
   clearItemToDelete(): void {
     this._itemToDelete.set(null);
   }

   /**
    * Format file size for display
    * @param bytes - File size in bytes
    */
   formatFileSize(bytes: number): string {
     if (bytes === 0) return "0 B";

     const k = 1024;
     const sizes = ["B", "KB", "MB", "GB"];
     const i = Math.floor(Math.log(bytes) / Math.log(k));

     return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
   }

  /**
   * Get the last valid path when a folder doesn't exist
   */
  getLastValidPath(): { path: string[]; folderId: string | null } {
    return {
      path: this._lastValidPath,
      folderId: this._lastValidFolderId,
    };
  }
}
