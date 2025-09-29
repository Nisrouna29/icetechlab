import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService, ApiItem, DirectoryUploadItem } from './api.service';
import { SnackbarService } from './snackbar.service';
import { Observable, combineLatest, of, from } from 'rxjs';
import { map, tap, catchError, switchMap, concatMap } from 'rxjs/operators';

export interface FileItem {
	id: string;
	name: string;
	type: 'file' | 'folder';
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

export interface NavigationState {
	currentPath: string[];
	history: string[][];
	historyIndex: number;
}

@Injectable({
	providedIn: 'root',
})
export class FileManagerService {
	// Signals for state management
	private _files = signal<FileItem[]>([]);
	private _selectedItems = signal<Set<string>>(new Set());
	private _currentPath = signal<string[]>([]);
	private _navigationHistory = signal<string[][]>([]);
	private _historyIndex = signal<number>(-1);
	private _viewMode = signal<'grid' | 'list'>('grid');
	private _sortBy = signal<'name' | 'date' | 'size' | 'type'>('name');
	private _sortOrder = signal<'asc' | 'desc'>('asc');
	private _isLoading = signal<boolean>(true);
	private _contextMenuVisible = signal<boolean>(false);
	private _contextMenuPosition = signal<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});
	private _contextMenuItem = signal<FileItem | null>(null);
	private _currentFolderId = signal<string | null>(null);
	private _error = signal<string | null>(null);
	private _itemToRename = signal<FileItem | null>(null);
	private _itemToMove = signal<FileItem | null>(null);
	private _itemsToDelete = signal<string[]>([]);
	private _allFolders = signal<FileItem[]>([]);
	private _folderItemCounts = signal<Map<string, number>>(new Map());

	// Computed signals
	files = computed(() => this._files());
	selectedItems = computed(() => this._selectedItems());
	currentPath = computed(() => this._currentPath());
	viewMode = computed(() => this._viewMode());
	isLoading = computed(() => this._isLoading());
	currentFolderId = computed(() => this._currentFolderId());
	error = computed(() => this._error());
	itemToRename = computed(() => this._itemToRename());
	itemToMove = computed(() => this._itemToMove());
	itemsToDelete = computed(() => this._itemsToDelete());
	allFolders = computed(() => this._allFolders());
	folderItemCounts = computed(() => this._folderItemCounts());

	// Navigation computed
	canGoBack = computed(() => this._historyIndex() > 0);
	canGoForward = computed(
		() => this._historyIndex() < this._navigationHistory().length - 1
	);

	// Public methods
	clearFiles() {
		this._files.set([]);
		this._isLoading.set(true);
	}

	// Breadcrumb computed
	breadcrumbPath = computed(() => {
		const path = this._currentPath();

		// If we're at root (empty path), just show "Root"
		if (path.length === 0) {
			return [{ name: 'Root', path: [] }];
		}

		// If we're at home (path is just ['home']), just show "Root"
		if (path.length === 1 && path[0] === 'home') {
			return [{ name: 'Root', path: [] }];
		}

		// Always start with Root
		const breadcrumb: Array<{ name: string; path: string[] }> = [
			{ name: 'Root', path: [] },
		];

		// Add each folder in the path, filtering out 'home'
		const filteredPath = path.filter(segment => segment !== 'home');
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
			error: error => {
				console.error('Error loading folders:', error);
			},
		});
	}

	/**
	 * Load root folder contents
	 */
	private loadRootFolder(): void {
		this._currentFolderId.set(null);
		this._currentPath.set([]);
		this._navigationHistory.set([[]]);
		this._historyIndex.set(0);
		this.loadFolderContents(null);
	}

	/**
	 * Convert API item to FileItem
	 */
	private convertApiItemToFileItem(apiItem: ApiItem): FileItem {
		return {
			id: apiItem.id,
			name: apiItem.name,
			type: apiItem.folder ? 'folder' : 'file',
			size: apiItem.folder
				? 'Loading...'
				: this.apiService.formatFileSize(apiItem.size || 0),
			modified: new Date(apiItem.modification).toLocaleDateString(),
			icon: this.apiService.getFileIcon(apiItem),
			color: this.apiService.getFileColor(apiItem),
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

		const countObservables = folders.map(folder =>
			this.apiService
				.getItems(folder.id)
				.pipe(map(items => ({ folderId: folder.id, count: items.length })))
		);

		combineLatest(countObservables).subscribe({
			next: results => {
				const newCounts = new Map<string, number>();
				results.forEach(result => {
					newCounts.set(result.folderId, result.count);
				});
				this._folderItemCounts.set(newCounts);

				// Update folder sizes in the current files list
				this.updateFolderSizes();
			},
			error: error => {
				console.error('Error loading folder item counts:', error);
			},
		});
	}

	private updateFolderSizes(): void {
		const currentFiles = this._files();
		const counts = this._folderItemCounts();

		const updatedFiles = currentFiles.map(file => {
			if (file.type === 'folder') {
				const count = counts.get(file.id) || 0;
				return {
					...file,
					size:
						count === 0 ? 'Empty' : count === 1 ? '1 item' : `${count} items`,
				};
			}
			return file;
		});

		this._files.set(updatedFiles);
	}

	refreshFolderCounts(): void {
		this.loadFolderItemCounts();
	}

	refreshAllFolders(): Observable<FileItem[]> {
		return this.getAllFolders();
	}

	// Navigation methods
	navigateToFolder(folderId: string, folderName: string) {
		const newPath = [...this._currentPath(), folderName];
		this._currentPath.set(newPath);
		this._currentFolderId.set(folderId);
		this.addToHistory(newPath);
		this.loadFolderContents(folderId);
	}

	navigateToPath(path: string[], folderId?: string | null) {
		// Clear files and set loading immediately to prevent showing previous content
		this._files.set([]);
		this._isLoading.set(true);

		this._currentPath.set(path);
		this._currentFolderId.set(folderId || null);
		this.addToHistory(path);

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
			file => file.type === 'folder' && file.name === folderName
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

	navigateBack() {
		if (this.canGoBack()) {
			const newIndex = this._historyIndex() - 1;
			this._historyIndex.set(newIndex);
			const path = this._navigationHistory()[newIndex];
			this._currentPath.set(path);
			// For simplicity, we'll reload the current folder
			// In a real app, you'd want to store folder IDs in history
			this.loadFolderContents(this._currentFolderId());
		}
	}

	navigateForward() {
		if (this.canGoForward()) {
			const newIndex = this._historyIndex() + 1;
			this._historyIndex.set(newIndex);
			const path = this._navigationHistory()[newIndex];
			this._currentPath.set(path);
			// For simplicity, we'll reload the current folder
			// In a real app, you'd want to store folder IDs in history
			this.loadFolderContents(this._currentFolderId());
		}
	}

	private addToHistory(path: string[]) {
		const history = this._navigationHistory();
		const currentIndex = this._historyIndex();

		// Remove any future history if we're not at the end
		const newHistory = history.slice(0, currentIndex + 1);
		newHistory.push([...path]);

		this._navigationHistory.set(newHistory);
		this._historyIndex.set(newHistory.length - 1);
	}

	private resolveFolderIdFromPath(path: string[]) {
		// Start from root and navigate through each folder in the path
		let currentFolderId: string | null = null;
		let currentPath: string[] = [];

		// Load root first to get the initial folders (without showing them)
		this.apiService.getItems(null).subscribe({
			next: apiItems => {
				// Filter root items
				const rootItems = apiItems.filter(item => item.parentId === null);
				this.navigateToTargetFolder(
					rootItems,
					path,
					0,
					currentFolderId,
					currentPath
				);
			},
			error: error => {
				console.error('Error loading root:', error);
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
			item => item.folder && item.name === targetFolderName
		);

		if (targetFolder) {
			currentFolderId = targetFolder.id;
			currentPath.push(targetFolderName);
			this._currentPath.set([...currentPath]);
			this._currentFolderId.set(currentFolderId);

			// Load the contents of this folder to continue navigation (without showing them)
			this.apiService.getItems(currentFolderId).subscribe({
				next: apiItems => {
					// Filter items for current folder
					const filteredItems = apiItems.filter(
						item => item.parentId === currentFolderId
					);
					this.navigateToTargetFolder(
						filteredItems,
						path,
						folderIndex + 1,
						currentFolderId,
						currentPath
					);
				},
				error: error => {
					console.error('Error loading folder:', error);
					this._isLoading.set(false);
				},
			});
		} else {
			console.error('Folder not found:', targetFolderName);
			// If folder not found, just load the current folder contents
			this.loadFolderContents(currentFolderId);
		}
	}

	private loadFolderContents(folderId?: string | null) {
		this._isLoading.set(true);
		this._error.set(null);
		// Files already cleared in navigateToPath to prevent showing previous content

		this.apiService.getItems(folderId).subscribe({
			next: apiItems => {
				// Filter items to show only those in the current folder
				const filteredItems = apiItems.filter(item => {
					// If we're at root (folderId is null), show only items with parentId === null
					if (folderId === null) {
						return item.parentId === null;
					}
					// Otherwise, show only items with the current folderId as parent
					return item.parentId === folderId;
				});

				const fileItems = filteredItems.map(item =>
					this.convertApiItemToFileItem(item)
				);
				this._files.set(fileItems);
				this._isLoading.set(false);
				this.clearSelection();

				// Update folder sizes if counts are available
				this.updateFolderSizes();
			},
			error: error => {
				console.error('Error loading folder contents:', error);
				this._error.set(error.message || 'Failed to load folder contents');
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
		const allIds = new Set(this._files().map(f => f.id));
		this._selectedItems.set(allIds);
	}

	clearSelection() {
		this._selectedItems.set(new Set());
	}

	isSelected(itemId: string): boolean {
		return this._selectedItems().has(itemId);
	}

	// View methods
	setViewMode(mode: 'grid' | 'list') {
		this._viewMode.set(mode);
	}

	setSortBy(sortBy: 'name' | 'date' | 'size' | 'type') {
		this._sortBy.set(sortBy);
	}

	toggleSortOrder() {
		this._sortOrder.set(this._sortOrder() === 'asc' ? 'desc' : 'asc');
	}

	// Context menu methods
	showContextMenu(item: FileItem, x: number, y: number) {
		this._contextMenuItem.set(item);
		this._contextMenuPosition.set({ x, y });
		this._contextMenuVisible.set(true);
	}

	hideContextMenu() {
		this._contextMenuVisible.set(false);
		this._contextMenuItem.set(null);
	}

	// File operations
	createFolder(name: string): Observable<FileItem> {
		const currentFolderId = this._currentFolderId();
		return this.apiService
			.createFolder(name, currentFolderId || undefined)
			.pipe(
				map(apiItem => this.convertApiItemToFileItem(apiItem)),
				tap(() => {
					// Reload current folder to show the new folder
					this.loadFolderContents(currentFolderId);
					// Refresh folder counts to update all folder sizes
					this.refreshFolderCounts();
					// Refresh all folders list for move modal
					this.refreshAllFolders().subscribe();
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
			switchMap(createdRootFolderId => {
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
					switchMap(folderMap => {
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
			catchError(error => {
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

		files.forEach(file => {
			// Get the relative path from the file's webkitRelativePath
			let relativePath = (file as any).webkitRelativePath || file.name;

			// Only fallback to rootFolderName if no webkitRelativePath exists
			if (!(file as any).webkitRelativePath && rootFolderName) {
				// This shouldn't happen with our new drag and drop logic, but keep as fallback
				relativePath = `${rootFolderName}/${file.name}`;
			}

			// Split path into folder segments
			const pathSegments = relativePath.split('/');
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
			item => item.folderPath.length === 0
		);

		if (rootFiles.length === 0) {
			return of([]);
		}

		// Upload files to root folder
		return this.apiService.uploadFiles(
			rootFiles.map(item => item.file),
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
			item => item.folderPath.length > 0
		);

		if (subfolderFiles.length === 0) {
			return of([]);
		}

		// Upload files to their respective subfolders
		return from(subfolderFiles).pipe(
			concatMap(item => {
				const folderPath = item.folderPath.join('/');
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
			switchMap(items => {
				const existingFolder = items.find(
					item =>
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
						map(newFolder => {
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
		directoryItems.forEach(item => {
			item.folderPath.forEach((_, index) => {
				const path = item.folderPath.slice(0, index + 1).join('/');
				if (path) {
					// Skip the root folder (first segment) as it's already created
					const pathSegments = path.split('/');
					if (pathSegments.length > 1) {
						// This is a subfolder, add it
						folderPaths.add(path);
					}
				}
			});
		});

		// Add empty folders from drag and drop
		allFolders.forEach(folderPath => {
			// Skip the root folder as it's already created by createRootFolderIfNeeded
			const pathSegments = folderPath.split('/');
			if (pathSegments.length > 1) {
				// This is a subfolder, add it
				folderPaths.add(folderPath);
			}
		});

		// Create folders in order (parent folders first)
		const sortedPaths = Array.from(folderPaths).sort((a, b) => {
			const aDepth = a.split('/').length;
			const bDepth = b.split('/').length;
			return aDepth - bDepth;
		});

		// Create folder map to store path -> folderId
		const folderMap = new Map<string, string>();

		// Add the root folder to the map (parentId is the root folder ID)
		if (parentId) {
			folderMap.set('', parentId);
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
		const pathSegments = path.split('/');
		const folderName = pathSegments[pathSegments.length - 1];
		const parentPath = pathSegments.slice(0, -1).join('/');

		// Get parent folder ID from map or use root parentId
		const parentFolderId = parentPath
			? folderMap.get(parentPath) || parentId
			: parentId;

		return this.apiService
			.createFolder(folderName, parentFolderId || undefined)
			.pipe(
				switchMap(newFolder => {
					// Add to map
					folderMap.set(path, newFolder.id);

					// Continue with remaining paths
					return this.createFoldersSequentially(
						remainingPaths,
						parentId,
						folderMap
					);
				}),
				catchError(error => {
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
			switchMap(items => {
				const existingFolder = items.find(
					item =>
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
							switchMap(newFolder => {
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

		const pathSegments = folderPath.split('/');
		let currentParentId = rootParentId;

		// Traverse path to find folder
		return this.apiService.getItems(currentParentId).pipe(
			switchMap(items => {
				const segment = pathSegments[0];
				const remainingPath = pathSegments.slice(1);

				const folder = items.find(
					item =>
						item.folder &&
						item.name === segment &&
						item.parentId === currentParentId
				);

				if (folder) {
					if (remainingPath.length > 0) {
						return this.findFolderByPath(remainingPath.join('/'), folder.id);
					}
					return of(folder.id);
				}

				return of(null);
			})
		);
	}

	renameItem(itemId: string, newName: string): Observable<FileItem> {
		return this.apiService.renameItem(itemId, newName).pipe(
			map(apiItem => this.convertApiItemToFileItem(apiItem)),
			tap(fileItem => {
				// Reload current folder to show the updated name
				this.loadFolderContents(this._currentFolderId());
				// Show success snackbar
				this.snackbarService.success(
					`${fileItem.type === 'folder' ? 'Folder' : 'File'} "${fileItem.name}" renamed successfully!`
				);
			}),
			catchError(error => {
				// Show error snackbar
				this.snackbarService.error(
					`Failed to rename item: ${error.message || 'Unknown error'}`
				);
				throw error;
			})
		);
	}

	deleteItems(itemIds: string[]): Observable<void> {
		// Delete items one by one
		const deleteObservables = itemIds.map(id => this.apiService.deleteItem(id));

		return new Observable(observer => {
			let completed = 0;
			let hasError = false;

			deleteObservables.forEach(obs => {
				obs.subscribe({
					next: () => {
						completed++;
						if (completed === itemIds.length && !hasError) {
							// Reload current folder to reflect changes
							this.loadFolderContents(this._currentFolderId());
							// Refresh folder counts to update all folder sizes
							this.refreshFolderCounts();
							// Refresh all folders list for move modal
							this.refreshAllFolders().subscribe();
							this.clearSelection();
							observer.next();
							observer.complete();
						}
					},
					error: error => {
						if (!hasError) {
							hasError = true;
							observer.error(error);
						}
					},
				});
			});
		});
	}

	moveItem(itemId: string, newParentId: string | null): Observable<FileItem> {
		return this.apiService.moveItem(itemId, newParentId).pipe(
			map(apiItem => this.convertApiItemToFileItem(apiItem)),
			tap(fileItem => {
				// Reload current folder to reflect changes
				this.loadFolderContents(this._currentFolderId());
				// Refresh folder item counts to update counts in all folders
				this.refreshFolderCounts();
				// Show success snackbar
				const destination = newParentId ? 'folder' : 'root';
				this.snackbarService.success(
					`${fileItem.type === 'folder' ? 'Folder' : 'File'} "${fileItem.name}" moved to ${destination} successfully!`
				);
			}),
			catchError(error => {
				// Show error snackbar
				this.snackbarService.error(
					`Failed to move item: ${error.message || 'Unknown error'}`
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
			map(apiItems =>
				apiItems.map(item => this.convertApiItemToFileItem(item))
			),
			tap(folders => {
				this._allFolders.set(folders);
			})
		);
	}

	getFileIcon(fileName: string): string {
		const extension = fileName.split('.').pop()?.toLowerCase();
		const iconMap: { [key: string]: string } = {
			pdf: 'fa-solid fa-file-pdf',
			docx: 'fa-solid fa-file-word',
			xlsx: 'fa-solid fa-file-excel',
			pptx: 'fa-solid fa-file-powerpoint',
			jpg: 'fa-solid fa-file-image',
			png: 'fa-solid fa-file-image',
			mp4: 'fa-solid fa-file-video',
			zip: 'fa-solid fa-file-zipper',
		};
		return iconMap[extension || ''] || 'fa-solid fa-file';
	}

	getFileType(fileName: string): string {
		const extension = fileName.split('.').pop()?.toLowerCase();
		const typeMap: { [key: string]: string } = {
			pdf: 'PDF Document',
			docx: 'Word Document',
			xlsx: 'Excel Spreadsheet',
			pptx: 'PowerPoint Presentation',
			jpg: 'JPEG Image',
			png: 'PNG Image',
			mp4: 'MP4 Video',
			zip: 'ZIP Archive',
		};
		return typeMap[extension || ''] || 'Unknown File';
	}

	/**
	 * Clear any error state
	 */
	clearError(): void {
		this._error.set(null);
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
	 * Set items to delete
	 */
	setItemsToDelete(itemIds: string[]): void {
		this._itemsToDelete.set(itemIds);
	}

	/**
	 * Clear items to delete
	 */
	clearItemsToDelete(): void {
		this._itemsToDelete.set([]);
	}
}
