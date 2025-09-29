import {
  ActivatedRoute,
  ChangeDetectorRef,
  CommonModule,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Host,
  HttpClient,
  HttpParams,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgModule,
  NgTemplateOutlet,
  Observable,
  Optional,
  Output,
  Renderer2,
  Router,
  RuntimeError,
  Self,
  SkipSelf,
  Subject,
  Version,
  ViewChild,
  __spreadProps,
  __spreadValues,
  booleanAttribute,
  catchError,
  combineLatest,
  computed,
  concatMap,
  effect,
  forkJoin,
  forwardRef,
  from,
  getDOM,
  inject,
  isPromise,
  isSubscribable,
  map,
  of,
  setClassMetadata,
  signal,
  switchMap,
  tap,
  throwError,
  untracked,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassMapInterpolate2,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-7DZOZOOR.js";

// src/app/services/snackbar.service.ts
var SnackbarService = class _SnackbarService {
  _messages = signal([]);
  messages = this._messages.asReadonly();
  show(message, type = "info", duration = 3e3) {
    const id = Math.random().toString(36).substr(2, 9);
    const snackbarMessage = {
      id,
      message,
      type,
      duration
    };
    const currentMessages = this._messages();
    this._messages.set([...currentMessages, snackbarMessage]);
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }
  remove(id) {
    const currentMessages = this._messages();
    const filteredMessages = currentMessages.filter((msg) => msg.id !== id);
    this._messages.set(filteredMessages);
  }
  clear() {
    this._messages.set([]);
  }
  // Convenience methods
  success(message, duration) {
    this.show(message, "success", duration);
  }
  error(message, duration) {
    this.show(message, "error", duration);
  }
  info(message, duration) {
    this.show(message, "info", duration);
  }
  warning(message, duration) {
    this.show(message, "warning", duration);
  }
  static \u0275fac = function SnackbarService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SnackbarService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SnackbarService, factory: _SnackbarService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SnackbarService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/services/api.service.ts
var ApiService = class _ApiService {
  http;
  baseUrl = "http://localhost:3001/api";
  constructor(http) {
    this.http = http;
  }
  /**
   * Get items (files and folders) from a specific parent folder
   * @param parentId - Parent folder ID (null for root)
   */
  getItems(parentId) {
    let params = new HttpParams();
    if (parentId !== void 0 && parentId !== null) {
      params = params.set("parentId", parentId);
    }
    console.log("ApiService.getItems() called with parentId:", parentId);
    return this.http.get(`${this.baseUrl}/items`, { params }).pipe(tap((response) => {
      console.log("ApiService.getItems() - API response:", response.items?.length || 0, response.items?.map((item) => ({
        name: item.name,
        folder: item.folder,
        parentId: item.parentId
      })));
    }), map((response) => response.items || []), catchError(this.handleError));
  }
  /**
   * Create a new folder
   * @param name - Folder name
   * @param parentId - Parent folder ID (optional)
   */
  createFolder(name, parentId) {
    const body = {
      name: name.trim(),
      folder: true
    };
    if (parentId) {
      body.parentId = parentId;
    }
    console.log("API: Creating folder with body:", body);
    return this.http.post(`${this.baseUrl}/items`, body).pipe(tap((response) => {
      console.log("API: Folder creation response:", response);
    }), map((response) => response.item), catchError(this.handleError));
  }
  /**
   * Upload files to a specific folder
   * @param files - Array of files to upload
   * @param parentId - Parent folder ID (optional)
   */
  uploadFiles(files, parentId) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    if (parentId) {
      formData.append("parentId", parentId);
    }
    return this.http.post(`${this.baseUrl}/items`, formData).pipe(catchError(this.handleError));
  }
  /**
   * Upload a single file to a specific folder
   * @param file - Single file to upload
   * @param parentId - Parent folder ID (optional)
   */
  uploadSingleFile(file, parentId) {
    const formData = new FormData();
    formData.append("files", file);
    if (parentId) {
      formData.append("parentId", parentId);
    }
    return this.http.post(`${this.baseUrl}/items`, formData).pipe(catchError(this.handleError));
  }
  /**
   * Download a file
   * @param itemId - File ID
   */
  downloadFile(itemId) {
    return this.http.get(`${this.baseUrl}/items/${itemId}`, {
      responseType: "blob"
    }).pipe(catchError(this.handleError));
  }
  /**
   * Delete an item (file or folder)
   * @param itemId - Item ID
   */
  deleteItem(itemId) {
    return this.http.delete(`${this.baseUrl}/items/${itemId}`).pipe(map(() => void 0), catchError(this.handleError));
  }
  /**
   * Update an item (rename or move)
   * @param itemId - Item ID
   * @param updates - Update data
   */
  updateItem(itemId, updates) {
    return this.http.patch(`${this.baseUrl}/items/${itemId}`, updates).pipe(catchError(this.handleError));
  }
  /**
   * Get the path to an item
   * @param itemId - Item ID
   */
  getItemPath(itemId) {
    return this.http.get(`${this.baseUrl}/items/${itemId}/path`).pipe(map((response) => response.items || []), catchError(this.handleError));
  }
  /**
   * Rename an item
   * @param itemId - Item ID
   * @param newName - New name
   */
  renameItem(itemId, newName) {
    return this.updateItem(itemId, { name: newName });
  }
  /**
   * Move an item to a different folder
   * @param itemId - Item ID
   * @param newParentId - New parent folder ID (null for root)
   */
  moveItem(itemId, newParentId) {
    return this.updateItem(itemId, { parentId: newParentId });
  }
  /**
   * Get all folders for navigation (used in move modal, etc.)
   */
  getAllFolders() {
    console.log("ApiService.getAllFolders() called");
    return this.getItems().pipe(tap((items) => {
      console.log("ApiService.getAllFolders() - all items:", items.length, items.map((item) => ({ name: item.name, folder: item.folder })));
    }), map((items) => items.filter((item) => item.folder)), tap((folders) => {
      console.log("ApiService.getAllFolders() - filtered folders:", folders.length, folders.map((f) => f.name));
    }));
  }
  /**
   * Get folder hierarchy for breadcrumb navigation
   * @param itemId - Current item ID
   */
  getFolderHierarchy(itemId) {
    return this.getItemPath(itemId);
  }
  /**
   * Format file size for display
   * @param bytes - File size in bytes
   */
  formatFileSize(bytes) {
    if (bytes === 0)
      return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }
  /**
   * Get file icon based on mime type or file extension
   * @param item - API item
   */
  getFileIcon(item) {
    if (item.folder) {
      return "fa-solid fa-folder";
    }
    const mimeType = item.mimeType || "";
    const fileName = item.name.toLowerCase();
    if (mimeType.startsWith("image/") || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/.test(fileName)) {
      return "fa-solid fa-file-image";
    }
    if (mimeType.startsWith("video/") || /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/.test(fileName)) {
      return "fa-solid fa-file-video";
    }
    if (mimeType.startsWith("audio/") || /\.(mp3|wav|flac|aac|ogg)$/.test(fileName)) {
      return "fa-solid fa-file-audio";
    }
    if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) {
      return "fa-solid fa-file-pdf";
    }
    if (mimeType.includes("wordprocessingml") || /\.(doc|docx)$/.test(fileName)) {
      return "fa-solid fa-file-word";
    }
    if (mimeType.includes("spreadsheetml") || /\.(xls|xlsx)$/.test(fileName)) {
      return "fa-solid fa-file-excel";
    }
    if (mimeType.includes("presentationml") || /\.(ppt|pptx)$/.test(fileName)) {
      return "fa-solid fa-file-powerpoint";
    }
    if (/\.(zip|rar|7z|tar|gz)$/.test(fileName)) {
      return "fa-solid fa-file-zipper";
    }
    if (mimeType.startsWith("text/") || /\.(txt|md|json|xml|html|css|js|ts)$/.test(fileName)) {
      return "fa-solid fa-file-lines";
    }
    return "fa-solid fa-file";
  }
  /**
   * Get file color based on type
   * @param item - API item
   */
  getFileColor(item) {
    if (item.folder) {
      return "text-yellow-500";
    }
    const mimeType = item.mimeType || "";
    const fileName = item.name.toLowerCase();
    if (mimeType.startsWith("image/") || /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/.test(fileName)) {
      return "text-green-500";
    }
    if (mimeType.startsWith("video/") || /\.(mp4|avi|mov|wmv|flv|webm|mkv)$/.test(fileName)) {
      return "text-purple-500";
    }
    if (mimeType.startsWith("audio/") || /\.(mp3|wav|flac|aac|ogg)$/.test(fileName)) {
      return "text-pink-500";
    }
    if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) {
      return "text-red-500";
    }
    if (mimeType.includes("wordprocessingml") || /\.(doc|docx)$/.test(fileName)) {
      return "text-blue-600";
    }
    if (mimeType.includes("spreadsheetml") || /\.(xls|xlsx)$/.test(fileName)) {
      return "text-green-600";
    }
    if (mimeType.includes("presentationml") || /\.(ppt|pptx)$/.test(fileName)) {
      return "text-orange-500";
    }
    if (/\.(zip|rar|7z|tar|gz)$/.test(fileName)) {
      return "text-yellow-600";
    }
    if (mimeType.startsWith("text/") || /\.(txt|md|json|xml|html|css|js|ts)$/.test(fileName)) {
      return "text-gray-600";
    }
    return "text-gray-500";
  }
  /**
   * Handle HTTP errors
   * @param error - HTTP error
   */
  handleError(error) {
    console.error("API Error:", error);
    let errorMessage = "An error occurred";
    if (error.error) {
      if (typeof error.error === "string") {
        errorMessage = error.error;
      } else if (error.error.desc) {
        errorMessage = error.error.desc;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
  static \u0275fac = function ApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ApiService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ApiService, factory: _ApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ApiService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/services/file-manager.service.ts
var FileManagerService = class _FileManagerService {
  apiService;
  // Signals for state management
  _files = signal([]);
  _selectedItems = signal(/* @__PURE__ */ new Set());
  _currentPath = signal([]);
  _navigationHistory = signal([]);
  _historyIndex = signal(-1);
  _viewMode = signal("grid");
  _sortBy = signal("name");
  _sortOrder = signal("asc");
  _isLoading = signal(false);
  _contextMenuVisible = signal(false);
  _contextMenuPosition = signal({
    x: 0,
    y: 0
  });
  _contextMenuItem = signal(null);
  _currentFolderId = signal(null);
  _error = signal(null);
  _itemToRename = signal(null);
  _itemToMove = signal(null);
  _itemsToDelete = signal([]);
  _allFolders = signal([]);
  _folderItemCounts = signal(/* @__PURE__ */ new Map());
  // Computed signals
  files = computed(() => this._files());
  selectedItems = computed(() => this._selectedItems());
  currentPath = computed(() => this._currentPath());
  viewMode = computed(() => this._viewMode());
  sortBy = computed(() => this._sortBy());
  sortOrder = computed(() => this._sortOrder());
  isLoading = computed(() => this._isLoading());
  contextMenuVisible = computed(() => this._contextMenuVisible());
  contextMenuPosition = computed(() => this._contextMenuPosition());
  contextMenuItem = computed(() => this._contextMenuItem());
  currentFolderId = computed(() => this._currentFolderId());
  error = computed(() => this._error());
  itemToRename = computed(() => this._itemToRename());
  itemToMove = computed(() => this._itemToMove());
  itemsToDelete = computed(() => this._itemsToDelete());
  allFolders = computed(() => this._allFolders());
  folderItemCounts = computed(() => this._folderItemCounts());
  // Navigation computed
  canGoBack = computed(() => this._historyIndex() > 0);
  canGoForward = computed(() => this._historyIndex() < this._navigationHistory().length - 1);
  // Breadcrumb computed
  breadcrumbPath = computed(() => {
    const path = this._currentPath();
    const breadcrumb = [
      { name: "Root", path: [] }
    ];
    path.forEach((segment, index) => {
      breadcrumb.push({
        name: segment,
        path: path.slice(0, index + 1)
      });
    });
    return breadcrumb;
  });
  // Sorted files computed
  sortedFiles = computed(() => {
    const files = this._files();
    const sortBy = this._sortBy();
    const sortOrder = this._sortOrder();
    return [...files].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "date":
          comparison = new Date(a.modified).getTime() - new Date(b.modified).getTime();
          break;
        case "size":
          comparison = this.parseSize(a.size) - this.parseSize(b.size);
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  });
  snackbarService = inject(SnackbarService);
  constructor(apiService) {
    this.apiService = apiService;
    this.loadRootFolder();
    this.loadAllFolders();
  }
  /**
   * Load all folders for move modal
   */
  loadAllFolders() {
    this.getAllFolders().subscribe({
      next: () => {
        this.loadFolderItemCounts();
      },
      error: (error) => {
        console.error("Error loading folders:", error);
      }
    });
  }
  /**
   * Load root folder contents
   */
  loadRootFolder() {
    this._currentFolderId.set(null);
    this._currentPath.set([]);
    this._navigationHistory.set([[]]);
    this._historyIndex.set(0);
    this.loadFolderContents(null);
  }
  /**
   * Convert API item to FileItem
   */
  convertApiItemToFileItem(apiItem) {
    return {
      id: apiItem.id,
      name: apiItem.name,
      type: apiItem.folder ? "folder" : "file",
      size: apiItem.folder ? "Loading..." : this.apiService.formatFileSize(apiItem.size || 0),
      modified: new Date(apiItem.modification).toLocaleDateString(),
      icon: this.apiService.getFileIcon(apiItem),
      color: this.apiService.getFileColor(apiItem),
      parentId: apiItem.parentId,
      mimeType: apiItem.mimeType,
      filePath: apiItem.filePath
    };
  }
  /**
   * Get the number of items in a folder
   */
  getFolderItemCount(folderId) {
    const counts = this._folderItemCounts();
    const count = counts.get(folderId) || 0;
    if (count === 0) {
      return "Empty";
    } else if (count === 1) {
      return "1 item";
    } else {
      return `${count} items`;
    }
  }
  loadFolderItemCounts() {
    const folders = this._allFolders();
    console.log("Loading item counts for folders:", folders);
    console.log("Folder names:", folders.map((f) => f.name));
    console.log("Folder IDs:", folders.map((f) => f.id));
    if (folders.length === 0) {
      console.log("No folders found in _allFolders, skipping count loading");
      return;
    }
    const countObservables = folders.map((folder) => this.apiService.getItems(folder.id).pipe(map((items) => ({ folderId: folder.id, count: items.length }))));
    combineLatest(countObservables).subscribe({
      next: (results) => {
        console.log("Folder count results:", results);
        const newCounts = /* @__PURE__ */ new Map();
        results.forEach((result) => {
          newCounts.set(result.folderId, result.count);
          console.log(`Folder ${result.folderId}: ${result.count} items`);
        });
        this._folderItemCounts.set(newCounts);
        console.log("Updated folder counts:", newCounts);
        this.updateFolderSizes();
      },
      error: (error) => {
        console.error("Error loading folder item counts:", error);
      }
    });
  }
  updateFolderSizes() {
    const currentFiles = this._files();
    const counts = this._folderItemCounts();
    console.log("updateFolderSizes called with files:", currentFiles.length, "counts:", counts.size);
    const updatedFiles = currentFiles.map((file) => {
      if (file.type === "folder") {
        const count = counts.get(file.id) || 0;
        console.log(`Folder ${file.name} (${file.id}): count = ${count}`);
        return __spreadProps(__spreadValues({}, file), {
          size: count === 0 ? "Empty" : count === 1 ? "1 item" : `${count} items`
        });
      }
      return file;
    });
    this._files.set(updatedFiles);
  }
  refreshFolderCounts() {
    this.loadFolderItemCounts();
  }
  refreshAllFolders() {
    return this.getAllFolders();
  }
  // Navigation methods
  navigateToFolder(folderId, folderName) {
    const newPath = [...this._currentPath(), folderName];
    this._currentPath.set(newPath);
    this._currentFolderId.set(folderId);
    this.addToHistory(newPath);
    this.loadFolderContents(folderId);
  }
  navigateToPath(path, folderId) {
    this._currentPath.set(path);
    this._currentFolderId.set(folderId || null);
    this.addToHistory(path);
    if (!folderId && path.length > 0) {
      this.resolveFolderIdFromPath(path);
    } else {
      this.loadFolderContents(folderId);
    }
  }
  navigateToFolderByName(folderName, parentFolderId) {
    const currentFiles = this._files();
    const folder = currentFiles.find((file) => file.type === "folder" && file.name === folderName);
    if (folder) {
      const newPath = [...this._currentPath(), folderName];
      this.navigateToPath(newPath, folder.id);
    } else {
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
      this.loadFolderContents(this._currentFolderId());
    }
  }
  navigateForward() {
    if (this.canGoForward()) {
      const newIndex = this._historyIndex() + 1;
      this._historyIndex.set(newIndex);
      const path = this._navigationHistory()[newIndex];
      this._currentPath.set(path);
      this.loadFolderContents(this._currentFolderId());
    }
  }
  addToHistory(path) {
    const history = this._navigationHistory();
    const currentIndex = this._historyIndex();
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push([...path]);
    this._navigationHistory.set(newHistory);
    this._historyIndex.set(newHistory.length - 1);
  }
  resolveFolderIdFromPath(path) {
    console.log("Resolving folder ID from path:", path);
    this._files.set([]);
    this._isLoading.set(true);
    let currentFolderId = null;
    let currentPath = [];
    this.apiService.getItems(null).subscribe({
      next: (apiItems) => {
        const rootItems = apiItems.filter((item) => item.parentId === null);
        this.navigateToTargetFolder(rootItems, path, 0, currentFolderId, currentPath);
      },
      error: (error) => {
        console.error("Error loading root:", error);
        this._isLoading.set(false);
      }
    });
  }
  navigateToTargetFolder(items, path, folderIndex, currentFolderId, currentPath) {
    if (folderIndex >= path.length) {
      this.loadFolderContents(currentFolderId);
      return;
    }
    const targetFolderName = path[folderIndex];
    const targetFolder = items.find((item) => item.folder && item.name === targetFolderName);
    if (targetFolder) {
      currentFolderId = targetFolder.id;
      currentPath.push(targetFolderName);
      this._currentPath.set([...currentPath]);
      this._currentFolderId.set(currentFolderId);
      this.apiService.getItems(currentFolderId).subscribe({
        next: (apiItems) => {
          const filteredItems = apiItems.filter((item) => item.parentId === currentFolderId);
          this.navigateToTargetFolder(filteredItems, path, folderIndex + 1, currentFolderId, currentPath);
        },
        error: (error) => {
          console.error("Error loading folder:", error);
          this._isLoading.set(false);
        }
      });
    } else {
      console.error("Folder not found:", targetFolderName);
      this.loadFolderContents(currentFolderId);
    }
  }
  loadFolderContents(folderId) {
    this._isLoading.set(true);
    this._error.set(null);
    this._files.set([]);
    this.apiService.getItems(folderId).subscribe({
      next: (apiItems) => {
        const filteredItems = apiItems.filter((item) => {
          if (folderId === null) {
            return item.parentId === null;
          }
          return item.parentId === folderId;
        });
        const fileItems = filteredItems.map((item) => this.convertApiItemToFileItem(item));
        this._files.set(fileItems);
        this._isLoading.set(false);
        this.clearSelection();
        this.updateFolderSizes();
      },
      error: (error) => {
        console.error("Error loading folder contents:", error);
        this._error.set(error.message || "Failed to load folder contents");
        this._isLoading.set(false);
        this._files.set([]);
      }
    });
  }
  // Selection methods
  toggleSelection(itemId) {
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
    this._selectedItems.set(/* @__PURE__ */ new Set());
  }
  isSelected(itemId) {
    return this._selectedItems().has(itemId);
  }
  // View methods
  setViewMode(mode) {
    this._viewMode.set(mode);
  }
  setSortBy(sortBy) {
    this._sortBy.set(sortBy);
  }
  toggleSortOrder() {
    this._sortOrder.set(this._sortOrder() === "asc" ? "desc" : "asc");
  }
  // Context menu methods
  showContextMenu(item, x, y) {
    this._contextMenuItem.set(item);
    this._contextMenuPosition.set({ x, y });
    this._contextMenuVisible.set(true);
  }
  hideContextMenu() {
    this._contextMenuVisible.set(false);
    this._contextMenuItem.set(null);
  }
  // File operations
  createFolder(name) {
    const currentFolderId = this._currentFolderId();
    return this.apiService.createFolder(name, currentFolderId || void 0).pipe(map((apiItem) => this.convertApiItemToFileItem(apiItem)), tap(() => {
      this.loadFolderContents(currentFolderId);
      this.refreshFolderCounts();
      this.refreshAllFolders().subscribe();
    }));
  }
  uploadFiles(files) {
    const currentFolderId = this._currentFolderId();
    console.log("Uploading files to folder:", currentFolderId);
    return this.apiService.uploadFiles(files, currentFolderId || void 0).pipe(tap(() => {
      this.loadFolderContents(currentFolderId);
      this.refreshFolderCounts();
    }));
  }
  /**
   * Process directory upload by creating folder structure and uploading files
   * @param files - Array of files from directory selection
   * @param rootFolderName - Name of the root folder to create
   */
  uploadDirectory(files, rootFolderName, allFolders = []) {
    const currentFolderId = this._currentFolderId();
    console.log("=== FOLDER UPLOAD START ===");
    console.log("Uploading directory to folder:", currentFolderId);
    console.log("Root folder name:", rootFolderName);
    console.log("Number of files:", files.length);
    const directoryItems = this.processDirectoryStructure(files, rootFolderName);
    console.log("Directory items processed:", directoryItems.length);
    directoryItems.forEach((item, index) => {
      console.log(`Item ${index + 1}: ${item.file.name} -> ${item.folderPath.join("/")}`);
    });
    return this.createRootFolderIfNeeded(rootFolderName, currentFolderId).pipe(switchMap((createdRootFolderId) => {
      console.log("Root folder ID:", createdRootFolderId);
      return this.uploadFilesToRootFolder(directoryItems, createdRootFolderId).pipe(switchMap(() => {
        console.log("Root folder files uploaded, creating subfolders...");
        return this.createAllFolders(directoryItems, createdRootFolderId, allFolders);
      }), switchMap((folderMap) => {
        console.log("Subfolders created, uploading files to subfolders...");
        return this.uploadFilesToSubfolders(directoryItems, folderMap, createdRootFolderId);
      }));
    }), tap(() => {
      console.log("=== FOLDER UPLOAD COMPLETE ===");
      this.loadFolderContents(currentFolderId);
      this.refreshAllFolders().subscribe({
        next: () => {
          this.refreshFolderCounts();
        },
        error: (error) => {
          console.error("Error refreshing folders:", error);
          this.refreshFolderCounts();
        }
      });
    }), catchError((error) => {
      console.error("=== FOLDER UPLOAD ERROR ===", error);
      throw error;
    }));
  }
  /**
   * Process files to extract directory structure
   * @param files - Array of files from directory selection
   * @param rootFolderName - Optional root folder name
   */
  processDirectoryStructure(files, rootFolderName) {
    const directoryItems = [];
    console.log("Processing directory structure for files:", files.map((f) => ({
      name: f.name,
      webkitRelativePath: f.webkitRelativePath
    })));
    files.forEach((file) => {
      let relativePath = file.webkitRelativePath || file.name;
      if (!file.webkitRelativePath && rootFolderName) {
        relativePath = `${rootFolderName}/${file.name}`;
      }
      const pathSegments = relativePath.split("/");
      const fileName = pathSegments.pop() || "";
      const folderPath = pathSegments;
      console.log(`File: ${file.name}, RelativePath: ${relativePath}, FolderPath: ${folderPath.join("/")}`);
      directoryItems.push({
        file,
        relativePath,
        folderPath
      });
    });
    return directoryItems;
  }
  /**
   * Upload files to root folder
   * @param directoryItems - Array of directory upload items
   * @param rootFolderId - Root folder ID
   */
  uploadFilesToRootFolder(directoryItems, rootFolderId) {
    const rootFiles = directoryItems.filter((item) => item.folderPath.length === 0);
    if (rootFiles.length === 0) {
      console.log("No files to upload to root folder");
      return of([]);
    }
    console.log(`Uploading ${rootFiles.length} files to root folder`);
    return this.apiService.uploadFiles(rootFiles.map((item) => item.file), rootFolderId || void 0);
  }
  /**
   * Upload files to subfolders
   * @param directoryItems - Array of directory upload items
   * @param folderMap - Map of folder paths to folder IDs
   * @param rootFolderId - Root folder ID
   */
  uploadFilesToSubfolders(directoryItems, folderMap, rootFolderId) {
    const subfolderFiles = directoryItems.filter((item) => item.folderPath.length > 0);
    if (subfolderFiles.length === 0) {
      console.log("No files to upload to subfolders");
      return of([]);
    }
    console.log(`Uploading ${subfolderFiles.length} files to subfolders`);
    return from(subfolderFiles).pipe(concatMap((item) => {
      const folderPath = item.folderPath.join("/");
      const folderId = folderMap.get(folderPath) || rootFolderId;
      console.log(`Uploading ${item.file.name} to folder: ${folderPath} (ID: ${folderId})`);
      return this.apiService.uploadSingleFile(item.file, folderId || void 0);
    }));
  }
  /**
   * Create root folder if needed and return its ID
   * @param rootFolderName - Name of the root folder
   * @param parentId - Parent folder ID
   */
  createRootFolderIfNeeded(rootFolderName, parentId) {
    if (!rootFolderName) {
      return of(parentId);
    }
    console.log(`Creating root folder: ${rootFolderName} in parent: ${parentId}`);
    return this.apiService.getItems(parentId).pipe(switchMap((items) => {
      const existingFolder = items.find((item) => item.folder && item.name === rootFolderName && item.parentId === parentId);
      if (existingFolder) {
        console.log(`Root folder already exists: ${rootFolderName} with ID: ${existingFolder.id}`);
        return of(existingFolder.id);
      }
      return this.apiService.createFolder(rootFolderName, parentId || void 0).pipe(map((newFolder) => {
        console.log(`\u2705 Created root folder: ${rootFolderName} with ID: ${newFolder.id}`);
        return newFolder.id;
      }));
    }));
  }
  /**
   * Create all folders first and return a map of folder paths to folder IDs
   * @param directoryItems - Array of directory upload items
   * @param parentId - Parent folder ID
   */
  createAllFolders(directoryItems, parentId, allFolders = []) {
    const folderPaths = /* @__PURE__ */ new Set();
    directoryItems.forEach((item) => {
      console.log(`Processing item: ${item.file.name}, folderPath: [${item.folderPath.join(", ")}]`);
      item.folderPath.forEach((_, index) => {
        const path = item.folderPath.slice(0, index + 1).join("/");
        if (path) {
          const pathSegments = path.split("/");
          if (pathSegments.length > 1) {
            folderPaths.add(path);
            console.log(`Added subfolder path: ${path}`);
          } else {
            console.log(`Skipping root folder path: ${path}`);
          }
        }
      });
    });
    allFolders.forEach((folderPath) => {
      const pathSegments = folderPath.split("/");
      if (pathSegments.length > 1) {
        folderPaths.add(folderPath);
        console.log(`Added subfolder path: ${folderPath}`);
      } else {
        console.log(`Skipping root folder path: ${folderPath}`);
      }
    });
    console.log("All folder paths to create:", Array.from(folderPaths));
    const sortedPaths = Array.from(folderPaths).sort((a, b) => {
      const aDepth = a.split("/").length;
      const bDepth = b.split("/").length;
      return aDepth - bDepth;
    });
    console.log("Sorted folder paths:", sortedPaths);
    const folderMap = /* @__PURE__ */ new Map();
    if (parentId) {
      folderMap.set("", parentId);
    }
    return this.createFoldersSequentially(sortedPaths, parentId, folderMap);
  }
  /**
   * Create folders sequentially and build the folder map
   * @param sortedPaths - Array of folder paths sorted by depth
   * @param parentId - Parent folder ID
   * @param folderMap - Map to store path -> folderId
   */
  createFoldersSequentially(sortedPaths, parentId, folderMap) {
    if (sortedPaths.length === 0) {
      return of(folderMap);
    }
    const path = sortedPaths[0];
    const remainingPaths = sortedPaths.slice(1);
    const pathSegments = path.split("/");
    const folderName = pathSegments[pathSegments.length - 1];
    const parentPath = pathSegments.slice(0, -1).join("/");
    const parentFolderId = parentPath ? folderMap.get(parentPath) || parentId : parentId;
    console.log(`Creating folder: ${folderName} in parent: ${parentFolderId} (path: ${path})`);
    console.log(`Calling API to create folder: ${folderName} in parent: ${parentFolderId}`);
    return this.apiService.createFolder(folderName, parentFolderId || void 0).pipe(tap((newFolder) => {
      console.log(`\u2705 Successfully created folder: ${folderName} with ID: ${newFolder.id}`);
    }), switchMap((newFolder) => {
      folderMap.set(path, newFolder.id);
      console.log(`Added to folder map: ${path} -> ${newFolder.id}`);
      return this.createFoldersSequentially(remainingPaths, parentId, folderMap);
    }), catchError((error) => {
      console.error(`\u274C Failed to create folder: ${folderName}`, error);
      console.error("Error details:", error);
      throw error;
    }));
  }
  /**
   * Find or create parent folder for a given path
   * @param pathSegments - Array of path segments
   * @param rootParentId - Root parent ID
   */
  findOrCreateParentFolder(pathSegments, rootParentId) {
    if (pathSegments.length === 0) {
      return of({});
    }
    const folderName = pathSegments[0];
    const remainingPath = pathSegments.slice(1);
    return this.apiService.getItems(rootParentId).pipe(switchMap((items) => {
      const existingFolder = items.find((item) => item.folder && item.name === folderName && item.parentId === rootParentId);
      if (existingFolder) {
        if (remainingPath.length > 0) {
          return this.findOrCreateParentFolder(remainingPath, existingFolder.id);
        }
        return of(existingFolder);
      } else {
        return this.apiService.createFolder(folderName, rootParentId || void 0).pipe(switchMap((newFolder) => {
          if (remainingPath.length > 0) {
            return this.findOrCreateParentFolder(remainingPath, newFolder.id);
          }
          return of(newFolder);
        }));
      }
    }));
  }
  /**
   * Upload files to their respective created folders using the folder map
   * @param directoryItems - Array of directory upload items
   * @param folderMap - Map of folder paths to folder IDs
   * @param rootParentId - Root parent ID
   */
  uploadFilesToCreatedFolders(directoryItems, folderMap, rootParentId) {
    return this.uploadFilesSequentially(directoryItems, folderMap, rootParentId);
  }
  /**
   * Upload files sequentially one by one
   * @param directoryItems - Array of directory upload items
   * @param folderMap - Map of folder paths to folder IDs
   * @param rootParentId - Root parent ID
   */
  uploadFilesSequentially(directoryItems, folderMap, rootParentId) {
    if (directoryItems.length === 0) {
      return of([]);
    }
    return from(directoryItems).pipe(concatMap((item, index) => {
      const folderPath = item.folderPath.join("/");
      const folderId = folderPath ? folderMap.get(folderPath) : rootParentId;
      console.log(`Uploading file ${index + 1}/${directoryItems.length}: ${item.file.name} to folder: ${folderPath} (ID: ${folderId})`);
      return this.apiService.uploadSingleFile(item.file, folderId || void 0);
    }));
  }
  /**
   * Upload files sequentially with progress tracking
   * @param directoryItems - Array of directory upload items
   * @param folderMap - Map of folder paths to folder IDs
   * @param rootParentId - Root parent ID
   */
  uploadFilesSequentiallyWithProgress(directoryItems, folderMap, rootParentId) {
    if (directoryItems.length === 0) {
      console.log("No files to upload");
      return of([]);
    }
    console.log(`Starting sequential upload of ${directoryItems.length} files`);
    return from(directoryItems).pipe(concatMap((item, index) => {
      const folderPath = item.folderPath.join("/");
      const folderId = folderPath ? folderMap.get(folderPath) : rootParentId;
      console.log(`[${index + 1}/${directoryItems.length}] Uploading: ${item.file.name}`);
      console.log(`  -> Folder path: ${folderPath}`);
      console.log(`  -> Folder ID: ${folderId}`);
      console.log(`  -> File size: ${item.file.size} bytes`);
      return this.apiService.uploadSingleFile(item.file, folderId || void 0).pipe(tap((response) => {
        console.log(`  -> Upload completed for: ${item.file.name}`);
        const progress = Math.round((index + 1) / directoryItems.length * 100);
        console.log(`  -> Overall progress: ${progress}%`);
      }), catchError((error) => {
        console.error(`  -> Upload failed for: ${item.file.name}`, error);
        throw error;
      }));
    }));
  }
  /**
   * Find folder ID by path
   * @param folderPath - Folder path
   * @param rootParentId - Root parent ID
   */
  findFolderByPath(folderPath, rootParentId) {
    if (!folderPath) {
      return of(rootParentId);
    }
    const pathSegments = folderPath.split("/");
    let currentParentId = rootParentId;
    return this.apiService.getItems(currentParentId).pipe(switchMap((items) => {
      const segment = pathSegments[0];
      const remainingPath = pathSegments.slice(1);
      const folder = items.find((item) => item.folder && item.name === segment && item.parentId === currentParentId);
      if (folder) {
        if (remainingPath.length > 0) {
          return this.findFolderByPath(remainingPath.join("/"), folder.id);
        }
        return of(folder.id);
      }
      return of(null);
    }));
  }
  renameItem(itemId, newName) {
    return this.apiService.renameItem(itemId, newName).pipe(map((apiItem) => this.convertApiItemToFileItem(apiItem)), tap((fileItem) => {
      this.loadFolderContents(this._currentFolderId());
      this.snackbarService.success(`${fileItem.type === "folder" ? "Folder" : "File"} "${fileItem.name}" renamed successfully!`);
    }), catchError((error) => {
      this.snackbarService.error(`Failed to rename item: ${error.message || "Unknown error"}`);
      throw error;
    }));
  }
  deleteItems(itemIds) {
    const deleteObservables = itemIds.map((id) => this.apiService.deleteItem(id));
    return new Observable((observer) => {
      let completed = 0;
      let hasError = false;
      deleteObservables.forEach((obs) => {
        obs.subscribe({
          next: () => {
            completed++;
            if (completed === itemIds.length && !hasError) {
              this.loadFolderContents(this._currentFolderId());
              this.refreshFolderCounts();
              this.refreshAllFolders().subscribe();
              this.clearSelection();
              observer.next();
              observer.complete();
            }
          },
          error: (error) => {
            if (!hasError) {
              hasError = true;
              observer.error(error);
            }
          }
        });
      });
    });
  }
  moveItem(itemId, newParentId) {
    return this.apiService.moveItem(itemId, newParentId).pipe(map((apiItem) => this.convertApiItemToFileItem(apiItem)), tap((fileItem) => {
      this.loadFolderContents(this._currentFolderId());
      this.refreshFolderCounts();
      const destination = newParentId ? "folder" : "root";
      this.snackbarService.success(`${fileItem.type === "folder" ? "Folder" : "File"} "${fileItem.name}" moved to ${destination} successfully!`);
    }), catchError((error) => {
      this.snackbarService.error(`Failed to move item: ${error.message || "Unknown error"}`);
      throw error;
    }));
  }
  downloadFile(itemId) {
    return this.apiService.downloadFile(itemId);
  }
  getAllFolders() {
    console.log("FileManagerService.getAllFolders() called");
    return this.apiService.getAllFolders().pipe(tap((apiItems) => {
      console.log("FileManagerService.getAllFolders() - API response:", apiItems.length, apiItems.map((item) => item.name));
    }), map((apiItems) => apiItems.map((item) => this.convertApiItemToFileItem(item))), tap((folders) => {
      console.log("FileManagerService.getAllFolders() - converted folders:", folders.length, folders.map((f) => f.name));
      this._allFolders.set(folders);
      console.log("FileManagerService.getAllFolders() - _allFolders updated");
    }));
  }
  // Utility methods
  parseSize(sizeStr) {
    if (!sizeStr)
      return 0;
    const units = { KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
    const match = sizeStr.match(/(\d+\.?\d*)\s*(KB|MB|GB)/);
    if (match) {
      return parseFloat(match[1]) * (units[match[2]] || 1);
    }
    return 0;
  }
  getFileIcon(fileName) {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const iconMap = {
      pdf: "fa-solid fa-file-pdf",
      docx: "fa-solid fa-file-word",
      xlsx: "fa-solid fa-file-excel",
      pptx: "fa-solid fa-file-powerpoint",
      jpg: "fa-solid fa-file-image",
      png: "fa-solid fa-file-image",
      mp4: "fa-solid fa-file-video",
      zip: "fa-solid fa-file-zipper"
    };
    return iconMap[extension || ""] || "fa-solid fa-file";
  }
  getFileType(fileName) {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const typeMap = {
      pdf: "PDF Document",
      docx: "Word Document",
      xlsx: "Excel Spreadsheet",
      pptx: "PowerPoint Presentation",
      jpg: "JPEG Image",
      png: "PNG Image",
      mp4: "MP4 Video",
      zip: "ZIP Archive"
    };
    return typeMap[extension || ""] || "Unknown File";
  }
  /**
   * Clear any error state
   */
  clearError() {
    this._error.set(null);
  }
  /**
   * Refresh current folder
   */
  refresh() {
    this.loadFolderContents(this._currentFolderId());
  }
  /**
   * Set item to rename
   */
  setItemToRename(item) {
    this._itemToRename.set(item);
  }
  /**
   * Clear item to rename
   */
  clearItemToRename() {
    this._itemToRename.set(null);
  }
  /**
   * Set item to move
   */
  setItemToMove(item) {
    this._itemToMove.set(item);
  }
  /**
   * Clear item to move
   */
  clearItemToMove() {
    this._itemToMove.set(null);
  }
  /**
   * Set items to delete
   */
  setItemsToDelete(itemIds) {
    this._itemsToDelete.set(itemIds);
  }
  /**
   * Clear items to delete
   */
  clearItemsToDelete() {
    this._itemsToDelete.set([]);
  }
  static \u0275fac = function FileManagerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FileManagerService)(\u0275\u0275inject(ApiService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FileManagerService, factory: _FileManagerService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FileManagerService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: ApiService }], null);
})();

// src/app/services/modal.service.ts
var ModalService = class _ModalService {
  _newFolderModal = signal(false);
  _renameModal = signal(false);
  _moveModal = signal(false);
  _deleteModal = signal(false);
  // Readonly signals
  newFolderModal = this._newFolderModal.asReadonly();
  renameModal = this._renameModal.asReadonly();
  moveModal = this._moveModal.asReadonly();
  deleteModal = this._deleteModal.asReadonly();
  showNewFolderModal() {
    this._newFolderModal.set(true);
  }
  hideNewFolderModal() {
    this._newFolderModal.set(false);
  }
  showRenameModal() {
    this._renameModal.set(true);
  }
  hideRenameModal() {
    this._renameModal.set(false);
  }
  showMoveModal() {
    this._moveModal.set(true);
  }
  hideMoveModal() {
    this._moveModal.set(false);
  }
  showDeleteModal() {
    this._deleteModal.set(true);
  }
  hideDeleteModal() {
    this._deleteModal.set(false);
  }
  hideAllModals() {
    this._newFolderModal.set(false);
    this._renameModal.set(false);
    this._moveModal.set(false);
    this._deleteModal.set(false);
  }
  static \u0275fac = function ModalService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ModalService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ModalService, factory: _ModalService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModalService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/components/file-upload/file-upload.component.ts
var _c0 = ["fileInput"];
var _forTrack0 = ($index, $item) => $item.file.name;
function FileUploadComponent_Conditional_14_For_4_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 16);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const uploadingFile_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", uploadingFile_r2.progress, "%");
  }
}
function FileUploadComponent_Conditional_14_For_4_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 17);
    \u0275\u0275text(1, "Complete");
    \u0275\u0275elementEnd();
  }
}
function FileUploadComponent_Conditional_14_For_4_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 18);
    \u0275\u0275text(1, "Failed");
    \u0275\u0275elementEnd();
  }
}
function FileUploadComponent_Conditional_14_For_4_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275element(1, "div", 22);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const uploadingFile_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275styleProp("width", uploadingFile_r2.progress, "%");
  }
}
function FileUploadComponent_Conditional_14_For_4_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 20);
    \u0275\u0275element(1, "div", 23);
    \u0275\u0275elementEnd();
  }
}
function FileUploadComponent_Conditional_14_For_4_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275element(1, "div", 24);
    \u0275\u0275elementEnd();
  }
}
function FileUploadComponent_Conditional_14_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10)(1, "div", 11)(2, "div", 12);
    \u0275\u0275element(3, "i", 13);
    \u0275\u0275elementStart(4, "div")(5, "p", 7);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 14);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(9, "div", 15);
    \u0275\u0275template(10, FileUploadComponent_Conditional_14_For_4_Conditional_10_Template, 2, 1, "span", 16)(11, FileUploadComponent_Conditional_14_For_4_Conditional_11_Template, 2, 0, "span", 17)(12, FileUploadComponent_Conditional_14_For_4_Conditional_12_Template, 2, 0, "span", 18);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(13, FileUploadComponent_Conditional_14_For_4_Conditional_13_Template, 2, 2, "div", 19)(14, FileUploadComponent_Conditional_14_For_4_Conditional_14_Template, 2, 0, "div", 20)(15, FileUploadComponent_Conditional_14_For_4_Conditional_15_Template, 2, 0, "div", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const uploadingFile_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275classMap(ctx_r2.getFileIcon(uploadingFile_r2.file.name));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", uploadingFile_r2.file.name, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r2.formatFileSize(uploadingFile_r2.file.size), " ");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(uploadingFile_r2.status === "uploading" ? 10 : uploadingFile_r2.status === "completed" ? 11 : 12);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(uploadingFile_r2.status === "uploading" ? 13 : uploadingFile_r2.status === "completed" ? 14 : 15);
  }
}
function FileUploadComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "h4", 7);
    \u0275\u0275text(2, "Uploading Files");
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(3, FileUploadComponent_Conditional_14_For_4_Template, 16, 6, "div", 10, _forTrack0);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r2.uploadingFiles());
  }
}
var FileUploadComponent = class _FileUploadComponent {
  fileInput;
  fileManagerService = inject(FileManagerService);
  snackbarService = inject(SnackbarService);
  _uploadingFiles = signal([]);
  _isDragOver = signal(false);
  _droppedFiles = [];
  _allFolders = [];
  uploadingFiles = this._uploadingFiles.asReadonly();
  isDragOver = this._isDragOver.asReadonly();
  onDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    this._isDragOver.set(true);
  }
  onDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    this._isDragOver.set(false);
  }
  onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this._isDragOver.set(false);
    const items = event.dataTransfer?.items;
    if (items) {
      console.log("=== DROP EVENT ===");
      console.log("Items dropped:", items.length);
      this._droppedFiles = [];
      this._allFolders = [];
      let pendingOperations = 0;
      let hasDirectFiles = false;
      let rootFolderName = "";
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file") {
          const entry = item.webkitGetAsEntry();
          if (entry && entry.isDirectory) {
            rootFolderName = entry.name;
            break;
          }
        }
      }
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file") {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            console.log("Entry found:", entry.name, "isDirectory:", entry.isDirectory);
            pendingOperations++;
            this.traverseFileTree(entry, "", rootFolderName, () => {
              pendingOperations--;
              if (pendingOperations === 0 && !hasDirectFiles) {
                this.processDroppedFiles();
              }
            });
          } else {
            const file = item.getAsFile();
            if (file) {
              console.log("Individual file dropped:", file.name);
              hasDirectFiles = true;
              this.uploadFiles([file]);
            }
          }
        }
      }
      if (pendingOperations === 0 && !hasDirectFiles) {
        this.processDroppedFiles();
      }
    }
  }
  // Recursive function to traverse folder structure
  traverseFileTree(item, path = "", rootFolderName = "", onComplete) {
    if (item.isFile) {
      item.file((file) => {
        let relativePath = path + file.name;
        if (rootFolderName && path === "" && !relativePath.startsWith(rootFolderName)) {
          relativePath = rootFolderName + "/" + relativePath;
        }
        Object.defineProperty(file, "webkitRelativePath", {
          value: relativePath,
          writable: false
        });
        console.log("File found:", relativePath, "path:", path, "rootFolderName:", rootFolderName);
        if (!this._droppedFiles) {
          this._droppedFiles = [];
        }
        this._droppedFiles.push(file);
        if (onComplete) {
          onComplete();
        }
      });
    } else if (item.isDirectory) {
      let dirPath = path + item.name + "/";
      if (rootFolderName && path === "" && !dirPath.startsWith(rootFolderName)) {
        dirPath = rootFolderName + "/" + dirPath;
      }
      const folderPath = dirPath.slice(0, -1);
      if (folderPath && !this._allFolders.includes(folderPath)) {
        this._allFolders.push(folderPath);
        console.log("Added folder to list:", folderPath);
      }
      console.log("Directory found:", dirPath, "path:", path, "rootFolderName:", rootFolderName);
      const dirReader = item.createReader();
      dirReader.readEntries((entries) => {
        if (entries.length === 0) {
          if (onComplete) {
            onComplete();
          }
          return;
        }
        let completedEntries = 0;
        const totalEntries = entries.length;
        for (const entry of entries) {
          this.traverseFileTree(entry, dirPath, rootFolderName, () => {
            completedEntries++;
            if (completedEntries === totalEntries && onComplete) {
              onComplete();
            }
          });
        }
      });
    }
  }
  processDroppedFiles() {
    if (!this._droppedFiles || this._droppedFiles.length === 0) {
      return;
    }
    console.log("Processing dropped files:", this._droppedFiles.length);
    this._droppedFiles.forEach((file, index) => {
      console.log(`File ${index + 1}: ${file.name}, webkitRelativePath: ${file.webkitRelativePath}`);
    });
    const hasDirectoryStructure = this._droppedFiles.some((file) => file.webkitRelativePath);
    console.log("Has directory structure:", hasDirectoryStructure);
    if (hasDirectoryStructure) {
      const firstFile = this._droppedFiles[0];
      let rootFolderName = "";
      if (firstFile.webkitRelativePath) {
        const pathSegments = firstFile.webkitRelativePath.split("/");
        rootFolderName = pathSegments[0];
      }
      console.log("Root folder name extracted:", rootFolderName);
      console.log("All folders found:", this._allFolders);
      console.log("Calling uploadDirectory with files:", this._droppedFiles.length, "and root folder:", rootFolderName);
      this.uploadDirectory(this._droppedFiles, rootFolderName, this._allFolders);
    } else {
      console.log("No directory structure detected, using regular file upload");
      this.uploadFiles(this._droppedFiles);
    }
  }
  openFileDialog() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }
  onFileSelected(event) {
    const target = event.target;
    if (target.files && target.files.length > 0) {
      const files = Array.from(target.files);
      console.log("=== FILE SELECTED ===");
      console.log("Files selected:", files.length);
      files.forEach((file, index) => {
        console.log(`File ${index + 1}: ${file.name}, webkitRelativePath: ${file.webkitRelativePath}`);
      });
      const hasDirectoryStructure = files.some((file) => file.webkitRelativePath);
      console.log("Has directory structure:", hasDirectoryStructure);
      if (hasDirectoryStructure) {
        const firstFile = files[0];
        let rootFolderName = "";
        if (firstFile.webkitRelativePath) {
          const pathSegments = firstFile.webkitRelativePath.split("/");
          rootFolderName = pathSegments[0];
        }
        const allFolders = /* @__PURE__ */ new Set();
        files.forEach((file) => {
          const relativePath = file.webkitRelativePath;
          if (relativePath) {
            const pathSegments = relativePath.split("/");
            for (let i = 2; i < pathSegments.length; i++) {
              const folderPath = pathSegments.slice(0, i).join("/");
              allFolders.add(folderPath);
            }
          }
        });
        console.log("Root folder name extracted:", rootFolderName);
        console.log("All folders found:", Array.from(allFolders));
        this.uploadDirectory(files, rootFolderName, Array.from(allFolders));
      } else {
        console.log("File selection detected - uploading as regular files (webkitRelativePath not available)");
        this.uploadFiles(files);
      }
    }
  }
  uploadFiles(files) {
    const currentUploading = [...this._uploadingFiles()];
    files.forEach((file) => {
      currentUploading.push({
        file,
        progress: 0,
        status: "uploading"
      });
    });
    this._uploadingFiles.set(currentUploading);
    this.fileManagerService.uploadFiles(files).subscribe({
      next: (response) => {
        console.log("Files uploaded successfully:", response);
        const updatedUploading = this._uploadingFiles().map((uploadingFile) => {
          if (files.some((f) => f.name === uploadingFile.file.name)) {
            return __spreadProps(__spreadValues({}, uploadingFile), {
              status: "completed",
              progress: 100
            });
          }
          return uploadingFile;
        });
        this._uploadingFiles.set(updatedUploading);
        if (files.length === 1) {
          this.snackbarService.success(`File "${files[0].name}" uploaded successfully!`);
        } else {
          this.snackbarService.success(`${files.length} files uploaded successfully!`);
        }
        setTimeout(() => {
          const filteredUploading = this._uploadingFiles().filter((uploadingFile) => !files.some((f) => f.name === uploadingFile.file.name));
          this._uploadingFiles.set(filteredUploading);
        }, 2e3);
      },
      error: (error) => {
        console.error("Upload error:", error);
        const updatedUploading = this._uploadingFiles().map((uploadingFile) => {
          if (files.some((f) => f.name === uploadingFile.file.name)) {
            return __spreadProps(__spreadValues({}, uploadingFile), { status: "error" });
          }
          return uploadingFile;
        });
        this._uploadingFiles.set(updatedUploading);
        if (files.length === 1) {
          this.snackbarService.error(`Failed to upload "${files[0].name}"`);
        } else {
          this.snackbarService.error(`Failed to upload ${files.length} files`);
        }
        setTimeout(() => {
          const filteredUploading = this._uploadingFiles().filter((uploadingFile) => !files.some((f) => f.name === uploadingFile.file.name));
          this._uploadingFiles.set(filteredUploading);
        }, 3e3);
      }
    });
    files.forEach((file) => {
      this.simulateUploadProgress(file);
    });
  }
  uploadDirectory(files, rootFolderName, allFolders = []) {
    console.log("=== DIRECTORY UPLOAD START ===");
    console.log("Root folder name:", rootFolderName);
    console.log("Number of files:", files.length);
    const currentUploading = [...this._uploadingFiles()];
    files.forEach((file) => {
      currentUploading.push({
        file,
        progress: 0,
        status: "uploading"
      });
    });
    this._uploadingFiles.set(currentUploading);
    console.log("Calling fileManagerService.uploadDirectory...");
    this.fileManagerService.uploadDirectory(files, rootFolderName, allFolders).subscribe({
      next: (response) => {
        console.log("\u2705 Directory uploaded successfully:", response);
        const updatedUploading = this._uploadingFiles().map((uploadingFile) => {
          if (files.some((f) => f.name === uploadingFile.file.name)) {
            return __spreadProps(__spreadValues({}, uploadingFile), {
              status: "completed",
              progress: 100
            });
          }
          return uploadingFile;
        });
        this._uploadingFiles.set(updatedUploading);
        this.snackbarService.success(`Directory "${rootFolderName}" with ${files.length} files uploaded successfully!`);
        setTimeout(() => {
          const filteredUploading = this._uploadingFiles().filter((uploadingFile) => !files.some((f) => f.name === uploadingFile.file.name));
          this._uploadingFiles.set(filteredUploading);
        }, 2e3);
      },
      error: (error) => {
        console.error("\u274C Directory upload error:", error);
        const updatedUploading = this._uploadingFiles().map((uploadingFile) => {
          if (files.some((f) => f.name === uploadingFile.file.name)) {
            return __spreadProps(__spreadValues({}, uploadingFile), { status: "error" });
          }
          return uploadingFile;
        });
        this._uploadingFiles.set(updatedUploading);
        this.snackbarService.error(`Failed to upload directory "${rootFolderName}": ${error.message || "Unknown error"}`);
        setTimeout(() => {
          const filteredUploading = this._uploadingFiles().filter((uploadingFile) => !files.some((f) => f.name === uploadingFile.file.name));
          this._uploadingFiles.set(filteredUploading);
        }, 3e3);
      }
    });
  }
  simulateUploadProgress(file) {
    const totalSteps = 20;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps * 100;
      const updatedUploading = this._uploadingFiles().map((uploadingFile) => {
        if (uploadingFile.file.name === file.name && uploadingFile.status === "uploading") {
          return __spreadProps(__spreadValues({}, uploadingFile), { progress });
        }
        return uploadingFile;
      });
      this._uploadingFiles.set(updatedUploading);
      if (currentStep >= totalSteps) {
        clearInterval(interval);
      }
    }, 100 + Math.random() * 200);
  }
  formatFileSize(bytes) {
    if (bytes === 0)
      return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }
  getFileIcon(fileName) {
    const extension = fileName.split(".").pop()?.toLowerCase();
    const iconMap = {
      pdf: "fa-solid fa-file-pdf text-red-500",
      doc: "fa-solid fa-file-word text-blue-500",
      docx: "fa-solid fa-file-word text-blue-500",
      xls: "fa-solid fa-file-excel text-green-500",
      xlsx: "fa-solid fa-file-excel text-green-500",
      ppt: "fa-solid fa-file-powerpoint text-orange-500",
      pptx: "fa-solid fa-file-powerpoint text-orange-500",
      jpg: "fa-solid fa-file-image text-green-500",
      jpeg: "fa-solid fa-file-image text-green-500",
      png: "fa-solid fa-file-image text-green-500",
      gif: "fa-solid fa-file-image text-green-500",
      mp4: "fa-solid fa-file-video text-purple-500",
      avi: "fa-solid fa-file-video text-purple-500",
      mov: "fa-solid fa-file-video text-purple-500",
      mp3: "fa-solid fa-file-audio text-pink-500",
      wav: "fa-solid fa-file-audio text-pink-500",
      zip: "fa-solid fa-file-zipper text-yellow-500",
      rar: "fa-solid fa-file-zipper text-yellow-500",
      txt: "fa-solid fa-file-lines text-gray-500",
      md: "fa-solid fa-file-lines text-gray-500",
      json: "fa-solid fa-file-code text-yellow-500",
      xml: "fa-solid fa-file-code text-orange-500",
      html: "fa-solid fa-file-code text-orange-500",
      css: "fa-solid fa-file-code text-blue-500",
      js: "fa-solid fa-file-code text-yellow-500",
      ts: "fa-solid fa-file-code text-blue-500"
    };
    return iconMap[extension || ""] || "fa-solid fa-file text-gray-500";
  }
  static \u0275fac = function FileUploadComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FileUploadComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FileUploadComponent, selectors: [["app-file-upload"]], viewQuery: function FileUploadComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.fileInput = _t.first);
    }
  }, decls: 15, vars: 5, consts: [["fileInput", ""], [1, "file-upload-container"], [1, "border-2", "border-dashed", "border-gray-300", "rounded-lg", "p-6", "text-center", "transition-colors", "duration-200", "mb-4", 3, "dragover", "dragleave", "drop"], ["type", "file", "multiple", "", "webkitdirectory", "", 1, "hidden", 3, "change"], [1, "space-y-3"], [1, "w-12", "h-12", "mx-auto", "bg-gray-100", "rounded-full", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-cloud-upload-alt", "text-2xl", "text-gray-400"], [1, "text-sm", "font-medium", "text-gray-900"], [1, "text-xs", "text-gray-500", "mt-1"], [1, "px-4", "py-2", "bg-blue-600", "hover:bg-blue-700", "text-white", "rounded-lg", "font-medium", "transition-colors", "text-sm", 3, "click"], [1, "bg-white", "rounded-lg", "p-4", "border", "border-gray-200"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "flex", "items-center", "space-x-3"], [1, "text-lg"], [1, "text-xs", "text-gray-500"], [1, "text-right"], [1, "text-xs", "text-blue-600", "font-medium"], [1, "text-xs", "text-green-600", "font-medium"], [1, "text-xs", "text-red-600", "font-medium"], [1, "w-full", "bg-gray-200", "rounded-full", "h-2"], [1, "w-full", "bg-green-200", "rounded-full", "h-2"], [1, "w-full", "bg-red-200", "rounded-full", "h-2"], [1, "bg-blue-600", "h-2", "rounded-full", "transition-all", "duration-300"], [1, "bg-green-600", "h-2", "rounded-full", "w-full"], [1, "bg-red-600", "h-2", "rounded-full", "w-full"]], template: function FileUploadComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2);
      \u0275\u0275listener("dragover", function FileUploadComponent_Template_div_dragover_1_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onDragOver($event));
      })("dragleave", function FileUploadComponent_Template_div_dragleave_1_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onDragLeave($event));
      })("drop", function FileUploadComponent_Template_div_drop_1_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onDrop($event));
      });
      \u0275\u0275elementStart(2, "input", 3, 0);
      \u0275\u0275listener("change", function FileUploadComponent_Template_input_change_2_listener($event) {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.onFileSelected($event));
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 4)(5, "div", 5);
      \u0275\u0275element(6, "i", 6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div")(8, "p", 7);
      \u0275\u0275text(9, " Drop files or folders here to upload ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "p", 8);
      \u0275\u0275text(11, " Supports multiple files and folders ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(12, "button", 9);
      \u0275\u0275listener("click", function FileUploadComponent_Template_button_click_12_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.openFileDialog());
      });
      \u0275\u0275text(13, " Choose Files/Folders ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275template(14, FileUploadComponent_Conditional_14_Template, 5, 0, "div", 4);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275classProp("border-blue-500", ctx.isDragOver())("bg-blue-50", ctx.isDragOver());
      \u0275\u0275advance(13);
      \u0275\u0275conditional(ctx.uploadingFiles().length > 0 ? 14 : -1);
    }
  }, dependencies: [CommonModule], styles: ["\n\n.file-upload-container[_ngcontent-%COMP%] {\n  transition: all 0.3s ease;\n}\n.file-upload-container[_ngcontent-%COMP%]   .drop-zone[_ngcontent-%COMP%] {\n  cursor: pointer;\n}\n.file-upload-container[_ngcontent-%COMP%]   .drop-zone[_ngcontent-%COMP%]:hover {\n  border-color: #3b82f6;\n  background-color: #f8fafc;\n}\n/*# sourceMappingURL=file-upload.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FileUploadComponent, [{
    type: Component,
    args: [{ selector: "app-file-upload", standalone: true, imports: [CommonModule], template: `<div class="file-upload-container">
	<!-- Drop Zone -->
	<div
		class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors duration-200 mb-4"
		[class.border-blue-500]="isDragOver()"
		[class.bg-blue-50]="isDragOver()"
		(dragover)="onDragOver($event)"
		(dragleave)="onDragLeave($event)"
		(drop)="onDrop($event)">
		<!-- Hidden file input -->
		<input
			type="file"
			#fileInput
			multiple
			webkitdirectory
			class="hidden"
			(change)="onFileSelected($event)" />

		<div class="space-y-3">
			<div
				class="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
				<i class="fa-solid fa-cloud-upload-alt text-2xl text-gray-400"></i>
			</div>
			<div>
				<p class="text-sm font-medium text-gray-900">
					Drop files or folders here to upload
				</p>
				<p class="text-xs text-gray-500 mt-1">
					Supports multiple files and folders
				</p>
			</div>
			<button
				class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
				(click)="openFileDialog()">
				Choose Files/Folders
			</button>
		</div>
	</div>

	<!-- Uploading Files List -->
	@if (uploadingFiles().length > 0) {
	<div class="space-y-3">
		<h4 class="text-sm font-medium text-gray-900">Uploading Files</h4>
		@for ( uploadingFile of uploadingFiles(); track uploadingFile.file.name ) {
		<div class="bg-white rounded-lg p-4 border border-gray-200">
			<div class="flex items-center justify-between mb-2">
				<div class="flex items-center space-x-3">
					<i [class]="getFileIcon(uploadingFile.file.name)" class="text-lg"></i>
					<div>
						<p class="text-sm font-medium text-gray-900">
							{{ uploadingFile.file.name }}
						</p>
						<p class="text-xs text-gray-500">
							{{ formatFileSize(uploadingFile.file.size) }}
						</p>
					</div>
				</div>
				<div class="text-right">
					@if (uploadingFile.status === 'uploading') {
					<span class="text-xs text-blue-600 font-medium"
						>{{ uploadingFile.progress }}%</span
					>
					} @else if (uploadingFile.status === 'completed') {
					<span class="text-xs text-green-600 font-medium">Complete</span>
					} @else {
					<span class="text-xs text-red-600 font-medium">Failed</span>
					}
				</div>
			</div>

			@if (uploadingFile.status === 'uploading') {
			<div class="w-full bg-gray-200 rounded-full h-2">
				<div
					class="bg-blue-600 h-2 rounded-full transition-all duration-300"
					[style.width.%]="uploadingFile.progress"></div>
			</div>
			} @else if (uploadingFile.status === 'completed') {
			<div class="w-full bg-green-200 rounded-full h-2">
				<div class="bg-green-600 h-2 rounded-full w-full"></div>
			</div>
			} @else {
			<div class="w-full bg-red-200 rounded-full h-2">
				<div class="bg-red-600 h-2 rounded-full w-full"></div>
			</div>
			}
		</div>
		}
	</div>
	}
</div>
`, styles: ["/* src/app/components/file-upload/file-upload.component.scss */\n.file-upload-container {\n  transition: all 0.3s ease;\n}\n.file-upload-container .drop-zone {\n  cursor: pointer;\n}\n.file-upload-container .drop-zone:hover {\n  border-color: #3b82f6;\n  background-color: #f8fafc;\n}\n/*# sourceMappingURL=file-upload.component.css.map */\n"] }]
  }], null, { fileInput: [{
    type: ViewChild,
    args: ["fileInput"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FileUploadComponent, { className: "FileUploadComponent", filePath: "src/app/components/file-upload/file-upload.component.ts", lineNumber: 29 });
})();

// src/app/components/file-item/file-item.component.ts
function FileItemComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i");
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMapInterpolate2("fa-solid ", ctx_r0.file.icon, " ", ctx_r0.file.color, " text-4xl sm:text-6xl");
  }
}
function FileItemComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275element(1, "i");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classMapInterpolate2("fa-solid ", ctx_r0.file.icon, " ", ctx_r0.file.color, " text-2xl sm:text-3xl");
  }
}
function FileItemComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 16);
    \u0275\u0275listener("click", function FileItemComponent_Conditional_11_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      ctx_r0.onAction.emit({ action: "download", file: ctx_r0.file });
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(1, "i", 17);
    \u0275\u0275elementEnd();
  }
}
var FileItemComponent = class _FileItemComponent {
  file;
  viewMode = "grid";
  isSelected = false;
  onClick = new EventEmitter();
  onToggleSelection = new EventEmitter();
  onSelectRange = new EventEmitter();
  onAction = new EventEmitter();
  onContextMenu = new EventEmitter();
  fileManagerService = inject(FileManagerService);
  onItemClick(event) {
    if (event.target.closest("button")) {
      return;
    }
    this.onClick.emit(this.file);
  }
  static \u0275fac = function FileItemComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FileItemComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FileItemComponent, selectors: [["app-file-item"]], inputs: { file: "file", viewMode: "viewMode", isSelected: "isSelected" }, outputs: { onClick: "onClick", onToggleSelection: "onToggleSelection", onSelectRange: "onSelectRange", onAction: "onAction", onContextMenu: "onContextMenu" }, decls: 18, vars: 8, consts: [[1, "group", "bg-white", "rounded-lg", "shadow-sm", "hover:shadow-md", "transition-shadow", "p-3", "sm:p-4", "cursor-pointer", "border", "border-gray-200", "hover:border-blue-300", 3, "click", "ctrlClick", "shiftClick"], [1, "flex", "flex-col", "items-center"], [1, "mb-2", "sm:mb-3"], [3, "class"], [1, "w-16", "h-16", "sm:w-20", "sm:h-20", "bg-gray-100", "rounded-lg", "flex", "items-center", "justify-center", "group-hover:bg-gray-200", "transition-colors"], [1, "text-xs", "sm:text-sm", "font-medium", "text-gray-900", "text-center", "truncate", "w-full"], [1, "text-xs", "text-gray-500", "mt-1"], [1, "mt-2", "sm:mt-3", "opacity-0", "group-hover:opacity-100", "transition-opacity"], [1, "flex", "justify-center", "space-x-1", "sm:space-x-2"], ["title", "Download", 1, "p-1", "text-gray-400", "hover:text-blue-600"], ["title", "Move", 1, "p-1", "text-gray-400", "hover:text-blue-600", 3, "click"], [1, "fa-solid", "fa-arrows-up-down-left-right", "text-xs"], ["title", "Rename", 1, "p-1", "text-gray-400", "hover:text-blue-600", 3, "click"], [1, "fa-solid", "fa-edit", "text-xs"], ["title", "Delete", 1, "p-1", "text-gray-400", "hover:text-red-600", 3, "click"], [1, "fa-solid", "fa-trash", "text-xs"], ["title", "Download", 1, "p-1", "text-gray-400", "hover:text-blue-600", 3, "click"], [1, "fa-solid", "fa-download", "text-xs"]], template: function FileItemComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275listener("click", function FileItemComponent_Template_div_click_0_listener($event) {
        return ctx.onItemClick($event);
      })("ctrlClick", function FileItemComponent_Template_div_ctrlClick_0_listener() {
        return ctx.onToggleSelection.emit(ctx.file.id);
      })("shiftClick", function FileItemComponent_Template_div_shiftClick_0_listener() {
        return ctx.onSelectRange.emit(ctx.file.id);
      });
      \u0275\u0275elementStart(1, "div", 1)(2, "div", 2);
      \u0275\u0275template(3, FileItemComponent_Conditional_3_Template, 1, 4, "i", 3)(4, FileItemComponent_Conditional_4_Template, 2, 4, "div", 4);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "span", 5);
      \u0275\u0275text(6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "span", 6);
      \u0275\u0275text(8);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(9, "div", 7)(10, "div", 8);
      \u0275\u0275template(11, FileItemComponent_Conditional_11_Template, 2, 0, "button", 9);
      \u0275\u0275elementStart(12, "button", 10);
      \u0275\u0275listener("click", function FileItemComponent_Template_button_click_12_listener($event) {
        ctx.onAction.emit({ action: "move", file: ctx.file });
        return $event.stopPropagation();
      });
      \u0275\u0275element(13, "i", 11);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "button", 12);
      \u0275\u0275listener("click", function FileItemComponent_Template_button_click_14_listener($event) {
        ctx.onAction.emit({ action: "rename", file: ctx.file });
        return $event.stopPropagation();
      });
      \u0275\u0275element(15, "i", 13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "button", 14);
      \u0275\u0275listener("click", function FileItemComponent_Template_button_click_16_listener($event) {
        ctx.onAction.emit({ action: "delete", file: ctx.file });
        return $event.stopPropagation();
      });
      \u0275\u0275element(17, "i", 15);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("border-blue-500", ctx.isSelected)("bg-blue-50", ctx.isSelected);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.file.type === "folder" ? 3 : 4);
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.file.name);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.file.size, " ");
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.file.type === "file" ? 11 : -1);
    }
  }, styles: ["\n\n.file-item[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.file-item[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n.file-item.selected[_ngcontent-%COMP%] {\n  transform: scale(1.02);\n  box-shadow: 0 0 0 2px #3b82f6;\n}\n.file-item[_ngcontent-%COMP%]   .file-content[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.file-item[_ngcontent-%COMP%]   .file-content[_ngcontent-%COMP%]:hover {\n  border-color: #3b82f6;\n}\n.file-item[_ngcontent-%COMP%]   .file-icon[_ngcontent-%COMP%] {\n  transition: transform 0.2s ease;\n}\n.file-item[_ngcontent-%COMP%]   .file-icon[_ngcontent-%COMP%]:hover {\n  transform: scale(1.1);\n}\n.file-item[_ngcontent-%COMP%]   .file-thumbnail[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.file-item[_ngcontent-%COMP%]   .file-thumbnail[_ngcontent-%COMP%]:hover {\n  transform: scale(1.05);\n}\n.file-item[_ngcontent-%COMP%]   .hover-actions[_ngcontent-%COMP%] {\n  transition: opacity 0.2s ease;\n}\n.file-item[_ngcontent-%COMP%]   .hover-actions[_ngcontent-%COMP%]   .context-menu-btn[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.file-item[_ngcontent-%COMP%]   .hover-actions[_ngcontent-%COMP%]   .context-menu-btn[_ngcontent-%COMP%]:hover {\n  background-color: rgba(0, 0, 0, 0.05);\n  transform: scale(1.1);\n}\n.file-item[_ngcontent-%COMP%]   .checkbox[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.file-item[_ngcontent-%COMP%]   .checkbox[_ngcontent-%COMP%]:checked {\n  opacity: 1;\n}\n.file-item.folder-item[_ngcontent-%COMP%]   .file-content[_ngcontent-%COMP%]:hover {\n  border-color: #f59e0b;\n}\n.file-item[_ngcontent-%COMP%]:not(.folder-item)   .file-content[_ngcontent-%COMP%]:hover {\n  border-color: #10b981;\n}\n@keyframes _ngcontent-%COMP%_selectPulse {\n  0% {\n    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);\n  }\n  70% {\n    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);\n  }\n}\n.file-item.selected[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_selectPulse 0.6s ease-out;\n}\n/*# sourceMappingURL=file-item.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FileItemComponent, [{
    type: Component,
    args: [{ selector: "app-file-item", standalone: true, template: `<div
	class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 cursor-pointer border border-gray-200 hover:border-blue-300"
	[class.border-blue-500]="isSelected"
	[class.bg-blue-50]="isSelected"
	(click)="onItemClick($event)"
	(ctrlClick)="onToggleSelection.emit(file.id)"
	(shiftClick)="onSelectRange.emit(file.id)">
	<div class="flex flex-col items-center">
		<div class="mb-2 sm:mb-3">
			@if (file.type === 'folder') {
			<i
				class="fa-solid {{ file.icon }} {{ file.color }} text-4xl sm:text-6xl"></i>
			} @else {
			<div
				class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
				<i
					class="fa-solid {{ file.icon }} {{ file.color }} text-2xl sm:text-3xl"></i>
			</div>
			}
		</div>
		<span
			class="text-xs sm:text-sm font-medium text-gray-900 text-center truncate w-full"
			>{{ file.name }}</span
		>
		<span class="text-xs text-gray-500 mt-1"> {{ file.size }} </span>
	</div>
	<div
		class="mt-2 sm:mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
		<div class="flex justify-center space-x-1 sm:space-x-2">
			@if (file.type === 'file') {
			<button
				class="p-1 text-gray-400 hover:text-blue-600"
				title="Download"
				(click)="onAction.emit({ action: 'download', file: file }); $event.stopPropagation()">
				<i class="fa-solid fa-download text-xs"></i>
			</button>
			}
			<button
				class="p-1 text-gray-400 hover:text-blue-600"
				title="Move"
				(click)="onAction.emit({ action: 'move', file: file }); $event.stopPropagation()">
				<i class="fa-solid fa-arrows-up-down-left-right text-xs"></i>
			</button>
			<button
				class="p-1 text-gray-400 hover:text-blue-600"
				title="Rename"
				(click)="onAction.emit({ action: 'rename', file: file }); $event.stopPropagation()">
				<i class="fa-solid fa-edit text-xs"></i>
			</button>
			<button
				class="p-1 text-gray-400 hover:text-red-600"
				title="Delete"
				(click)="onAction.emit({ action: 'delete', file: file }); $event.stopPropagation()">
				<i class="fa-solid fa-trash text-xs"></i>
			</button>
		</div>
	</div>
</div>
`, styles: ["/* src/app/components/file-item/file-item.component.scss */\n.file-item {\n  transition: all 0.2s ease;\n}\n.file-item:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n.file-item.selected {\n  transform: scale(1.02);\n  box-shadow: 0 0 0 2px #3b82f6;\n}\n.file-item .file-content {\n  transition: all 0.2s ease;\n}\n.file-item .file-content:hover {\n  border-color: #3b82f6;\n}\n.file-item .file-icon {\n  transition: transform 0.2s ease;\n}\n.file-item .file-icon:hover {\n  transform: scale(1.1);\n}\n.file-item .file-thumbnail {\n  transition: all 0.2s ease;\n}\n.file-item .file-thumbnail:hover {\n  transform: scale(1.05);\n}\n.file-item .hover-actions {\n  transition: opacity 0.2s ease;\n}\n.file-item .hover-actions .context-menu-btn {\n  transition: all 0.2s ease;\n}\n.file-item .hover-actions .context-menu-btn:hover {\n  background-color: rgba(0, 0, 0, 0.05);\n  transform: scale(1.1);\n}\n.file-item .checkbox {\n  transition: all 0.2s ease;\n}\n.file-item .checkbox:checked {\n  opacity: 1;\n}\n.file-item.folder-item .file-content:hover {\n  border-color: #f59e0b;\n}\n.file-item:not(.folder-item) .file-content:hover {\n  border-color: #10b981;\n}\n@keyframes selectPulse {\n  0% {\n    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);\n  }\n  70% {\n    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);\n  }\n}\n.file-item.selected {\n  animation: selectPulse 0.6s ease-out;\n}\n/*# sourceMappingURL=file-item.component.css.map */\n"] }]
  }], null, { file: [{
    type: Input,
    args: [{ required: true }]
  }], viewMode: [{
    type: Input
  }], isSelected: [{
    type: Input
  }], onClick: [{
    type: Output
  }], onToggleSelection: [{
    type: Output
  }], onSelectRange: [{
    type: Output
  }], onAction: [{
    type: Output
  }], onContextMenu: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FileItemComponent, { className: "FileItemComponent", filePath: "src/app/components/file-item/file-item.component.ts", lineNumber: 20 });
})();

// src/app/components/header/header.component.ts
var HeaderComponent = class _HeaderComponent {
  static \u0275fac = function HeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HeaderComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _HeaderComponent, selectors: [["app-header"]], decls: 8, vars: 0, consts: [["id", "header", 1, "bg-white", "border-b", "border-gray-200", "sticky", "top-0", "z-40"], [1, "flex", "items-center", "justify-between", "px-4", "sm:px-6", "py-3", "sm:py-4"], [1, "flex", "items-center", "space-x-3", "sm:space-x-6"], [1, "flex", "items-center", "space-x-2", "sm:space-x-3"], [1, "w-8", "h-8", "sm:w-10", "sm:h-10", "bg-gradient-to-br", "from-blue-600", "to-purple-600", "rounded-lg", "flex", "items-center", "justify-center"], [1, "fa-solid", "fa-folder-open", "text-white", "text-sm", "sm:text-xl"], [1, "text-lg", "sm:text-2xl", "font-bold", "text-gray-900"]], template: function HeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "header", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4);
      \u0275\u0275element(5, "i", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(6, "h1", 6);
      \u0275\u0275text(7, " FileManager Pro ");
      \u0275\u0275elementEnd()()()()();
    }
  }, dependencies: [CommonModule], styles: ["\n\n/*# sourceMappingURL=header.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderComponent, [{
    type: Component,
    args: [{ selector: "app-header", standalone: true, imports: [CommonModule], template: '<header id="header" class="bg-white border-b border-gray-200 sticky top-0 z-40">\n	<div class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">\n		<div class="flex items-center space-x-3 sm:space-x-6">\n			<div class="flex items-center space-x-2 sm:space-x-3">\n				<div\n					class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">\n					<i class="fa-solid fa-folder-open text-white text-sm sm:text-xl"></i>\n				</div>\n				<h1 class="text-lg sm:text-2xl font-bold text-gray-900">\n					FileManager Pro\n				</h1>\n			</div>\n		</div>\n	</div>\n</header>\n', styles: ["/* src/app/components/header/header.component.scss */\n/*# sourceMappingURL=header.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(HeaderComponent, { className: "HeaderComponent", filePath: "src/app/components/header/header.component.ts", lineNumber: 11 });
})();

// src/app/components/breadcrumb/breadcrumb.component.ts
function BreadcrumbComponent_For_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275listener("click", function BreadcrumbComponent_For_5_Conditional_0_Template_span_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.navigateToRoot());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    const item_r4 = ctx_r2.$implicit;
    const \u0275$index_9_r5 = ctx_r2.$index;
    const \u0275$count_9_r6 = ctx_r2.$count;
    \u0275\u0275classProp("text-gray-900", \u0275$index_9_r5 === \u0275$count_9_r6 - 1)("font-medium", \u0275$index_9_r5 === \u0275$count_9_r6 - 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r4.name);
  }
}
function BreadcrumbComponent_For_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "span", 12);
    \u0275\u0275listener("click", function BreadcrumbComponent_For_5_Conditional_1_Template_span_click_0_listener() {
      \u0275\u0275restoreView(_r7);
      const item_r4 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.navigateToPath(item_r4.path));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    const item_r4 = ctx_r2.$implicit;
    const \u0275$index_9_r5 = ctx_r2.$index;
    const \u0275$count_9_r6 = ctx_r2.$count;
    \u0275\u0275classProp("text-gray-900", \u0275$index_9_r5 === \u0275$count_9_r6 - 1)("font-medium", \u0275$index_9_r5 === \u0275$count_9_r6 - 1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(item_r4.name);
  }
}
function BreadcrumbComponent_For_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i", 11);
  }
}
function BreadcrumbComponent_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, BreadcrumbComponent_For_5_Conditional_0_Template, 2, 5, "span", 10)(1, BreadcrumbComponent_For_5_Conditional_1_Template, 2, 5, "span", 10)(2, BreadcrumbComponent_For_5_Conditional_2_Template, 1, 0, "i", 11);
  }
  if (rf & 2) {
    const $index_r8 = ctx.$index;
    const \u0275$index_9_r5 = ctx.$index;
    const \u0275$count_9_r6 = ctx.$count;
    \u0275\u0275conditional($index_r8 === 0 ? 0 : 1);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!(\u0275$index_9_r5 === \u0275$count_9_r6 - 1) ? 2 : -1);
  }
}
var BreadcrumbComponent = class _BreadcrumbComponent {
  fileManagerService = inject(FileManagerService);
  // Inputs
  viewMode = "grid";
  // Outputs
  onNavigateToRoot = new EventEmitter();
  onNavigateToPath = new EventEmitter();
  onNavigateBack = new EventEmitter();
  onNavigateForward = new EventEmitter();
  onRefresh = new EventEmitter();
  onToggleViewMode = new EventEmitter();
  onSetViewMode = new EventEmitter();
  // Computed signals
  breadcrumbPath = computed(() => this.fileManagerService.breadcrumbPath());
  canGoBack = computed(() => this.fileManagerService.canGoBack());
  canGoForward = computed(() => this.fileManagerService.canGoForward());
  navigateToRoot() {
    this.onNavigateToRoot.emit();
  }
  navigateToPath(path) {
    this.onNavigateToPath.emit(path);
  }
  navigateBack() {
    this.onNavigateBack.emit();
  }
  navigateForward() {
    this.onNavigateForward.emit();
  }
  refresh() {
    this.onRefresh.emit();
  }
  toggleViewMode() {
    this.onToggleViewMode.emit();
  }
  setViewMode(mode) {
    this.onSetViewMode.emit(mode);
  }
  static \u0275fac = function BreadcrumbComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BreadcrumbComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _BreadcrumbComponent, selectors: [["app-breadcrumb"]], inputs: { viewMode: "viewMode" }, outputs: { onNavigateToRoot: "onNavigateToRoot", onNavigateToPath: "onNavigateToPath", onNavigateBack: "onNavigateBack", onNavigateForward: "onNavigateForward", onRefresh: "onRefresh", onToggleViewMode: "onToggleViewMode", onSetViewMode: "onSetViewMode" }, decls: 12, vars: 8, consts: [["id", "breadcrumb-section", 1, "bg-white", "border-b", "border-gray-200", "px-4", "sm:px-6", "py-3", "sm:py-4"], [1, "flex", "flex-col", "sm:flex-row", "items-start", "sm:items-center", "justify-between", "gap-3", "sm:gap-0"], [1, "flex", "items-center", "space-x-2", "overflow-x-auto"], [1, "flex", "items-center", "space-x-2", "text-xs", "sm:text-sm", "whitespace-nowrap"], [1, "flex", "items-center", "space-x-2", "sm:space-x-3", "w-full", "sm:w-auto", "justify-between", "sm:justify-end"], [1, "flex", "items-center", "space-x-1", "bg-gray-100", "rounded-lg", "p-1"], ["title", "Grid View", 1, "p-1.5", "sm:p-2", "text-gray-600", "hover:text-gray-900", "hover:bg-white", "rounded-md", "transition-colors", 3, "click"], [1, "fa-solid", "fa-th-large", "text-sm"], ["title", "List View", 1, "p-1.5", "sm:p-2", "text-gray-600", "hover:text-gray-900", "hover:bg-white", "rounded-md", "transition-colors", 3, "click"], [1, "fa-solid", "fa-list", "text-sm"], [1, "text-gray-500", "hover:text-gray-700", "cursor-pointer", 3, "text-gray-900", "font-medium"], [1, "fa-solid", "fa-chevron-right", "text-gray-300", "text-xs"], [1, "text-gray-500", "hover:text-gray-700", "cursor-pointer", 3, "click"]], template: function BreadcrumbComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "nav", 3);
      \u0275\u0275repeaterCreate(4, BreadcrumbComponent_For_5_Template, 3, 2, null, null, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "button", 6);
      \u0275\u0275listener("click", function BreadcrumbComponent_Template_button_click_8_listener() {
        return ctx.setViewMode("grid");
      });
      \u0275\u0275element(9, "i", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "button", 8);
      \u0275\u0275listener("click", function BreadcrumbComponent_Template_button_click_10_listener() {
        return ctx.setViewMode("list");
      });
      \u0275\u0275element(11, "i", 9);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275repeater(ctx.breadcrumbPath());
      \u0275\u0275advance(4);
      \u0275\u0275classProp("bg-white", ctx.viewMode === "grid")("text-gray-900", ctx.viewMode === "grid");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("bg-white", ctx.viewMode === "list")("text-gray-900", ctx.viewMode === "list");
    }
  }, dependencies: [CommonModule], styles: ["\n\n.breadcrumb-nav[_ngcontent-%COMP%]   .breadcrumb-item[_ngcontent-%COMP%] {\n  transition: color 0.2s ease;\n}\n.breadcrumb-nav[_ngcontent-%COMP%]   .breadcrumb-item[_ngcontent-%COMP%]:hover {\n  color: #1d4ed8;\n}\n.breadcrumb-nav[_ngcontent-%COMP%]   .navigation-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.breadcrumb-nav[_ngcontent-%COMP%]   .navigation-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.breadcrumb-nav[_ngcontent-%COMP%]   .navigation-button[_ngcontent-%COMP%]:not(:disabled):hover {\n  background-color: #f3f4f6;\n}\n/*# sourceMappingURL=breadcrumb.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreadcrumbComponent, [{
    type: Component,
    args: [{ selector: "app-breadcrumb", standalone: true, imports: [CommonModule], template: `<section
	id="breadcrumb-section"
	class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
	<div
		class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
		<div class="flex items-center space-x-2 overflow-x-auto">
			<nav
				class="flex items-center space-x-2 text-xs sm:text-sm whitespace-nowrap">
				@for (item of breadcrumbPath(); track $index; let isLast = $last) { @if
				($index === 0) {
				<span
					class="text-gray-500 hover:text-gray-700 cursor-pointer"
					(click)="navigateToRoot()"
					[class.text-gray-900]="isLast"
					[class.font-medium]="isLast"
					>{{ item.name }}</span
				>
				} @else {
				<span
					class="text-gray-500 hover:text-gray-700 cursor-pointer"
					(click)="navigateToPath(item.path)"
					[class.text-gray-900]="isLast"
					[class.font-medium]="isLast"
					>{{ item.name }}</span
				>
				} @if (!isLast) {
				<i class="fa-solid fa-chevron-right text-gray-300 text-xs"></i>
				} }
			</nav>
		</div>

		<div
			class="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end">
			<div class="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
				<button
					class="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
					[class.bg-white]="viewMode === 'grid'"
					[class.text-gray-900]="viewMode === 'grid'"
					(click)="setViewMode('grid')"
					title="Grid View">
					<i class="fa-solid fa-th-large text-sm"></i>
				</button>
				<button
					class="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
					[class.bg-white]="viewMode === 'list'"
					[class.text-gray-900]="viewMode === 'list'"
					(click)="setViewMode('list')"
					title="List View">
					<i class="fa-solid fa-list text-sm"></i>
				</button>
			</div>
		</div>
	</div>
</section>
`, styles: ["/* src/app/components/breadcrumb/breadcrumb.component.scss */\n.breadcrumb-nav .breadcrumb-item {\n  transition: color 0.2s ease;\n}\n.breadcrumb-nav .breadcrumb-item:hover {\n  color: #1d4ed8;\n}\n.breadcrumb-nav .navigation-button {\n  transition: all 0.2s ease;\n}\n.breadcrumb-nav .navigation-button:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.breadcrumb-nav .navigation-button:not(:disabled):hover {\n  background-color: #f3f4f6;\n}\n/*# sourceMappingURL=breadcrumb.component.css.map */\n"] }]
  }], null, { viewMode: [{
    type: Input
  }], onNavigateToRoot: [{
    type: Output
  }], onNavigateToPath: [{
    type: Output
  }], onNavigateBack: [{
    type: Output
  }], onNavigateForward: [{
    type: Output
  }], onRefresh: [{
    type: Output
  }], onToggleViewMode: [{
    type: Output
  }], onSetViewMode: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(BreadcrumbComponent, { className: "BreadcrumbComponent", filePath: "src/app/components/breadcrumb/breadcrumb.component.ts", lineNumber: 20 });
})();

// src/app/components/toolbar/toolbar.component.ts
function ToolbarComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r0.selectedCount, " selected");
  }
}
function ToolbarComponent_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r0.itemCount(), " items");
  }
}
var ToolbarComponent = class _ToolbarComponent {
  fileManagerService = inject(FileManagerService);
  modalService = inject(ModalService);
  // Inputs
  selectedCount = 0;
  viewMode = "grid";
  // Outputs
  onNewFolder = new EventEmitter();
  onUpload = new EventEmitter();
  onDelete = new EventEmitter();
  onSelectAll = new EventEmitter();
  onClearSelection = new EventEmitter();
  onToggleViewMode = new EventEmitter();
  onSetViewMode = new EventEmitter();
  // Signals
  itemCount = computed(() => this.fileManagerService.files().length);
  // Computed signals
  sortBy = computed(() => this.fileManagerService.sortBy());
  setViewMode(mode) {
    this.onSetViewMode.emit(mode);
  }
  onSortChange(event) {
    const target = event.target;
    this.fileManagerService.setSortBy(target.value);
  }
  toggleSelectAll() {
    const totalFiles = this.fileManagerService.files().length;
    if (this.selectedCount === totalFiles) {
      this.onClearSelection.emit();
    } else {
      this.onSelectAll.emit();
    }
  }
  showRenameModal() {
    const selectedItems = this.fileManagerService.selectedItems();
    if (selectedItems.size === 1) {
      const itemId = Array.from(selectedItems)[0];
      const files = this.fileManagerService.files();
      const item = files.find((f) => f.id === itemId);
      if (item) {
        this.fileManagerService.setItemToRename(item);
        this.modalService.showRenameModal();
      }
    }
  }
  showNewFolderModal() {
    this.onNewFolder.emit();
  }
  showMoveModal() {
    this.modalService.showMoveModal();
  }
  showDeleteModal() {
    this.onDelete.emit();
  }
  showUploadModal() {
    this.onUpload.emit();
  }
  uploadMultipleFiles() {
    console.log("Upload multiple files");
  }
  enableDragDrop() {
    console.log("Enable drag and drop");
  }
  downloadSelected() {
    const selectedItems = this.fileManagerService.selectedItems();
    console.log("Download selected:", Array.from(selectedItems));
  }
  deleteSelected() {
    if (this.selectedCount > 0) {
      this.showDeleteModal();
    }
  }
  refresh() {
    this.fileManagerService.refresh();
  }
  static \u0275fac = function ToolbarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ToolbarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ToolbarComponent, selectors: [["app-toolbar"]], inputs: { selectedCount: "selectedCount", viewMode: "viewMode" }, outputs: { onNewFolder: "onNewFolder", onUpload: "onUpload", onDelete: "onDelete", onSelectAll: "onSelectAll", onClearSelection: "onClearSelection", onToggleViewMode: "onToggleViewMode", onSetViewMode: "onSetViewMode" }, decls: 12, vars: 1, consts: [["id", "quick-actions", 1, "bg-white", "border-b", "border-gray-200", "px-4", "sm:px-6", "py-2", "sm:py-3"], [1, "flex", "flex-col", "sm:flex-row", "items-start", "sm:items-center", "justify-between", "gap-3", "sm:gap-0"], [1, "flex", "items-center", "space-x-2", "sm:space-x-3", "flex-wrap"], [1, "px-3", "sm:px-4", "py-1.5", "sm:py-2", "bg-green-600", "hover:bg-green-700", "text-white", "rounded-lg", "flex", "items-center", "space-x-1", "sm:space-x-2", "transition-colors", "text-sm", 3, "click"], [1, "font-medium"], [1, "flex", "items-center", "space-x-2", "sm:space-x-3", "w-full", "sm:w-auto", "justify-between", "sm:justify-end"], [1, "text-xs", "sm:text-sm", "text-gray-500"], [1, "flex", "items-center", "space-x-1", "sm:space-x-2"], ["title", "Refresh", 1, "p-1.5", "sm:p-2", "text-gray-600", "hover:text-gray-900", "hover:bg-gray-100", "rounded-lg", 3, "click"], [1, "fa-solid", "fa-refresh", "text-sm"]], template: function ToolbarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "button", 3);
      \u0275\u0275listener("click", function ToolbarComponent_Template_button_click_3_listener() {
        return ctx.showNewFolderModal();
      });
      \u0275\u0275elementStart(4, "span", 4);
      \u0275\u0275text(5, "New Folder");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(6, "div", 5);
      \u0275\u0275template(7, ToolbarComponent_Conditional_7_Template, 2, 1, "span", 6)(8, ToolbarComponent_Conditional_8_Template, 2, 1, "span", 6);
      \u0275\u0275elementStart(9, "div", 7)(10, "button", 8);
      \u0275\u0275listener("click", function ToolbarComponent_Template_button_click_10_listener() {
        return ctx.refresh();
      });
      \u0275\u0275element(11, "i", 9);
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(7);
      \u0275\u0275conditional(ctx.selectedCount > 0 ? 7 : 8);
    }
  }, dependencies: [CommonModule], styles: ["\n\n.toolbar[_ngcontent-%COMP%]   .view-toggle[_ngcontent-%COMP%]   .view-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.toolbar[_ngcontent-%COMP%]   .view-toggle[_ngcontent-%COMP%]   .view-button.active[_ngcontent-%COMP%] {\n  color: #2563eb;\n  background-color: #eff6ff;\n}\n.toolbar[_ngcontent-%COMP%]   .view-toggle[_ngcontent-%COMP%]   .view-button[_ngcontent-%COMP%]:not(.active):hover {\n  background-color: #f3f4f6;\n}\n.toolbar[_ngcontent-%COMP%]   .action-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.toolbar[_ngcontent-%COMP%]   .action-button[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n}\n.toolbar[_ngcontent-%COMP%]   .action-button.danger[_ngcontent-%COMP%]:hover {\n  background-color: #fef2f2;\n  color: #dc2626;\n}\n.toolbar[_ngcontent-%COMP%]   .action-button.primary[_ngcontent-%COMP%]:hover {\n  background-color: #eff6ff;\n  color: #2563eb;\n}\n.toolbar[_ngcontent-%COMP%]   .action-button.success[_ngcontent-%COMP%]:hover {\n  background-color: #f0fdf4;\n  color: #16a34a;\n}\n.toolbar[_ngcontent-%COMP%]   .divider[_ngcontent-%COMP%] {\n  background-color: #d1d5db;\n}\n.toolbar[_ngcontent-%COMP%]   .sort-select[_ngcontent-%COMP%] {\n  transition: border-color 0.2s ease;\n}\n.toolbar[_ngcontent-%COMP%]   .sort-select[_ngcontent-%COMP%]:focus {\n  border-color: #2563eb;\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);\n}\n.toolbar[_ngcontent-%COMP%]   .bulk-actions[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideIn 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_slideIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n/*# sourceMappingURL=toolbar.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToolbarComponent, [{
    type: Component,
    args: [{ selector: "app-toolbar", standalone: true, imports: [CommonModule], template: '<section\n	id="quick-actions"\n	class="bg-white border-b border-gray-200 px-4 sm:px-6 py-2 sm:py-3">\n	<div\n		class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">\n		<div class="flex items-center space-x-2 sm:space-x-3 flex-wrap">\n			<button\n				class="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-1 sm:space-x-2 transition-colors text-sm"\n				(click)="showNewFolderModal()">\n				<span class="font-medium">New Folder</span>\n			</button>\n		</div>\n\n		<div\n			class="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end">\n			@if (selectedCount > 0) {\n			<span class="text-xs sm:text-sm text-gray-500"\n				>{{ selectedCount }} selected</span\n			>\n			} @else {\n			<span class="text-xs sm:text-sm text-gray-500"\n				>{{ itemCount() }} items</span\n			>\n			}\n			<div class="flex items-center space-x-1 sm:space-x-2">\n				<button\n					class="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"\n					title="Refresh"\n					(click)="refresh()">\n					<i class="fa-solid fa-refresh text-sm"></i>\n				</button>\n			</div>\n		</div>\n	</div>\n</section>\n', styles: ["/* src/app/components/toolbar/toolbar.component.scss */\n.toolbar .view-toggle .view-button {\n  transition: all 0.2s ease;\n}\n.toolbar .view-toggle .view-button.active {\n  color: #2563eb;\n  background-color: #eff6ff;\n}\n.toolbar .view-toggle .view-button:not(.active):hover {\n  background-color: #f3f4f6;\n}\n.toolbar .action-button {\n  transition: all 0.2s ease;\n}\n.toolbar .action-button:hover {\n  transform: translateY(-1px);\n}\n.toolbar .action-button.danger:hover {\n  background-color: #fef2f2;\n  color: #dc2626;\n}\n.toolbar .action-button.primary:hover {\n  background-color: #eff6ff;\n  color: #2563eb;\n}\n.toolbar .action-button.success:hover {\n  background-color: #f0fdf4;\n  color: #16a34a;\n}\n.toolbar .divider {\n  background-color: #d1d5db;\n}\n.toolbar .sort-select {\n  transition: border-color 0.2s ease;\n}\n.toolbar .sort-select:focus {\n  border-color: #2563eb;\n  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);\n}\n.toolbar .bulk-actions {\n  animation: slideIn 0.3s ease-out;\n}\n@keyframes slideIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n/*# sourceMappingURL=toolbar.component.css.map */\n"] }]
  }], null, { selectedCount: [{
    type: Input
  }], viewMode: [{
    type: Input
  }], onNewFolder: [{
    type: Output
  }], onUpload: [{
    type: Output
  }], onDelete: [{
    type: Output
  }], onSelectAll: [{
    type: Output
  }], onClearSelection: [{
    type: Output
  }], onToggleViewMode: [{
    type: Output
  }], onSetViewMode: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ToolbarComponent, { className: "ToolbarComponent", filePath: "src/app/components/toolbar/toolbar.component.ts", lineNumber: 21 });
})();

// node_modules/@angular/forms/fesm2022/forms.mjs
var BaseControlValueAccessor = class _BaseControlValueAccessor {
  _renderer;
  _elementRef;
  /**
   * The registered callback function called when a change or input event occurs on the input
   * element.
   * @docs-private
   */
  onChange = (_) => {
  };
  /**
   * The registered callback function called when a blur event occurs on the input element.
   * @docs-private
   */
  onTouched = () => {
  };
  constructor(_renderer, _elementRef) {
    this._renderer = _renderer;
    this._elementRef = _elementRef;
  }
  /**
   * Helper method that sets a property on a target element using the current Renderer
   * implementation.
   * @docs-private
   */
  setProperty(key, value) {
    this._renderer.setProperty(this._elementRef.nativeElement, key, value);
  }
  /**
   * Registers a function called when the control is touched.
   * @docs-private
   */
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  /**
   * Registers a function called when the control value changes.
   * @docs-private
   */
  registerOnChange(fn) {
    this.onChange = fn;
  }
  /**
   * Sets the "disabled" property on the range input element.
   * @docs-private
   */
  setDisabledState(isDisabled) {
    this.setProperty("disabled", isDisabled);
  }
  static \u0275fac = function BaseControlValueAccessor_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BaseControlValueAccessor)(\u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ElementRef));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _BaseControlValueAccessor
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseControlValueAccessor, [{
    type: Directive
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }], null);
})();
var BuiltInControlValueAccessor = class _BuiltInControlValueAccessor extends BaseControlValueAccessor {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275BuiltInControlValueAccessor_BaseFactory;
    return function BuiltInControlValueAccessor_Factory(__ngFactoryType__) {
      return (\u0275BuiltInControlValueAccessor_BaseFactory || (\u0275BuiltInControlValueAccessor_BaseFactory = \u0275\u0275getInheritedFactory(_BuiltInControlValueAccessor)))(__ngFactoryType__ || _BuiltInControlValueAccessor);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _BuiltInControlValueAccessor,
    features: [\u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BuiltInControlValueAccessor, [{
    type: Directive
  }], null, null);
})();
var NG_VALUE_ACCESSOR = new InjectionToken(ngDevMode ? "NgValueAccessor" : "");
var CHECKBOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxControlValueAccessor),
  multi: true
};
var CheckboxControlValueAccessor = class _CheckboxControlValueAccessor extends BuiltInControlValueAccessor {
  /**
   * Sets the "checked" property on the input element.
   * @docs-private
   */
  writeValue(value) {
    this.setProperty("checked", value);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275CheckboxControlValueAccessor_BaseFactory;
    return function CheckboxControlValueAccessor_Factory(__ngFactoryType__) {
      return (\u0275CheckboxControlValueAccessor_BaseFactory || (\u0275CheckboxControlValueAccessor_BaseFactory = \u0275\u0275getInheritedFactory(_CheckboxControlValueAccessor)))(__ngFactoryType__ || _CheckboxControlValueAccessor);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CheckboxControlValueAccessor,
    selectors: [["input", "type", "checkbox", "formControlName", ""], ["input", "type", "checkbox", "formControl", ""], ["input", "type", "checkbox", "ngModel", ""]],
    hostBindings: function CheckboxControlValueAccessor_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("change", function CheckboxControlValueAccessor_change_HostBindingHandler($event) {
          return ctx.onChange($event.target.checked);
        })("blur", function CheckboxControlValueAccessor_blur_HostBindingHandler() {
          return ctx.onTouched();
        });
      }
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([CHECKBOX_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CheckboxControlValueAccessor, [{
    type: Directive,
    args: [{
      selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]",
      host: {
        "(change)": "onChange($event.target.checked)",
        "(blur)": "onTouched()"
      },
      providers: [CHECKBOX_VALUE_ACCESSOR],
      standalone: false
    }]
  }], null, null);
})();
var DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DefaultValueAccessor),
  multi: true
};
function _isAndroid() {
  const userAgent = getDOM() ? getDOM().getUserAgent() : "";
  return /android (\d+)/.test(userAgent.toLowerCase());
}
var COMPOSITION_BUFFER_MODE = new InjectionToken(ngDevMode ? "CompositionEventMode" : "");
var DefaultValueAccessor = class _DefaultValueAccessor extends BaseControlValueAccessor {
  _compositionMode;
  /** Whether the user is creating a composition string (IME events). */
  _composing = false;
  constructor(renderer, elementRef, _compositionMode) {
    super(renderer, elementRef);
    this._compositionMode = _compositionMode;
    if (this._compositionMode == null) {
      this._compositionMode = !_isAndroid();
    }
  }
  /**
   * Sets the "value" property on the input element.
   * @docs-private
   */
  writeValue(value) {
    const normalizedValue = value == null ? "" : value;
    this.setProperty("value", normalizedValue);
  }
  /** @internal */
  _handleInput(value) {
    if (!this._compositionMode || this._compositionMode && !this._composing) {
      this.onChange(value);
    }
  }
  /** @internal */
  _compositionStart() {
    this._composing = true;
  }
  /** @internal */
  _compositionEnd(value) {
    this._composing = false;
    this._compositionMode && this.onChange(value);
  }
  static \u0275fac = function DefaultValueAccessor_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DefaultValueAccessor)(\u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(COMPOSITION_BUFFER_MODE, 8));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _DefaultValueAccessor,
    selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]],
    hostBindings: function DefaultValueAccessor_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("input", function DefaultValueAccessor_input_HostBindingHandler($event) {
          return ctx._handleInput($event.target.value);
        })("blur", function DefaultValueAccessor_blur_HostBindingHandler() {
          return ctx.onTouched();
        })("compositionstart", function DefaultValueAccessor_compositionstart_HostBindingHandler() {
          return ctx._compositionStart();
        })("compositionend", function DefaultValueAccessor_compositionend_HostBindingHandler($event) {
          return ctx._compositionEnd($event.target.value);
        });
      }
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([DEFAULT_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DefaultValueAccessor, [{
    type: Directive,
    args: [{
      selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]",
      // TODO: vsavkin replace the above selector with the one below it once
      // https://github.com/angular/angular/issues/3011 is implemented
      // selector: '[ngModel],[formControl],[formControlName]',
      host: {
        "(input)": "$any(this)._handleInput($event.target.value)",
        "(blur)": "onTouched()",
        "(compositionstart)": "$any(this)._compositionStart()",
        "(compositionend)": "$any(this)._compositionEnd($event.target.value)"
      },
      providers: [DEFAULT_VALUE_ACCESSOR],
      standalone: false
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [COMPOSITION_BUFFER_MODE]
    }]
  }], null);
})();
function isEmptyInputValue(value) {
  return value == null || lengthOrSize(value) === 0;
}
function lengthOrSize(value) {
  if (value == null) {
    return null;
  } else if (Array.isArray(value) || typeof value === "string") {
    return value.length;
  } else if (value instanceof Set) {
    return value.size;
  }
  return null;
}
var NG_VALIDATORS = new InjectionToken(ngDevMode ? "NgValidators" : "");
var NG_ASYNC_VALIDATORS = new InjectionToken(ngDevMode ? "NgAsyncValidators" : "");
var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
function minValidator(min) {
  return (control) => {
    if (control.value == null || min == null) {
      return null;
    }
    const value = parseFloat(control.value);
    return !isNaN(value) && value < min ? {
      "min": {
        "min": min,
        "actual": control.value
      }
    } : null;
  };
}
function maxValidator(max) {
  return (control) => {
    if (control.value == null || max == null) {
      return null;
    }
    const value = parseFloat(control.value);
    return !isNaN(value) && value > max ? {
      "max": {
        "max": max,
        "actual": control.value
      }
    } : null;
  };
}
function requiredValidator(control) {
  return isEmptyInputValue(control.value) ? {
    "required": true
  } : null;
}
function requiredTrueValidator(control) {
  return control.value === true ? null : {
    "required": true
  };
}
function emailValidator(control) {
  if (isEmptyInputValue(control.value)) {
    return null;
  }
  return EMAIL_REGEXP.test(control.value) ? null : {
    "email": true
  };
}
function minLengthValidator(minLength) {
  return (control) => {
    const length = control.value?.length ?? lengthOrSize(control.value);
    if (length === null || length === 0) {
      return null;
    }
    return length < minLength ? {
      "minlength": {
        "requiredLength": minLength,
        "actualLength": length
      }
    } : null;
  };
}
function maxLengthValidator(maxLength) {
  return (control) => {
    const length = control.value?.length ?? lengthOrSize(control.value);
    if (length !== null && length > maxLength) {
      return {
        "maxlength": {
          "requiredLength": maxLength,
          "actualLength": length
        }
      };
    }
    return null;
  };
}
function patternValidator(pattern) {
  if (!pattern) return nullValidator;
  let regex;
  let regexStr;
  if (typeof pattern === "string") {
    regexStr = "";
    if (pattern.charAt(0) !== "^") regexStr += "^";
    regexStr += pattern;
    if (pattern.charAt(pattern.length - 1) !== "$") regexStr += "$";
    regex = new RegExp(regexStr);
  } else {
    regexStr = pattern.toString();
    regex = pattern;
  }
  return (control) => {
    if (isEmptyInputValue(control.value)) {
      return null;
    }
    const value = control.value;
    return regex.test(value) ? null : {
      "pattern": {
        "requiredPattern": regexStr,
        "actualValue": value
      }
    };
  };
}
function nullValidator(control) {
  return null;
}
function isPresent(o) {
  return o != null;
}
function toObservable(value) {
  const obs = isPromise(value) ? from(value) : value;
  if ((typeof ngDevMode === "undefined" || ngDevMode) && !isSubscribable(obs)) {
    let errorMessage = `Expected async validator to return Promise or Observable.`;
    if (typeof value === "object") {
      errorMessage += " Are you using a synchronous validator where an async validator is expected?";
    }
    throw new RuntimeError(-1101, errorMessage);
  }
  return obs;
}
function mergeErrors(arrayOfErrors) {
  let res = {};
  arrayOfErrors.forEach((errors) => {
    res = errors != null ? __spreadValues(__spreadValues({}, res), errors) : res;
  });
  return Object.keys(res).length === 0 ? null : res;
}
function executeValidators(control, validators) {
  return validators.map((validator) => validator(control));
}
function isValidatorFn(validator) {
  return !validator.validate;
}
function normalizeValidators(validators) {
  return validators.map((validator) => {
    return isValidatorFn(validator) ? validator : (c) => validator.validate(c);
  });
}
function compose(validators) {
  if (!validators) return null;
  const presentValidators = validators.filter(isPresent);
  if (presentValidators.length == 0) return null;
  return function(control) {
    return mergeErrors(executeValidators(control, presentValidators));
  };
}
function composeValidators(validators) {
  return validators != null ? compose(normalizeValidators(validators)) : null;
}
function composeAsync(validators) {
  if (!validators) return null;
  const presentValidators = validators.filter(isPresent);
  if (presentValidators.length == 0) return null;
  return function(control) {
    const observables = executeValidators(control, presentValidators).map(toObservable);
    return forkJoin(observables).pipe(map(mergeErrors));
  };
}
function composeAsyncValidators(validators) {
  return validators != null ? composeAsync(normalizeValidators(validators)) : null;
}
function mergeValidators(controlValidators, dirValidator) {
  if (controlValidators === null) return [dirValidator];
  return Array.isArray(controlValidators) ? [...controlValidators, dirValidator] : [controlValidators, dirValidator];
}
function getControlValidators(control) {
  return control._rawValidators;
}
function getControlAsyncValidators(control) {
  return control._rawAsyncValidators;
}
function makeValidatorsArray(validators) {
  if (!validators) return [];
  return Array.isArray(validators) ? validators : [validators];
}
function hasValidator(validators, validator) {
  return Array.isArray(validators) ? validators.includes(validator) : validators === validator;
}
function addValidators(validators, currentValidators) {
  const current = makeValidatorsArray(currentValidators);
  const validatorsToAdd = makeValidatorsArray(validators);
  validatorsToAdd.forEach((v) => {
    if (!hasValidator(current, v)) {
      current.push(v);
    }
  });
  return current;
}
function removeValidators(validators, currentValidators) {
  return makeValidatorsArray(currentValidators).filter((v) => !hasValidator(validators, v));
}
var AbstractControlDirective = class {
  /**
   * @description
   * Reports the value of the control if it is present, otherwise null.
   */
  get value() {
    return this.control ? this.control.value : null;
  }
  /**
   * @description
   * Reports whether the control is valid. A control is considered valid if no
   * validation errors exist with the current value.
   * If the control is not present, null is returned.
   */
  get valid() {
    return this.control ? this.control.valid : null;
  }
  /**
   * @description
   * Reports whether the control is invalid, meaning that an error exists in the input value.
   * If the control is not present, null is returned.
   */
  get invalid() {
    return this.control ? this.control.invalid : null;
  }
  /**
   * @description
   * Reports whether a control is pending, meaning that async validation is occurring and
   * errors are not yet available for the input value. If the control is not present, null is
   * returned.
   */
  get pending() {
    return this.control ? this.control.pending : null;
  }
  /**
   * @description
   * Reports whether the control is disabled, meaning that the control is disabled
   * in the UI and is exempt from validation checks and excluded from aggregate
   * values of ancestor controls. If the control is not present, null is returned.
   */
  get disabled() {
    return this.control ? this.control.disabled : null;
  }
  /**
   * @description
   * Reports whether the control is enabled, meaning that the control is included in ancestor
   * calculations of validity or value. If the control is not present, null is returned.
   */
  get enabled() {
    return this.control ? this.control.enabled : null;
  }
  /**
   * @description
   * Reports the control's validation errors. If the control is not present, null is returned.
   */
  get errors() {
    return this.control ? this.control.errors : null;
  }
  /**
   * @description
   * Reports whether the control is pristine, meaning that the user has not yet changed
   * the value in the UI. If the control is not present, null is returned.
   */
  get pristine() {
    return this.control ? this.control.pristine : null;
  }
  /**
   * @description
   * Reports whether the control is dirty, meaning that the user has changed
   * the value in the UI. If the control is not present, null is returned.
   */
  get dirty() {
    return this.control ? this.control.dirty : null;
  }
  /**
   * @description
   * Reports whether the control is touched, meaning that the user has triggered
   * a `blur` event on it. If the control is not present, null is returned.
   */
  get touched() {
    return this.control ? this.control.touched : null;
  }
  /**
   * @description
   * Reports the validation status of the control. Possible values include:
   * 'VALID', 'INVALID', 'DISABLED', and 'PENDING'.
   * If the control is not present, null is returned.
   */
  get status() {
    return this.control ? this.control.status : null;
  }
  /**
   * @description
   * Reports whether the control is untouched, meaning that the user has not yet triggered
   * a `blur` event on it. If the control is not present, null is returned.
   */
  get untouched() {
    return this.control ? this.control.untouched : null;
  }
  /**
   * @description
   * Returns a multicasting observable that emits a validation status whenever it is
   * calculated for the control. If the control is not present, null is returned.
   */
  get statusChanges() {
    return this.control ? this.control.statusChanges : null;
  }
  /**
   * @description
   * Returns a multicasting observable of value changes for the control that emits every time the
   * value of the control changes in the UI or programmatically.
   * If the control is not present, null is returned.
   */
  get valueChanges() {
    return this.control ? this.control.valueChanges : null;
  }
  /**
   * @description
   * Returns an array that represents the path from the top-level form to this control.
   * Each index is the string name of the control on that level.
   */
  get path() {
    return null;
  }
  /**
   * Contains the result of merging synchronous validators into a single validator function
   * (combined using `Validators.compose`).
   */
  _composedValidatorFn;
  /**
   * Contains the result of merging asynchronous validators into a single validator function
   * (combined using `Validators.composeAsync`).
   */
  _composedAsyncValidatorFn;
  /**
   * Set of synchronous validators as they were provided while calling `setValidators` function.
   * @internal
   */
  _rawValidators = [];
  /**
   * Set of asynchronous validators as they were provided while calling `setAsyncValidators`
   * function.
   * @internal
   */
  _rawAsyncValidators = [];
  /**
   * Sets synchronous validators for this directive.
   * @internal
   */
  _setValidators(validators) {
    this._rawValidators = validators || [];
    this._composedValidatorFn = composeValidators(this._rawValidators);
  }
  /**
   * Sets asynchronous validators for this directive.
   * @internal
   */
  _setAsyncValidators(validators) {
    this._rawAsyncValidators = validators || [];
    this._composedAsyncValidatorFn = composeAsyncValidators(this._rawAsyncValidators);
  }
  /**
   * @description
   * Synchronous validator function composed of all the synchronous validators registered with this
   * directive.
   */
  get validator() {
    return this._composedValidatorFn || null;
  }
  /**
   * @description
   * Asynchronous validator function composed of all the asynchronous validators registered with
   * this directive.
   */
  get asyncValidator() {
    return this._composedAsyncValidatorFn || null;
  }
  /*
   * The set of callbacks to be invoked when directive instance is being destroyed.
   */
  _onDestroyCallbacks = [];
  /**
   * Internal function to register callbacks that should be invoked
   * when directive instance is being destroyed.
   * @internal
   */
  _registerOnDestroy(fn) {
    this._onDestroyCallbacks.push(fn);
  }
  /**
   * Internal function to invoke all registered "on destroy" callbacks.
   * Note: calling this function also clears the list of callbacks.
   * @internal
   */
  _invokeOnDestroyCallbacks() {
    this._onDestroyCallbacks.forEach((fn) => fn());
    this._onDestroyCallbacks = [];
  }
  /**
   * @description
   * Resets the control with the provided value if the control is present.
   */
  reset(value = void 0) {
    if (this.control) this.control.reset(value);
  }
  /**
   * @description
   * Reports whether the control with the given path has the error specified.
   *
   * @param errorCode The code of the error to check
   * @param path A list of control names that designates how to move from the current control
   * to the control that should be queried for errors.
   *
   * @usageNotes
   * For example, for the following `FormGroup`:
   *
   * ```ts
   * form = new FormGroup({
   *   address: new FormGroup({ street: new FormControl() })
   * });
   * ```
   *
   * The path to the 'street' control from the root form would be 'address' -> 'street'.
   *
   * It can be provided to this method in one of two formats:
   *
   * 1. An array of string control names, e.g. `['address', 'street']`
   * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
   *
   * If no path is given, this method checks for the error on the current control.
   *
   * @returns whether the given error is present in the control at the given path.
   *
   * If the control is not present, false is returned.
   */
  hasError(errorCode, path) {
    return this.control ? this.control.hasError(errorCode, path) : false;
  }
  /**
   * @description
   * Reports error data for the control with the given path.
   *
   * @param errorCode The code of the error to check
   * @param path A list of control names that designates how to move from the current control
   * to the control that should be queried for errors.
   *
   * @usageNotes
   * For example, for the following `FormGroup`:
   *
   * ```ts
   * form = new FormGroup({
   *   address: new FormGroup({ street: new FormControl() })
   * });
   * ```
   *
   * The path to the 'street' control from the root form would be 'address' -> 'street'.
   *
   * It can be provided to this method in one of two formats:
   *
   * 1. An array of string control names, e.g. `['address', 'street']`
   * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
   *
   * @returns error data for that particular error. If the control or error is not present,
   * null is returned.
   */
  getError(errorCode, path) {
    return this.control ? this.control.getError(errorCode, path) : null;
  }
};
var ControlContainer = class extends AbstractControlDirective {
  /**
   * @description
   * The name for the control
   */
  name;
  /**
   * @description
   * The top-level form directive for the control.
   */
  get formDirective() {
    return null;
  }
  /**
   * @description
   * The path to this group.
   */
  get path() {
    return null;
  }
};
var NgControl = class extends AbstractControlDirective {
  /**
   * @description
   * The parent form for the control.
   *
   * @internal
   */
  _parent = null;
  /**
   * @description
   * The name for the control
   */
  name = null;
  /**
   * @description
   * The value accessor for the control
   */
  valueAccessor = null;
};
var AbstractControlStatus = class {
  _cd;
  constructor(cd) {
    this._cd = cd;
  }
  get isTouched() {
    this._cd?.control?._touched?.();
    return !!this._cd?.control?.touched;
  }
  get isUntouched() {
    return !!this._cd?.control?.untouched;
  }
  get isPristine() {
    this._cd?.control?._pristine?.();
    return !!this._cd?.control?.pristine;
  }
  get isDirty() {
    return !!this._cd?.control?.dirty;
  }
  get isValid() {
    this._cd?.control?._status?.();
    return !!this._cd?.control?.valid;
  }
  get isInvalid() {
    return !!this._cd?.control?.invalid;
  }
  get isPending() {
    return !!this._cd?.control?.pending;
  }
  get isSubmitted() {
    this._cd?._submitted?.();
    return !!this._cd?.submitted;
  }
};
var ngControlStatusHost = {
  "[class.ng-untouched]": "isUntouched",
  "[class.ng-touched]": "isTouched",
  "[class.ng-pristine]": "isPristine",
  "[class.ng-dirty]": "isDirty",
  "[class.ng-valid]": "isValid",
  "[class.ng-invalid]": "isInvalid",
  "[class.ng-pending]": "isPending"
};
var ngGroupStatusHost = __spreadProps(__spreadValues({}, ngControlStatusHost), {
  "[class.ng-submitted]": "isSubmitted"
});
var NgControlStatus = class _NgControlStatus extends AbstractControlStatus {
  constructor(cd) {
    super(cd);
  }
  static \u0275fac = function NgControlStatus_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgControlStatus)(\u0275\u0275directiveInject(NgControl, 2));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NgControlStatus,
    selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]],
    hostVars: 14,
    hostBindings: function NgControlStatus_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("ng-untouched", ctx.isUntouched)("ng-touched", ctx.isTouched)("ng-pristine", ctx.isPristine)("ng-dirty", ctx.isDirty)("ng-valid", ctx.isValid)("ng-invalid", ctx.isInvalid)("ng-pending", ctx.isPending);
      }
    },
    standalone: false,
    features: [\u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgControlStatus, [{
    type: Directive,
    args: [{
      selector: "[formControlName],[ngModel],[formControl]",
      host: ngControlStatusHost,
      standalone: false
    }]
  }], () => [{
    type: NgControl,
    decorators: [{
      type: Self
    }]
  }], null);
})();
var NgControlStatusGroup = class _NgControlStatusGroup extends AbstractControlStatus {
  constructor(cd) {
    super(cd);
  }
  static \u0275fac = function NgControlStatusGroup_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgControlStatusGroup)(\u0275\u0275directiveInject(ControlContainer, 10));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NgControlStatusGroup,
    selectors: [["", "formGroupName", ""], ["", "formArrayName", ""], ["", "ngModelGroup", ""], ["", "formGroup", ""], ["form", 3, "ngNoForm", ""], ["", "ngForm", ""]],
    hostVars: 16,
    hostBindings: function NgControlStatusGroup_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("ng-untouched", ctx.isUntouched)("ng-touched", ctx.isTouched)("ng-pristine", ctx.isPristine)("ng-dirty", ctx.isDirty)("ng-valid", ctx.isValid)("ng-invalid", ctx.isInvalid)("ng-pending", ctx.isPending)("ng-submitted", ctx.isSubmitted);
      }
    },
    standalone: false,
    features: [\u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgControlStatusGroup, [{
    type: Directive,
    args: [{
      selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]",
      host: ngGroupStatusHost,
      standalone: false
    }]
  }], () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }]
  }], null);
})();
var formControlNameExample = `
  <div [formGroup]="myGroup">
    <input formControlName="firstName">
  </div>

  In your class:

  this.myGroup = new FormGroup({
      firstName: new FormControl()
  });`;
var formGroupNameExample = `
  <div [formGroup]="myGroup">
      <div formGroupName="person">
        <input formControlName="firstName">
      </div>
  </div>

  In your class:

  this.myGroup = new FormGroup({
      person: new FormGroup({ firstName: new FormControl() })
  });`;
var formArrayNameExample = `
  <div [formGroup]="myGroup">
    <div formArrayName="cities">
      <div *ngFor="let city of cityArray.controls; index as i">
        <input [formControlName]="i">
      </div>
    </div>
  </div>

  In your class:

  this.cityArray = new FormArray([new FormControl('SF')]);
  this.myGroup = new FormGroup({
    cities: this.cityArray
  });`;
var ngModelGroupExample = `
  <form>
      <div ngModelGroup="person">
        <input [(ngModel)]="person.name" name="firstName">
      </div>
  </form>`;
var ngModelWithFormGroupExample = `
  <div [formGroup]="myGroup">
      <input formControlName="firstName">
      <input [(ngModel)]="showMoreControls" [ngModelOptions]="{standalone: true}">
  </div>
`;
function controlParentException(nameOrIndex) {
  return new RuntimeError(1050, `formControlName must be used with a parent formGroup directive. You'll want to add a formGroup
      directive and pass it an existing FormGroup instance (you can create one in your class).

      ${describeFormControl(nameOrIndex)}

    Example:

    ${formControlNameExample}`);
}
function describeFormControl(nameOrIndex) {
  if (nameOrIndex == null || nameOrIndex === "") {
    return "";
  }
  const valueType = typeof nameOrIndex === "string" ? "name" : "index";
  return `Affected Form Control ${valueType}: "${nameOrIndex}"`;
}
function ngModelGroupException() {
  return new RuntimeError(1051, `formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents
      that also have a "form" prefix: formGroupName, formArrayName, or formGroup.

      Option 1:  Update the parent to be formGroupName (reactive form strategy)

      ${formGroupNameExample}

      Option 2: Use ngModel instead of formControlName (template-driven strategy)

      ${ngModelGroupExample}`);
}
function missingFormException() {
  return new RuntimeError(1052, `formGroup expects a FormGroup instance. Please pass one in.

      Example:

      ${formControlNameExample}`);
}
function groupParentException() {
  return new RuntimeError(1053, `formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup
    directive and pass it an existing FormGroup instance (you can create one in your class).

    Example:

    ${formGroupNameExample}`);
}
function arrayParentException() {
  return new RuntimeError(1054, `formArrayName must be used with a parent formGroup directive.  You'll want to add a formGroup
      directive and pass it an existing FormGroup instance (you can create one in your class).

      Example:

      ${formArrayNameExample}`);
}
var disabledAttrWarning = `
  It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true
  when you set up this control in your component class, the disabled attribute will actually be set in the DOM for
  you. We recommend using this approach to avoid 'changed after checked' errors.

  Example:
  // Specify the \`disabled\` property at control creation time:
  form = new FormGroup({
    first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
    last: new FormControl('Drew', Validators.required)
  });

  // Controls can also be enabled/disabled after creation:
  form.get('first')?.enable();
  form.get('last')?.disable();
`;
var asyncValidatorsDroppedWithOptsWarning = `
  It looks like you're constructing using a FormControl with both an options argument and an
  async validators argument. Mixing these arguments will cause your async validators to be dropped.
  You should either put all your validators in the options object, or in separate validators
  arguments. For example:

  // Using validators arguments
  fc = new FormControl(42, Validators.required, myAsyncValidator);

  // Using AbstractControlOptions
  fc = new FormControl(42, {validators: Validators.required, asyncValidators: myAV});

  // Do NOT mix them: async validators will be dropped!
  fc = new FormControl(42, {validators: Validators.required}, /* Oops! */ myAsyncValidator);
`;
function ngModelWarning(directiveName) {
  return `
  It looks like you're using ngModel on the same form field as ${directiveName}.
  Support for using the ngModel input property and ngModelChange event with
  reactive form directives has been deprecated in Angular v6 and will be removed
  in a future version of Angular.

  For more information on this, see our API docs here:
  https://angular.io/api/forms/${directiveName === "formControl" ? "FormControlDirective" : "FormControlName"}#use-with-ngmodel
  `;
}
function describeKey(isFormGroup, key) {
  return isFormGroup ? `with name: '${key}'` : `at index: ${key}`;
}
function noControlsError(isFormGroup) {
  return `
    There are no form controls registered with this ${isFormGroup ? "group" : "array"} yet. If you're using ngModel,
    you may want to check next tick (e.g. use setTimeout).
  `;
}
function missingControlError(isFormGroup, key) {
  return `Cannot find form control ${describeKey(isFormGroup, key)}`;
}
function missingControlValueError(isFormGroup, key) {
  return `Must supply a value for form control ${describeKey(isFormGroup, key)}`;
}
var VALID = "VALID";
var INVALID = "INVALID";
var PENDING = "PENDING";
var DISABLED = "DISABLED";
var ControlEvent = class {
};
var ValueChangeEvent = class extends ControlEvent {
  value;
  source;
  constructor(value, source) {
    super();
    this.value = value;
    this.source = source;
  }
};
var PristineChangeEvent = class extends ControlEvent {
  pristine;
  source;
  constructor(pristine, source) {
    super();
    this.pristine = pristine;
    this.source = source;
  }
};
var TouchedChangeEvent = class extends ControlEvent {
  touched;
  source;
  constructor(touched, source) {
    super();
    this.touched = touched;
    this.source = source;
  }
};
var StatusChangeEvent = class extends ControlEvent {
  status;
  source;
  constructor(status, source) {
    super();
    this.status = status;
    this.source = source;
  }
};
var FormSubmittedEvent = class extends ControlEvent {
  source;
  constructor(source) {
    super();
    this.source = source;
  }
};
var FormResetEvent = class extends ControlEvent {
  source;
  constructor(source) {
    super();
    this.source = source;
  }
};
function pickValidators(validatorOrOpts) {
  return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators : validatorOrOpts) || null;
}
function coerceToValidator(validator) {
  return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}
function pickAsyncValidators(asyncValidator, validatorOrOpts) {
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    if (isOptionsObj(validatorOrOpts) && asyncValidator) {
      console.warn(asyncValidatorsDroppedWithOptsWarning);
    }
  }
  return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators : asyncValidator) || null;
}
function coerceToAsyncValidator(asyncValidator) {
  return Array.isArray(asyncValidator) ? composeAsyncValidators(asyncValidator) : asyncValidator || null;
}
function isOptionsObj(validatorOrOpts) {
  return validatorOrOpts != null && !Array.isArray(validatorOrOpts) && typeof validatorOrOpts === "object";
}
function assertControlPresent(parent, isGroup, key) {
  const controls = parent.controls;
  const collection = isGroup ? Object.keys(controls) : controls;
  if (!collection.length) {
    throw new RuntimeError(1e3, typeof ngDevMode === "undefined" || ngDevMode ? noControlsError(isGroup) : "");
  }
  if (!controls[key]) {
    throw new RuntimeError(1001, typeof ngDevMode === "undefined" || ngDevMode ? missingControlError(isGroup, key) : "");
  }
}
function assertAllValuesPresent(control, isGroup, value) {
  control._forEachChild((_, key) => {
    if (value[key] === void 0) {
      throw new RuntimeError(1002, typeof ngDevMode === "undefined" || ngDevMode ? missingControlValueError(isGroup, key) : "");
    }
  });
}
var AbstractControl = class {
  /** @internal */
  _pendingDirty = false;
  /**
   * Indicates that a control has its own pending asynchronous validation in progress.
   * It also stores if the control should emit events when the validation status changes.
   *
   * @internal
   */
  _hasOwnPendingAsyncValidator = null;
  /** @internal */
  _pendingTouched = false;
  /** @internal */
  _onCollectionChange = () => {
  };
  /** @internal */
  _updateOn;
  _parent = null;
  _asyncValidationSubscription;
  /**
   * Contains the result of merging synchronous validators into a single validator function
   * (combined using `Validators.compose`).
   *
   * @internal
   */
  _composedValidatorFn;
  /**
   * Contains the result of merging asynchronous validators into a single validator function
   * (combined using `Validators.composeAsync`).
   *
   * @internal
   */
  _composedAsyncValidatorFn;
  /**
   * Synchronous validators as they were provided:
   *  - in `AbstractControl` constructor
   *  - as an argument while calling `setValidators` function
   *  - while calling the setter on the `validator` field (e.g. `control.validator = validatorFn`)
   *
   * @internal
   */
  _rawValidators;
  /**
   * Asynchronous validators as they were provided:
   *  - in `AbstractControl` constructor
   *  - as an argument while calling `setAsyncValidators` function
   *  - while calling the setter on the `asyncValidator` field (e.g. `control.asyncValidator =
   * asyncValidatorFn`)
   *
   * @internal
   */
  _rawAsyncValidators;
  /**
   * The current value of the control.
   *
   * * For a `FormControl`, the current value.
   * * For an enabled `FormGroup`, the values of enabled controls as an object
   * with a key-value pair for each member of the group.
   * * For a disabled `FormGroup`, the values of all controls as an object
   * with a key-value pair for each member of the group.
   * * For a `FormArray`, the values of enabled controls as an array.
   *
   */
  value;
  /**
   * Initialize the AbstractControl instance.
   *
   * @param validators The function or array of functions that is used to determine the validity of
   *     this control synchronously.
   * @param asyncValidators The function or array of functions that is used to determine validity of
   *     this control asynchronously.
   */
  constructor(validators, asyncValidators) {
    this._assignValidators(validators);
    this._assignAsyncValidators(asyncValidators);
  }
  /**
   * Returns the function that is used to determine the validity of this control synchronously.
   * If multiple validators have been added, this will be a single composed function.
   * See `Validators.compose()` for additional information.
   */
  get validator() {
    return this._composedValidatorFn;
  }
  set validator(validatorFn) {
    this._rawValidators = this._composedValidatorFn = validatorFn;
  }
  /**
   * Returns the function that is used to determine the validity of this control asynchronously.
   * If multiple validators have been added, this will be a single composed function.
   * See `Validators.compose()` for additional information.
   */
  get asyncValidator() {
    return this._composedAsyncValidatorFn;
  }
  set asyncValidator(asyncValidatorFn) {
    this._rawAsyncValidators = this._composedAsyncValidatorFn = asyncValidatorFn;
  }
  /**
   * The parent control.
   */
  get parent() {
    return this._parent;
  }
  /**
   * The validation status of the control.
   *
   * @see {@link FormControlStatus}
   *
   * These status values are mutually exclusive, so a control cannot be
   * both valid AND invalid or invalid AND disabled.
   */
  get status() {
    return untracked(this.statusReactive);
  }
  set status(v) {
    untracked(() => this.statusReactive.set(v));
  }
  /** @internal */
  _status = computed(() => this.statusReactive());
  statusReactive = signal(void 0);
  /**
   * A control is `valid` when its `status` is `VALID`.
   *
   * @see {@link AbstractControl.status}
   *
   * @returns True if the control has passed all of its validation tests,
   * false otherwise.
   */
  get valid() {
    return this.status === VALID;
  }
  /**
   * A control is `invalid` when its `status` is `INVALID`.
   *
   * @see {@link AbstractControl.status}
   *
   * @returns True if this control has failed one or more of its validation checks,
   * false otherwise.
   */
  get invalid() {
    return this.status === INVALID;
  }
  /**
   * A control is `pending` when its `status` is `PENDING`.
   *
   * @see {@link AbstractControl.status}
   *
   * @returns True if this control is in the process of conducting a validation check,
   * false otherwise.
   */
  get pending() {
    return this.status == PENDING;
  }
  /**
   * A control is `disabled` when its `status` is `DISABLED`.
   *
   * Disabled controls are exempt from validation checks and
   * are not included in the aggregate value of their ancestor
   * controls.
   *
   * @see {@link AbstractControl.status}
   *
   * @returns True if the control is disabled, false otherwise.
   */
  get disabled() {
    return this.status === DISABLED;
  }
  /**
   * A control is `enabled` as long as its `status` is not `DISABLED`.
   *
   * @returns True if the control has any status other than 'DISABLED',
   * false if the status is 'DISABLED'.
   *
   * @see {@link AbstractControl.status}
   *
   */
  get enabled() {
    return this.status !== DISABLED;
  }
  /**
   * An object containing any errors generated by failing validation,
   * or null if there are no errors.
   */
  errors;
  /**
   * A control is `pristine` if the user has not yet changed
   * the value in the UI.
   *
   * @returns True if the user has not yet changed the value in the UI; compare `dirty`.
   * Programmatic changes to a control's value do not mark it dirty.
   */
  get pristine() {
    return untracked(this.pristineReactive);
  }
  set pristine(v) {
    untracked(() => this.pristineReactive.set(v));
  }
  /** @internal */
  _pristine = computed(() => this.pristineReactive());
  pristineReactive = signal(true);
  /**
   * A control is `dirty` if the user has changed the value
   * in the UI.
   *
   * @returns True if the user has changed the value of this control in the UI; compare `pristine`.
   * Programmatic changes to a control's value do not mark it dirty.
   */
  get dirty() {
    return !this.pristine;
  }
  /**
   * True if the control is marked as `touched`.
   *
   * A control is marked `touched` once the user has triggered
   * a `blur` event on it.
   */
  get touched() {
    return untracked(this.touchedReactive);
  }
  set touched(v) {
    untracked(() => this.touchedReactive.set(v));
  }
  /** @internal */
  _touched = computed(() => this.touchedReactive());
  touchedReactive = signal(false);
  /**
   * True if the control has not been marked as touched
   *
   * A control is `untouched` if the user has not yet triggered
   * a `blur` event on it.
   */
  get untouched() {
    return !this.touched;
  }
  /**
   * Exposed as observable, see below.
   *
   * @internal
   */
  _events = new Subject();
  /**
   * A multicasting observable that emits an event every time the state of the control changes.
   * It emits for value, status, pristine or touched changes.
   *
   * **Note**: On value change, the emit happens right after a value of this control is updated. The
   * value of a parent control (for example if this FormControl is a part of a FormGroup) is updated
   * later, so accessing a value of a parent control (using the `value` property) from the callback
   * of this event might result in getting a value that has not been updated yet. Subscribe to the
   * `events` of the parent control instead.
   * For other event types, the events are emitted after the parent control has been updated.
   *
   */
  events = this._events.asObservable();
  /**
   * A multicasting observable that emits an event every time the value of the control changes, in
   * the UI or programmatically. It also emits an event each time you call enable() or disable()
   * without passing along {emitEvent: false} as a function argument.
   *
   * **Note**: the emit happens right after a value of this control is updated. The value of a
   * parent control (for example if this FormControl is a part of a FormGroup) is updated later, so
   * accessing a value of a parent control (using the `value` property) from the callback of this
   * event might result in getting a value that has not been updated yet. Subscribe to the
   * `valueChanges` event of the parent control instead.
   */
  valueChanges;
  /**
   * A multicasting observable that emits an event every time the validation `status` of the control
   * recalculates.
   *
   * @see {@link FormControlStatus}
   * @see {@link AbstractControl.status}
   */
  statusChanges;
  /**
   * Reports the update strategy of the `AbstractControl` (meaning
   * the event on which the control updates itself).
   * Possible values: `'change'` | `'blur'` | `'submit'`
   * Default value: `'change'`
   */
  get updateOn() {
    return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : "change";
  }
  /**
   * Sets the synchronous validators that are active on this control.  Calling
   * this overwrites any existing synchronous validators.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * If you want to add a new validator without affecting existing ones, consider
   * using `addValidators()` method instead.
   */
  setValidators(validators) {
    this._assignValidators(validators);
  }
  /**
   * Sets the asynchronous validators that are active on this control. Calling this
   * overwrites any existing asynchronous validators.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * If you want to add a new validator without affecting existing ones, consider
   * using `addAsyncValidators()` method instead.
   */
  setAsyncValidators(validators) {
    this._assignAsyncValidators(validators);
  }
  /**
   * Add a synchronous validator or validators to this control, without affecting other validators.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * Adding a validator that already exists will have no effect. If duplicate validator functions
   * are present in the `validators` array, only the first instance would be added to a form
   * control.
   *
   * @param validators The new validator function or functions to add to this control.
   */
  addValidators(validators) {
    this.setValidators(addValidators(validators, this._rawValidators));
  }
  /**
   * Add an asynchronous validator or validators to this control, without affecting other
   * validators.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * Adding a validator that already exists will have no effect.
   *
   * @param validators The new asynchronous validator function or functions to add to this control.
   */
  addAsyncValidators(validators) {
    this.setAsyncValidators(addValidators(validators, this._rawAsyncValidators));
  }
  /**
   * Remove a synchronous validator from this control, without affecting other validators.
   * Validators are compared by function reference; you must pass a reference to the exact same
   * validator function as the one that was originally set. If a provided validator is not found,
   * it is ignored.
   *
   * @usageNotes
   *
   * ### Reference to a ValidatorFn
   *
   * ```
   * // Reference to the RequiredValidator
   * const ctrl = new FormControl<string | null>('', Validators.required);
   * ctrl.removeValidators(Validators.required);
   *
   * // Reference to anonymous function inside MinValidator
   * const minValidator = Validators.min(3);
   * const ctrl = new FormControl<string | null>('', minValidator);
   * expect(ctrl.hasValidator(minValidator)).toEqual(true)
   * expect(ctrl.hasValidator(Validators.min(3))).toEqual(false)
   *
   * ctrl.removeValidators(minValidator);
   * ```
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * @param validators The validator or validators to remove.
   */
  removeValidators(validators) {
    this.setValidators(removeValidators(validators, this._rawValidators));
  }
  /**
   * Remove an asynchronous validator from this control, without affecting other validators.
   * Validators are compared by function reference; you must pass a reference to the exact same
   * validator function as the one that was originally set. If a provided validator is not found, it
   * is ignored.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   * @param validators The asynchronous validator or validators to remove.
   */
  removeAsyncValidators(validators) {
    this.setAsyncValidators(removeValidators(validators, this._rawAsyncValidators));
  }
  /**
   * Check whether a synchronous validator function is present on this control. The provided
   * validator must be a reference to the exact same function that was provided.
   *
   * @usageNotes
   *
   * ### Reference to a ValidatorFn
   *
   * ```
   * // Reference to the RequiredValidator
   * const ctrl = new FormControl<number | null>(0, Validators.required);
   * expect(ctrl.hasValidator(Validators.required)).toEqual(true)
   *
   * // Reference to anonymous function inside MinValidator
   * const minValidator = Validators.min(3);
   * const ctrl = new FormControl<number | null>(0, minValidator);
   * expect(ctrl.hasValidator(minValidator)).toEqual(true)
   * expect(ctrl.hasValidator(Validators.min(3))).toEqual(false)
   * ```
   *
   * @param validator The validator to check for presence. Compared by function reference.
   * @returns Whether the provided validator was found on this control.
   */
  hasValidator(validator) {
    return hasValidator(this._rawValidators, validator);
  }
  /**
   * Check whether an asynchronous validator function is present on this control. The provided
   * validator must be a reference to the exact same function that was provided.
   *
   * @param validator The asynchronous validator to check for presence. Compared by function
   *     reference.
   * @returns Whether the provided asynchronous validator was found on this control.
   */
  hasAsyncValidator(validator) {
    return hasValidator(this._rawAsyncValidators, validator);
  }
  /**
   * Empties out the synchronous validator list.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   */
  clearValidators() {
    this.validator = null;
  }
  /**
   * Empties out the async validator list.
   *
   * When you add or remove a validator at run time, you must call
   * `updateValueAndValidity()` for the new validation to take effect.
   *
   */
  clearAsyncValidators() {
    this.asyncValidator = null;
  }
  markAsTouched(opts = {}) {
    const changed = this.touched === false;
    this.touched = true;
    const sourceControl = opts.sourceControl ?? this;
    if (this._parent && !opts.onlySelf) {
      this._parent.markAsTouched(__spreadProps(__spreadValues({}, opts), {
        sourceControl
      }));
    }
    if (changed && opts.emitEvent !== false) {
      this._events.next(new TouchedChangeEvent(true, sourceControl));
    }
  }
  /**
   * Marks the control and all its descendant controls as `touched`.
   * @see {@link markAsTouched()}
   *
   * @param opts Configuration options that determine how the control propagates changes
   * and emits events after marking is applied.
   * * `emitEvent`: When true or not supplied (the default), the `events`
   * observable emits a `TouchedChangeEvent` with the `touched` property being `true`.
   * When false, no events are emitted.
   */
  markAllAsTouched(opts = {}) {
    this.markAsTouched({
      onlySelf: true,
      emitEvent: opts.emitEvent,
      sourceControl: this
    });
    this._forEachChild((control) => control.markAllAsTouched(opts));
  }
  markAsUntouched(opts = {}) {
    const changed = this.touched === true;
    this.touched = false;
    this._pendingTouched = false;
    const sourceControl = opts.sourceControl ?? this;
    this._forEachChild((control) => {
      control.markAsUntouched({
        onlySelf: true,
        emitEvent: opts.emitEvent,
        sourceControl
      });
    });
    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts, sourceControl);
    }
    if (changed && opts.emitEvent !== false) {
      this._events.next(new TouchedChangeEvent(false, sourceControl));
    }
  }
  markAsDirty(opts = {}) {
    const changed = this.pristine === true;
    this.pristine = false;
    const sourceControl = opts.sourceControl ?? this;
    if (this._parent && !opts.onlySelf) {
      this._parent.markAsDirty(__spreadProps(__spreadValues({}, opts), {
        sourceControl
      }));
    }
    if (changed && opts.emitEvent !== false) {
      this._events.next(new PristineChangeEvent(false, sourceControl));
    }
  }
  markAsPristine(opts = {}) {
    const changed = this.pristine === false;
    this.pristine = true;
    this._pendingDirty = false;
    const sourceControl = opts.sourceControl ?? this;
    this._forEachChild((control) => {
      control.markAsPristine({
        onlySelf: true,
        emitEvent: opts.emitEvent
      });
    });
    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts, sourceControl);
    }
    if (changed && opts.emitEvent !== false) {
      this._events.next(new PristineChangeEvent(true, sourceControl));
    }
  }
  markAsPending(opts = {}) {
    this.status = PENDING;
    const sourceControl = opts.sourceControl ?? this;
    if (opts.emitEvent !== false) {
      this._events.next(new StatusChangeEvent(this.status, sourceControl));
      this.statusChanges.emit(this.status);
    }
    if (this._parent && !opts.onlySelf) {
      this._parent.markAsPending(__spreadProps(__spreadValues({}, opts), {
        sourceControl
      }));
    }
  }
  disable(opts = {}) {
    const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
    this.status = DISABLED;
    this.errors = null;
    this._forEachChild((control) => {
      control.disable(__spreadProps(__spreadValues({}, opts), {
        onlySelf: true
      }));
    });
    this._updateValue();
    const sourceControl = opts.sourceControl ?? this;
    if (opts.emitEvent !== false) {
      this._events.next(new ValueChangeEvent(this.value, sourceControl));
      this._events.next(new StatusChangeEvent(this.status, sourceControl));
      this.valueChanges.emit(this.value);
      this.statusChanges.emit(this.status);
    }
    this._updateAncestors(__spreadProps(__spreadValues({}, opts), {
      skipPristineCheck
    }), this);
    this._onDisabledChange.forEach((changeFn) => changeFn(true));
  }
  /**
   * Enables the control. This means the control is included in validation checks and
   * the aggregate value of its parent. Its status recalculates based on its value and
   * its validators.
   *
   * By default, if the control has children, all children are enabled.
   *
   * @see {@link AbstractControl.status}
   *
   * @param opts Configure options that control how the control propagates changes and
   * emits events when marked as untouched
   * * `onlySelf`: When true, mark only this control. When false or not supplied,
   * marks all direct ancestors. Default is false.
   * * `emitEvent`: When true or not supplied (the default), the `statusChanges`,
   * `valueChanges` and `events`
   * observables emit events with the latest status and value when the control is enabled.
   * When false, no events are emitted.
   */
  enable(opts = {}) {
    const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
    this.status = VALID;
    this._forEachChild((control) => {
      control.enable(__spreadProps(__spreadValues({}, opts), {
        onlySelf: true
      }));
    });
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: opts.emitEvent
    });
    this._updateAncestors(__spreadProps(__spreadValues({}, opts), {
      skipPristineCheck
    }), this);
    this._onDisabledChange.forEach((changeFn) => changeFn(false));
  }
  _updateAncestors(opts, sourceControl) {
    if (this._parent && !opts.onlySelf) {
      this._parent.updateValueAndValidity(opts);
      if (!opts.skipPristineCheck) {
        this._parent._updatePristine({}, sourceControl);
      }
      this._parent._updateTouched({}, sourceControl);
    }
  }
  /**
   * Sets the parent of the control
   *
   * @param parent The new parent.
   */
  setParent(parent) {
    this._parent = parent;
  }
  /**
   * The raw value of this control. For most control implementations, the raw value will include
   * disabled children.
   */
  getRawValue() {
    return this.value;
  }
  updateValueAndValidity(opts = {}) {
    this._setInitialStatus();
    this._updateValue();
    if (this.enabled) {
      const shouldHaveEmitted = this._cancelExistingSubscription();
      this.errors = this._runValidator();
      this.status = this._calculateStatus();
      if (this.status === VALID || this.status === PENDING) {
        this._runAsyncValidator(shouldHaveEmitted, opts.emitEvent);
      }
    }
    const sourceControl = opts.sourceControl ?? this;
    if (opts.emitEvent !== false) {
      this._events.next(new ValueChangeEvent(this.value, sourceControl));
      this._events.next(new StatusChangeEvent(this.status, sourceControl));
      this.valueChanges.emit(this.value);
      this.statusChanges.emit(this.status);
    }
    if (this._parent && !opts.onlySelf) {
      this._parent.updateValueAndValidity(__spreadProps(__spreadValues({}, opts), {
        sourceControl
      }));
    }
  }
  /** @internal */
  _updateTreeValidity(opts = {
    emitEvent: true
  }) {
    this._forEachChild((ctrl) => ctrl._updateTreeValidity(opts));
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: opts.emitEvent
    });
  }
  _setInitialStatus() {
    this.status = this._allControlsDisabled() ? DISABLED : VALID;
  }
  _runValidator() {
    return this.validator ? this.validator(this) : null;
  }
  _runAsyncValidator(shouldHaveEmitted, emitEvent) {
    if (this.asyncValidator) {
      this.status = PENDING;
      this._hasOwnPendingAsyncValidator = {
        emitEvent: emitEvent !== false
      };
      const obs = toObservable(this.asyncValidator(this));
      this._asyncValidationSubscription = obs.subscribe((errors) => {
        this._hasOwnPendingAsyncValidator = null;
        this.setErrors(errors, {
          emitEvent,
          shouldHaveEmitted
        });
      });
    }
  }
  _cancelExistingSubscription() {
    if (this._asyncValidationSubscription) {
      this._asyncValidationSubscription.unsubscribe();
      const shouldHaveEmitted = this._hasOwnPendingAsyncValidator?.emitEvent ?? false;
      this._hasOwnPendingAsyncValidator = null;
      return shouldHaveEmitted;
    }
    return false;
  }
  setErrors(errors, opts = {}) {
    this.errors = errors;
    this._updateControlsErrors(opts.emitEvent !== false, this, opts.shouldHaveEmitted);
  }
  /**
   * Retrieves a child control given the control's name or path.
   *
   * @param path A dot-delimited string or array of string/number values that define the path to the
   * control. If a string is provided, passing it as a string literal will result in improved type
   * information. Likewise, if an array is provided, passing it `as const` will cause improved type
   * information to be available.
   *
   * @usageNotes
   * ### Retrieve a nested control
   *
   * For example, to get a `name` control nested within a `person` sub-group:
   *
   * * `this.form.get('person.name');`
   *
   * -OR-
   *
   * * `this.form.get(['person', 'name'] as const);` // `as const` gives improved typings
   *
   * ### Retrieve a control in a FormArray
   *
   * When accessing an element inside a FormArray, you can use an element index.
   * For example, to get a `price` control from the first element in an `items` array you can use:
   *
   * * `this.form.get('items.0.price');`
   *
   * -OR-
   *
   * * `this.form.get(['items', 0, 'price']);`
   */
  get(path) {
    let currPath = path;
    if (currPath == null) return null;
    if (!Array.isArray(currPath)) currPath = currPath.split(".");
    if (currPath.length === 0) return null;
    return currPath.reduce((control, name) => control && control._find(name), this);
  }
  /**
   * @description
   * Reports error data for the control with the given path.
   *
   * @param errorCode The code of the error to check
   * @param path A list of control names that designates how to move from the current control
   * to the control that should be queried for errors.
   *
   * @usageNotes
   * For example, for the following `FormGroup`:
   *
   * ```ts
   * form = new FormGroup({
   *   address: new FormGroup({ street: new FormControl() })
   * });
   * ```
   *
   * The path to the 'street' control from the root form would be 'address' -> 'street'.
   *
   * It can be provided to this method in one of two formats:
   *
   * 1. An array of string control names, e.g. `['address', 'street']`
   * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
   *
   * @returns error data for that particular error. If the control or error is not present,
   * null is returned.
   */
  getError(errorCode, path) {
    const control = path ? this.get(path) : this;
    return control && control.errors ? control.errors[errorCode] : null;
  }
  /**
   * @description
   * Reports whether the control with the given path has the error specified.
   *
   * @param errorCode The code of the error to check
   * @param path A list of control names that designates how to move from the current control
   * to the control that should be queried for errors.
   *
   * @usageNotes
   * For example, for the following `FormGroup`:
   *
   * ```ts
   * form = new FormGroup({
   *   address: new FormGroup({ street: new FormControl() })
   * });
   * ```
   *
   * The path to the 'street' control from the root form would be 'address' -> 'street'.
   *
   * It can be provided to this method in one of two formats:
   *
   * 1. An array of string control names, e.g. `['address', 'street']`
   * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
   *
   * If no path is given, this method checks for the error on the current control.
   *
   * @returns whether the given error is present in the control at the given path.
   *
   * If the control is not present, false is returned.
   */
  hasError(errorCode, path) {
    return !!this.getError(errorCode, path);
  }
  /**
   * Retrieves the top-level ancestor of this control.
   */
  get root() {
    let x = this;
    while (x._parent) {
      x = x._parent;
    }
    return x;
  }
  /** @internal */
  _updateControlsErrors(emitEvent, changedControl, shouldHaveEmitted) {
    this.status = this._calculateStatus();
    if (emitEvent) {
      this.statusChanges.emit(this.status);
    }
    if (emitEvent || shouldHaveEmitted) {
      this._events.next(new StatusChangeEvent(this.status, changedControl));
    }
    if (this._parent) {
      this._parent._updateControlsErrors(emitEvent, changedControl, shouldHaveEmitted);
    }
  }
  /** @internal */
  _initObservables() {
    this.valueChanges = new EventEmitter();
    this.statusChanges = new EventEmitter();
  }
  _calculateStatus() {
    if (this._allControlsDisabled()) return DISABLED;
    if (this.errors) return INVALID;
    if (this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(PENDING)) return PENDING;
    if (this._anyControlsHaveStatus(INVALID)) return INVALID;
    return VALID;
  }
  /** @internal */
  _anyControlsHaveStatus(status) {
    return this._anyControls((control) => control.status === status);
  }
  /** @internal */
  _anyControlsDirty() {
    return this._anyControls((control) => control.dirty);
  }
  /** @internal */
  _anyControlsTouched() {
    return this._anyControls((control) => control.touched);
  }
  /** @internal */
  _updatePristine(opts, changedControl) {
    const newPristine = !this._anyControlsDirty();
    const changed = this.pristine !== newPristine;
    this.pristine = newPristine;
    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts, changedControl);
    }
    if (changed) {
      this._events.next(new PristineChangeEvent(this.pristine, changedControl));
    }
  }
  /** @internal */
  _updateTouched(opts = {}, changedControl) {
    this.touched = this._anyControlsTouched();
    this._events.next(new TouchedChangeEvent(this.touched, changedControl));
    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts, changedControl);
    }
  }
  /** @internal */
  _onDisabledChange = [];
  /** @internal */
  _registerOnCollectionChange(fn) {
    this._onCollectionChange = fn;
  }
  /** @internal */
  _setUpdateStrategy(opts) {
    if (isOptionsObj(opts) && opts.updateOn != null) {
      this._updateOn = opts.updateOn;
    }
  }
  /**
   * Check to see if parent has been marked artificially dirty.
   *
   * @internal
   */
  _parentMarkedDirty(onlySelf) {
    const parentDirty = this._parent && this._parent.dirty;
    return !onlySelf && !!parentDirty && !this._parent._anyControlsDirty();
  }
  /** @internal */
  _find(name) {
    return null;
  }
  /**
   * Internal implementation of the `setValidators` method. Needs to be separated out into a
   * different method, because it is called in the constructor and it can break cases where
   * a control is extended.
   */
  _assignValidators(validators) {
    this._rawValidators = Array.isArray(validators) ? validators.slice() : validators;
    this._composedValidatorFn = coerceToValidator(this._rawValidators);
  }
  /**
   * Internal implementation of the `setAsyncValidators` method. Needs to be separated out into a
   * different method, because it is called in the constructor and it can break cases where
   * a control is extended.
   */
  _assignAsyncValidators(validators) {
    this._rawAsyncValidators = Array.isArray(validators) ? validators.slice() : validators;
    this._composedAsyncValidatorFn = coerceToAsyncValidator(this._rawAsyncValidators);
  }
};
var FormGroup = class extends AbstractControl {
  /**
   * Creates a new `FormGroup` instance.
   *
   * @param controls A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   */
  constructor(controls, validatorOrOpts, asyncValidator) {
    super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
    (typeof ngDevMode === "undefined" || ngDevMode) && validateFormGroupControls(controls);
    this.controls = controls;
    this._initObservables();
    this._setUpdateStrategy(validatorOrOpts);
    this._setUpControls();
    this.updateValueAndValidity({
      onlySelf: true,
      // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
      // `VALID` or `INVALID`. The status should be broadcasted via the `statusChanges` observable,
      // so we set `emitEvent` to `true` to allow that during the control creation process.
      emitEvent: !!this.asyncValidator
    });
  }
  controls;
  registerControl(name, control) {
    if (this.controls[name]) return this.controls[name];
    this.controls[name] = control;
    control.setParent(this);
    control._registerOnCollectionChange(this._onCollectionChange);
    return control;
  }
  addControl(name, control, options = {}) {
    this.registerControl(name, control);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  /**
   * Remove a control from this group. In a strongly-typed group, required controls cannot be
   * removed.
   *
   * This method also updates the value and validity of the control.
   *
   * @param name The control name to remove from the collection
   * @param options Specifies whether this FormGroup instance should emit events after a
   *     control is removed.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control is
   * removed. When false, no events are emitted.
   */
  removeControl(name, options = {}) {
    if (this.controls[name]) this.controls[name]._registerOnCollectionChange(() => {
    });
    delete this.controls[name];
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  setControl(name, control, options = {}) {
    if (this.controls[name]) this.controls[name]._registerOnCollectionChange(() => {
    });
    delete this.controls[name];
    if (control) this.registerControl(name, control);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  contains(controlName) {
    return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
  }
  /**
   * Sets the value of the `FormGroup`. It accepts an object that matches
   * the structure of the group, with control names as keys.
   *
   * @usageNotes
   * ### Set the complete value for the form group
   *
   * ```ts
   * const form = new FormGroup({
   *   first: new FormControl(),
   *   last: new FormControl()
   * });
   *
   * console.log(form.value);   // {first: null, last: null}
   *
   * form.setValue({first: 'Nancy', last: 'Drew'});
   * console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
   * ```
   *
   * @throws When strict checks fail, such as setting the value of a control
   * that doesn't exist or if you exclude a value of a control that does exist.
   *
   * @param value The new value for the control that matches the structure of the group.
   * @param options Configuration options that determine how the control propagates changes
   * and emits events after the value changes.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control value is updated.
   * When false, no events are emitted.
   */
  setValue(value, options = {}) {
    assertAllValuesPresent(this, true, value);
    Object.keys(value).forEach((name) => {
      assertControlPresent(this, true, name);
      this.controls[name].setValue(value[name], {
        onlySelf: true,
        emitEvent: options.emitEvent
      });
    });
    this.updateValueAndValidity(options);
  }
  /**
   * Patches the value of the `FormGroup`. It accepts an object with control
   * names as keys, and does its best to match the values to the correct controls
   * in the group.
   *
   * It accepts both super-sets and sub-sets of the group without throwing an error.
   *
   * @usageNotes
   * ### Patch the value for a form group
   *
   * ```ts
   * const form = new FormGroup({
   *    first: new FormControl(),
   *    last: new FormControl()
   * });
   * console.log(form.value);   // {first: null, last: null}
   *
   * form.patchValue({first: 'Nancy'});
   * console.log(form.value);   // {first: 'Nancy', last: null}
   * ```
   *
   * @param value The object that matches the structure of the group.
   * @param options Configuration options that determine how the control propagates changes and
   * emits events after the value is patched.
   * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
   * true.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control value
   * is updated. When false, no events are emitted. The configuration options are passed to
   * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   */
  patchValue(value, options = {}) {
    if (value == null) return;
    Object.keys(value).forEach((name) => {
      const control = this.controls[name];
      if (control) {
        control.patchValue(
          /* Guaranteed to be present, due to the outer forEach. */
          value[name],
          {
            onlySelf: true,
            emitEvent: options.emitEvent
          }
        );
      }
    });
    this.updateValueAndValidity(options);
  }
  /**
   * Resets the `FormGroup`, marks all descendants `pristine` and `untouched` and sets
   * the value of all descendants to their default values, or null if no defaults were provided.
   *
   * You reset to a specific form state by passing in a map of states
   * that matches the structure of your form, with control names as keys. The state
   * is a standalone value or a form state object with both a value and a disabled
   * status.
   *
   * @param value Resets the control with an initial value,
   * or an object that defines the initial value and disabled state.
   *
   * @param options Configuration options that determine how the control propagates changes
   * and emits events when the group is reset.
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   * false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control is reset.
   * When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * @usageNotes
   *
   * ### Reset the form group values
   *
   * ```ts
   * const form = new FormGroup({
   *   first: new FormControl('first name'),
   *   last: new FormControl('last name')
   * });
   *
   * console.log(form.value);  // {first: 'first name', last: 'last name'}
   *
   * form.reset({ first: 'name', last: 'last name' });
   *
   * console.log(form.value);  // {first: 'name', last: 'last name'}
   * ```
   *
   * ### Reset the form group values and disabled status
   *
   * ```ts
   * const form = new FormGroup({
   *   first: new FormControl('first name'),
   *   last: new FormControl('last name')
   * });
   *
   * form.reset({
   *   first: {value: 'name', disabled: true},
   *   last: 'last'
   * });
   *
   * console.log(form.value);  // {last: 'last'}
   * console.log(form.get('first').status);  // 'DISABLED'
   * ```
   */
  reset(value = {}, options = {}) {
    this._forEachChild((control, name) => {
      control.reset(value ? value[name] : null, {
        onlySelf: true,
        emitEvent: options.emitEvent
      });
    });
    this._updatePristine(options, this);
    this._updateTouched(options, this);
    this.updateValueAndValidity(options);
  }
  /**
   * The aggregate value of the `FormGroup`, including any disabled controls.
   *
   * Retrieves all values regardless of disabled status.
   */
  getRawValue() {
    return this._reduceChildren({}, (acc, control, name) => {
      acc[name] = control.getRawValue();
      return acc;
    });
  }
  /** @internal */
  _syncPendingControls() {
    let subtreeUpdated = this._reduceChildren(false, (updated, child) => {
      return child._syncPendingControls() ? true : updated;
    });
    if (subtreeUpdated) this.updateValueAndValidity({
      onlySelf: true
    });
    return subtreeUpdated;
  }
  /** @internal */
  _forEachChild(cb) {
    Object.keys(this.controls).forEach((key) => {
      const control = this.controls[key];
      control && cb(control, key);
    });
  }
  /** @internal */
  _setUpControls() {
    this._forEachChild((control) => {
      control.setParent(this);
      control._registerOnCollectionChange(this._onCollectionChange);
    });
  }
  /** @internal */
  _updateValue() {
    this.value = this._reduceValue();
  }
  /** @internal */
  _anyControls(condition) {
    for (const [controlName, control] of Object.entries(this.controls)) {
      if (this.contains(controlName) && condition(control)) {
        return true;
      }
    }
    return false;
  }
  /** @internal */
  _reduceValue() {
    let acc = {};
    return this._reduceChildren(acc, (acc2, control, name) => {
      if (control.enabled || this.disabled) {
        acc2[name] = control.value;
      }
      return acc2;
    });
  }
  /** @internal */
  _reduceChildren(initValue, fn) {
    let res = initValue;
    this._forEachChild((control, name) => {
      res = fn(res, control, name);
    });
    return res;
  }
  /** @internal */
  _allControlsDisabled() {
    for (const controlName of Object.keys(this.controls)) {
      if (this.controls[controlName].enabled) {
        return false;
      }
    }
    return Object.keys(this.controls).length > 0 || this.disabled;
  }
  /** @internal */
  _find(name) {
    return this.controls.hasOwnProperty(name) ? this.controls[name] : null;
  }
};
function validateFormGroupControls(controls) {
  const invalidKeys = Object.keys(controls).filter((key) => key.includes("."));
  if (invalidKeys.length > 0) {
    console.warn(`FormGroup keys cannot include \`.\`, please replace the keys for: ${invalidKeys.join(",")}.`);
  }
}
var FormRecord = class extends FormGroup {
};
var CALL_SET_DISABLED_STATE = new InjectionToken(typeof ngDevMode === "undefined" || ngDevMode ? "CallSetDisabledState" : "", {
  providedIn: "root",
  factory: () => setDisabledStateDefault
});
var setDisabledStateDefault = "always";
function controlPath(name, parent) {
  return [...parent.path, name];
}
function setUpControl(control, dir, callSetDisabledState = setDisabledStateDefault) {
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    if (!control) _throwError(dir, "Cannot find control with");
    if (!dir.valueAccessor) _throwMissingValueAccessorError(dir);
  }
  setUpValidators(control, dir);
  dir.valueAccessor.writeValue(control.value);
  if (control.disabled || callSetDisabledState === "always") {
    dir.valueAccessor.setDisabledState?.(control.disabled);
  }
  setUpViewChangePipeline(control, dir);
  setUpModelChangePipeline(control, dir);
  setUpBlurPipeline(control, dir);
  setUpDisabledChangeHandler(control, dir);
}
function cleanUpControl(control, dir, validateControlPresenceOnChange = true) {
  const noop = () => {
    if (validateControlPresenceOnChange && (typeof ngDevMode === "undefined" || ngDevMode)) {
      _noControlError(dir);
    }
  };
  if (dir.valueAccessor) {
    dir.valueAccessor.registerOnChange(noop);
    dir.valueAccessor.registerOnTouched(noop);
  }
  cleanUpValidators(control, dir);
  if (control) {
    dir._invokeOnDestroyCallbacks();
    control._registerOnCollectionChange(() => {
    });
  }
}
function registerOnValidatorChange(validators, onChange) {
  validators.forEach((validator) => {
    if (validator.registerOnValidatorChange) validator.registerOnValidatorChange(onChange);
  });
}
function setUpDisabledChangeHandler(control, dir) {
  if (dir.valueAccessor.setDisabledState) {
    const onDisabledChange = (isDisabled) => {
      dir.valueAccessor.setDisabledState(isDisabled);
    };
    control.registerOnDisabledChange(onDisabledChange);
    dir._registerOnDestroy(() => {
      control._unregisterOnDisabledChange(onDisabledChange);
    });
  }
}
function setUpValidators(control, dir) {
  const validators = getControlValidators(control);
  if (dir.validator !== null) {
    control.setValidators(mergeValidators(validators, dir.validator));
  } else if (typeof validators === "function") {
    control.setValidators([validators]);
  }
  const asyncValidators = getControlAsyncValidators(control);
  if (dir.asyncValidator !== null) {
    control.setAsyncValidators(mergeValidators(asyncValidators, dir.asyncValidator));
  } else if (typeof asyncValidators === "function") {
    control.setAsyncValidators([asyncValidators]);
  }
  const onValidatorChange = () => control.updateValueAndValidity();
  registerOnValidatorChange(dir._rawValidators, onValidatorChange);
  registerOnValidatorChange(dir._rawAsyncValidators, onValidatorChange);
}
function cleanUpValidators(control, dir) {
  let isControlUpdated = false;
  if (control !== null) {
    if (dir.validator !== null) {
      const validators = getControlValidators(control);
      if (Array.isArray(validators) && validators.length > 0) {
        const updatedValidators = validators.filter((validator) => validator !== dir.validator);
        if (updatedValidators.length !== validators.length) {
          isControlUpdated = true;
          control.setValidators(updatedValidators);
        }
      }
    }
    if (dir.asyncValidator !== null) {
      const asyncValidators = getControlAsyncValidators(control);
      if (Array.isArray(asyncValidators) && asyncValidators.length > 0) {
        const updatedAsyncValidators = asyncValidators.filter((asyncValidator) => asyncValidator !== dir.asyncValidator);
        if (updatedAsyncValidators.length !== asyncValidators.length) {
          isControlUpdated = true;
          control.setAsyncValidators(updatedAsyncValidators);
        }
      }
    }
  }
  const noop = () => {
  };
  registerOnValidatorChange(dir._rawValidators, noop);
  registerOnValidatorChange(dir._rawAsyncValidators, noop);
  return isControlUpdated;
}
function setUpViewChangePipeline(control, dir) {
  dir.valueAccessor.registerOnChange((newValue) => {
    control._pendingValue = newValue;
    control._pendingChange = true;
    control._pendingDirty = true;
    if (control.updateOn === "change") updateControl(control, dir);
  });
}
function setUpBlurPipeline(control, dir) {
  dir.valueAccessor.registerOnTouched(() => {
    control._pendingTouched = true;
    if (control.updateOn === "blur" && control._pendingChange) updateControl(control, dir);
    if (control.updateOn !== "submit") control.markAsTouched();
  });
}
function updateControl(control, dir) {
  if (control._pendingDirty) control.markAsDirty();
  control.setValue(control._pendingValue, {
    emitModelToViewChange: false
  });
  dir.viewToModelUpdate(control._pendingValue);
  control._pendingChange = false;
}
function setUpModelChangePipeline(control, dir) {
  const onChange = (newValue, emitModelEvent) => {
    dir.valueAccessor.writeValue(newValue);
    if (emitModelEvent) dir.viewToModelUpdate(newValue);
  };
  control.registerOnChange(onChange);
  dir._registerOnDestroy(() => {
    control._unregisterOnChange(onChange);
  });
}
function setUpFormContainer(control, dir) {
  if (control == null && (typeof ngDevMode === "undefined" || ngDevMode)) _throwError(dir, "Cannot find control with");
  setUpValidators(control, dir);
}
function cleanUpFormContainer(control, dir) {
  return cleanUpValidators(control, dir);
}
function _noControlError(dir) {
  return _throwError(dir, "There is no FormControl instance attached to form control element with");
}
function _throwError(dir, message) {
  const messageEnd = _describeControlLocation(dir);
  throw new Error(`${message} ${messageEnd}`);
}
function _describeControlLocation(dir) {
  const path = dir.path;
  if (path && path.length > 1) return `path: '${path.join(" -> ")}'`;
  if (path?.[0]) return `name: '${path}'`;
  return "unspecified name attribute";
}
function _throwMissingValueAccessorError(dir) {
  const loc = _describeControlLocation(dir);
  throw new RuntimeError(-1203, `No value accessor for form control ${loc}.`);
}
function _throwInvalidValueAccessorError(dir) {
  const loc = _describeControlLocation(dir);
  throw new RuntimeError(1200, `Value accessor was not provided as an array for form control with ${loc}. Check that the \`NG_VALUE_ACCESSOR\` token is configured as a \`multi: true\` provider.`);
}
function isPropertyUpdated(changes, viewModel) {
  if (!changes.hasOwnProperty("model")) return false;
  const change = changes["model"];
  if (change.isFirstChange()) return true;
  return !Object.is(viewModel, change.currentValue);
}
function isBuiltInAccessor(valueAccessor) {
  return Object.getPrototypeOf(valueAccessor.constructor) === BuiltInControlValueAccessor;
}
function syncPendingControls(form, directives) {
  form._syncPendingControls();
  directives.forEach((dir) => {
    const control = dir.control;
    if (control.updateOn === "submit" && control._pendingChange) {
      dir.viewToModelUpdate(control._pendingValue);
      control._pendingChange = false;
    }
  });
}
function selectValueAccessor(dir, valueAccessors) {
  if (!valueAccessors) return null;
  if (!Array.isArray(valueAccessors) && (typeof ngDevMode === "undefined" || ngDevMode)) _throwInvalidValueAccessorError(dir);
  let defaultAccessor = void 0;
  let builtinAccessor = void 0;
  let customAccessor = void 0;
  valueAccessors.forEach((v) => {
    if (v.constructor === DefaultValueAccessor) {
      defaultAccessor = v;
    } else if (isBuiltInAccessor(v)) {
      if (builtinAccessor && (typeof ngDevMode === "undefined" || ngDevMode)) _throwError(dir, "More than one built-in value accessor matches form control with");
      builtinAccessor = v;
    } else {
      if (customAccessor && (typeof ngDevMode === "undefined" || ngDevMode)) _throwError(dir, "More than one custom value accessor matches form control with");
      customAccessor = v;
    }
  });
  if (customAccessor) return customAccessor;
  if (builtinAccessor) return builtinAccessor;
  if (defaultAccessor) return defaultAccessor;
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    _throwError(dir, "No valid value accessor for form control with");
  }
  return null;
}
function removeListItem$1(list, el) {
  const index = list.indexOf(el);
  if (index > -1) list.splice(index, 1);
}
function _ngModelWarning(name, type, instance, warningConfig) {
  if (warningConfig === "never") return;
  if ((warningConfig === null || warningConfig === "once") && !type._ngModelWarningSentOnce || warningConfig === "always" && !instance._ngModelWarningSent) {
    console.warn(ngModelWarning(name));
    type._ngModelWarningSentOnce = true;
    instance._ngModelWarningSent = true;
  }
}
var formDirectiveProvider$1 = {
  provide: ControlContainer,
  useExisting: forwardRef(() => NgForm)
};
var resolvedPromise$1 = (() => Promise.resolve())();
var NgForm = class _NgForm extends ControlContainer {
  callSetDisabledState;
  /**
   * @description
   * Returns whether the form submission has been triggered.
   */
  get submitted() {
    return untracked(this.submittedReactive);
  }
  /** @internal */
  _submitted = computed(() => this.submittedReactive());
  submittedReactive = signal(false);
  _directives = /* @__PURE__ */ new Set();
  /**
   * @description
   * The `FormGroup` instance created for this form.
   */
  form;
  /**
   * @description
   * Event emitter for the "ngSubmit" event
   */
  ngSubmit = new EventEmitter();
  /**
   * @description
   * Tracks options for the `NgForm` instance.
   *
   * **updateOn**: Sets the default `updateOn` value for all child `NgModels` below it
   * unless explicitly set by a child `NgModel` using `ngModelOptions`). Defaults to 'change'.
   * Possible values: `'change'` | `'blur'` | `'submit'`.
   *
   */
  options;
  constructor(validators, asyncValidators, callSetDisabledState) {
    super();
    this.callSetDisabledState = callSetDisabledState;
    this.form = new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
  }
  /** @docs-private */
  ngAfterViewInit() {
    this._setUpdateStrategy();
  }
  /**
   * @description
   * The directive instance.
   */
  get formDirective() {
    return this;
  }
  /**
   * @description
   * The internal `FormGroup` instance.
   */
  get control() {
    return this.form;
  }
  /**
   * @description
   * Returns an array representing the path to this group. Because this directive
   * always lives at the top level of a form, it is always an empty array.
   */
  get path() {
    return [];
  }
  /**
   * @description
   * Returns a map of the controls in this group.
   */
  get controls() {
    return this.form.controls;
  }
  /**
   * @description
   * Method that sets up the control directive in this group, re-calculates its value
   * and validity, and adds the instance to the internal list of directives.
   *
   * @param dir The `NgModel` directive instance.
   */
  addControl(dir) {
    resolvedPromise$1.then(() => {
      const container = this._findContainer(dir.path);
      dir.control = container.registerControl(dir.name, dir.control);
      setUpControl(dir.control, dir, this.callSetDisabledState);
      dir.control.updateValueAndValidity({
        emitEvent: false
      });
      this._directives.add(dir);
    });
  }
  /**
   * @description
   * Retrieves the `FormControl` instance from the provided `NgModel` directive.
   *
   * @param dir The `NgModel` directive instance.
   */
  getControl(dir) {
    return this.form.get(dir.path);
  }
  /**
   * @description
   * Removes the `NgModel` instance from the internal list of directives
   *
   * @param dir The `NgModel` directive instance.
   */
  removeControl(dir) {
    resolvedPromise$1.then(() => {
      const container = this._findContainer(dir.path);
      if (container) {
        container.removeControl(dir.name);
      }
      this._directives.delete(dir);
    });
  }
  /**
   * @description
   * Adds a new `NgModelGroup` directive instance to the form.
   *
   * @param dir The `NgModelGroup` directive instance.
   */
  addFormGroup(dir) {
    resolvedPromise$1.then(() => {
      const container = this._findContainer(dir.path);
      const group = new FormGroup({});
      setUpFormContainer(group, dir);
      container.registerControl(dir.name, group);
      group.updateValueAndValidity({
        emitEvent: false
      });
    });
  }
  /**
   * @description
   * Removes the `NgModelGroup` directive instance from the form.
   *
   * @param dir The `NgModelGroup` directive instance.
   */
  removeFormGroup(dir) {
    resolvedPromise$1.then(() => {
      const container = this._findContainer(dir.path);
      if (container) {
        container.removeControl(dir.name);
      }
    });
  }
  /**
   * @description
   * Retrieves the `FormGroup` for a provided `NgModelGroup` directive instance
   *
   * @param dir The `NgModelGroup` directive instance.
   */
  getFormGroup(dir) {
    return this.form.get(dir.path);
  }
  /**
   * Sets the new value for the provided `NgControl` directive.
   *
   * @param dir The `NgControl` directive instance.
   * @param value The new value for the directive's control.
   */
  updateModel(dir, value) {
    resolvedPromise$1.then(() => {
      const ctrl = this.form.get(dir.path);
      ctrl.setValue(value);
    });
  }
  /**
   * @description
   * Sets the value for this `FormGroup`.
   *
   * @param value The new value
   */
  setValue(value) {
    this.control.setValue(value);
  }
  /**
   * @description
   * Method called when the "submit" event is triggered on the form.
   * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
   *
   * @param $event The "submit" event object
   */
  onSubmit($event) {
    this.submittedReactive.set(true);
    syncPendingControls(this.form, this._directives);
    this.ngSubmit.emit($event);
    this.form._events.next(new FormSubmittedEvent(this.control));
    return $event?.target?.method === "dialog";
  }
  /**
   * @description
   * Method called when the "reset" event is triggered on the form.
   */
  onReset() {
    this.resetForm();
  }
  /**
   * @description
   * Resets the form to an initial value and resets its submitted status.
   *
   * @param value The new value for the form.
   */
  resetForm(value = void 0) {
    this.form.reset(value);
    this.submittedReactive.set(false);
    this.form._events.next(new FormResetEvent(this.form));
  }
  _setUpdateStrategy() {
    if (this.options && this.options.updateOn != null) {
      this.form._updateOn = this.options.updateOn;
    }
  }
  _findContainer(path) {
    path.pop();
    return path.length ? this.form.get(path) : this.form;
  }
  static \u0275fac = function NgForm_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgForm)(\u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10), \u0275\u0275directiveInject(CALL_SET_DISABLED_STATE, 8));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NgForm,
    selectors: [["form", 3, "ngNoForm", "", 3, "formGroup", ""], ["ng-form"], ["", "ngForm", ""]],
    hostBindings: function NgForm_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("submit", function NgForm_submit_HostBindingHandler($event) {
          return ctx.onSubmit($event);
        })("reset", function NgForm_reset_HostBindingHandler() {
          return ctx.onReset();
        });
      }
    },
    inputs: {
      options: [0, "ngFormOptions", "options"]
    },
    outputs: {
      ngSubmit: "ngSubmit"
    },
    exportAs: ["ngForm"],
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([formDirectiveProvider$1]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgForm, [{
    type: Directive,
    args: [{
      selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]",
      providers: [formDirectiveProvider$1],
      host: {
        "(submit)": "onSubmit($event)",
        "(reset)": "onReset()"
      },
      outputs: ["ngSubmit"],
      exportAs: "ngForm",
      standalone: false
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }]
  }], {
    options: [{
      type: Input,
      args: ["ngFormOptions"]
    }]
  });
})();
function removeListItem(list, el) {
  const index = list.indexOf(el);
  if (index > -1) list.splice(index, 1);
}
function isFormControlState(formState) {
  return typeof formState === "object" && formState !== null && Object.keys(formState).length === 2 && "value" in formState && "disabled" in formState;
}
var FormControl = class FormControl2 extends AbstractControl {
  /** @publicApi */
  defaultValue = null;
  /** @internal */
  _onChange = [];
  /** @internal */
  _pendingValue;
  /** @internal */
  _pendingChange = false;
  constructor(formState = null, validatorOrOpts, asyncValidator) {
    super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
    this._applyFormState(formState);
    this._setUpdateStrategy(validatorOrOpts);
    this._initObservables();
    this.updateValueAndValidity({
      onlySelf: true,
      // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
      // `VALID` or `INVALID`.
      // The status should be broadcasted via the `statusChanges` observable, so we set
      // `emitEvent` to `true` to allow that during the control creation process.
      emitEvent: !!this.asyncValidator
    });
    if (isOptionsObj(validatorOrOpts) && (validatorOrOpts.nonNullable || validatorOrOpts.initialValueIsDefault)) {
      if (isFormControlState(formState)) {
        this.defaultValue = formState.value;
      } else {
        this.defaultValue = formState;
      }
    }
  }
  setValue(value, options = {}) {
    this.value = this._pendingValue = value;
    if (this._onChange.length && options.emitModelToViewChange !== false) {
      this._onChange.forEach((changeFn) => changeFn(this.value, options.emitViewToModelChange !== false));
    }
    this.updateValueAndValidity(options);
  }
  patchValue(value, options = {}) {
    this.setValue(value, options);
  }
  reset(formState = this.defaultValue, options = {}) {
    this._applyFormState(formState);
    this.markAsPristine(options);
    this.markAsUntouched(options);
    this.setValue(this.value, options);
    this._pendingChange = false;
  }
  /**  @internal */
  _updateValue() {
  }
  /**  @internal */
  _anyControls(condition) {
    return false;
  }
  /**  @internal */
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(fn) {
    this._onChange.push(fn);
  }
  /** @internal */
  _unregisterOnChange(fn) {
    removeListItem(this._onChange, fn);
  }
  registerOnDisabledChange(fn) {
    this._onDisabledChange.push(fn);
  }
  /** @internal */
  _unregisterOnDisabledChange(fn) {
    removeListItem(this._onDisabledChange, fn);
  }
  /** @internal */
  _forEachChild(cb) {
  }
  /** @internal */
  _syncPendingControls() {
    if (this.updateOn === "submit") {
      if (this._pendingDirty) this.markAsDirty();
      if (this._pendingTouched) this.markAsTouched();
      if (this._pendingChange) {
        this.setValue(this._pendingValue, {
          onlySelf: true,
          emitModelToViewChange: false
        });
        return true;
      }
    }
    return false;
  }
  _applyFormState(formState) {
    if (isFormControlState(formState)) {
      this.value = this._pendingValue = formState.value;
      formState.disabled ? this.disable({
        onlySelf: true,
        emitEvent: false
      }) : this.enable({
        onlySelf: true,
        emitEvent: false
      });
    } else {
      this.value = this._pendingValue = formState;
    }
  }
};
var isFormControl = (control) => control instanceof FormControl;
var AbstractFormGroupDirective = class _AbstractFormGroupDirective extends ControlContainer {
  /**
   * @description
   * The parent control for the group
   *
   * @internal
   */
  _parent;
  /** @docs-private */
  ngOnInit() {
    this._checkParentType();
    this.formDirective.addFormGroup(this);
  }
  /** @docs-private */
  ngOnDestroy() {
    if (this.formDirective) {
      this.formDirective.removeFormGroup(this);
    }
  }
  /**
   * @description
   * The `FormGroup` bound to this directive.
   */
  get control() {
    return this.formDirective.getFormGroup(this);
  }
  /**
   * @description
   * The path to this group from the top-level directive.
   */
  get path() {
    return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
  }
  /**
   * @description
   * The top-level directive for this group if present, otherwise null.
   */
  get formDirective() {
    return this._parent ? this._parent.formDirective : null;
  }
  /** @internal */
  _checkParentType() {
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275AbstractFormGroupDirective_BaseFactory;
    return function AbstractFormGroupDirective_Factory(__ngFactoryType__) {
      return (\u0275AbstractFormGroupDirective_BaseFactory || (\u0275AbstractFormGroupDirective_BaseFactory = \u0275\u0275getInheritedFactory(_AbstractFormGroupDirective)))(__ngFactoryType__ || _AbstractFormGroupDirective);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _AbstractFormGroupDirective,
    standalone: false,
    features: [\u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AbstractFormGroupDirective, [{
    type: Directive,
    args: [{
      standalone: false
    }]
  }], null, null);
})();
function modelParentException() {
  return new RuntimeError(1350, `
    ngModel cannot be used to register form controls with a parent formGroup directive.  Try using
    formGroup's partner directive "formControlName" instead.  Example:

    ${formControlNameExample}

    Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:

    Example:

    ${ngModelWithFormGroupExample}`);
}
function formGroupNameException() {
  return new RuntimeError(1351, `
    ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.

    Option 1: Use formControlName instead of ngModel (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):

    ${ngModelGroupExample}`);
}
function missingNameException() {
  return new RuntimeError(1352, `If ngModel is used within a form tag, either the name attribute must be set or the form
    control must be defined as 'standalone' in ngModelOptions.

    Example 1: <input [(ngModel)]="person.firstName" name="first">
    Example 2: <input [(ngModel)]="person.firstName" [ngModelOptions]="{standalone: true}">`);
}
function modelGroupParentException() {
  return new RuntimeError(1353, `
    ngModelGroup cannot be used with a parent formGroup directive.

    Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):

    ${ngModelGroupExample}`);
}
var modelGroupProvider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => NgModelGroup)
};
var NgModelGroup = class _NgModelGroup extends AbstractFormGroupDirective {
  /**
   * @description
   * Tracks the name of the `NgModelGroup` bound to the directive. The name corresponds
   * to a key in the parent `NgForm`.
   */
  name = "";
  constructor(parent, validators, asyncValidators) {
    super();
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
  }
  /** @internal */
  _checkParentType() {
    if (!(this._parent instanceof _NgModelGroup) && !(this._parent instanceof NgForm) && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw modelGroupParentException();
    }
  }
  static \u0275fac = function NgModelGroup_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgModelGroup)(\u0275\u0275directiveInject(ControlContainer, 5), \u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NgModelGroup,
    selectors: [["", "ngModelGroup", ""]],
    inputs: {
      name: [0, "ngModelGroup", "name"]
    },
    exportAs: ["ngModelGroup"],
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([modelGroupProvider]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgModelGroup, [{
    type: Directive,
    args: [{
      selector: "[ngModelGroup]",
      providers: [modelGroupProvider],
      exportAs: "ngModelGroup",
      standalone: false
    }]
  }], () => [{
    type: ControlContainer,
    decorators: [{
      type: Host
    }, {
      type: SkipSelf
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }], {
    name: [{
      type: Input,
      args: ["ngModelGroup"]
    }]
  });
})();
var formControlBinding$1 = {
  provide: NgControl,
  useExisting: forwardRef(() => NgModel)
};
var resolvedPromise = (() => Promise.resolve())();
var NgModel = class _NgModel extends NgControl {
  _changeDetectorRef;
  callSetDisabledState;
  control = new FormControl();
  // At runtime we coerce arbitrary values assigned to the "disabled" input to a "boolean".
  // This is not reflected in the type of the property because outside of templates, consumers
  // should only deal with booleans. In templates, a string is allowed for convenience and to
  // match the native "disabled attribute" semantics which can be observed on input elements.
  // This static member tells the compiler that values of type "string" can also be assigned
  // to the input in a template.
  /** @docs-private */
  static ngAcceptInputType_isDisabled;
  /** @internal */
  _registered = false;
  /**
   * Internal reference to the view model value.
   * @docs-private
   */
  viewModel;
  /**
   * @description
   * Tracks the name bound to the directive. If a parent form exists, it
   * uses this name as a key to retrieve this control's value.
   */
  name = "";
  /**
   * @description
   * Tracks whether the control is disabled.
   */
  isDisabled;
  /**
   * @description
   * Tracks the value bound to this directive.
   */
  model;
  /**
   * @description
   * Tracks the configuration options for this `ngModel` instance.
   *
   * **name**: An alternative to setting the name attribute on the form control element. See
   * the [example](api/forms/NgModel#using-ngmodel-on-a-standalone-control) for using `NgModel`
   * as a standalone control.
   *
   * **standalone**: When set to true, the `ngModel` will not register itself with its parent form,
   * and acts as if it's not in the form. Defaults to false. If no parent form exists, this option
   * has no effect.
   *
   * **updateOn**: Defines the event upon which the form control value and validity update.
   * Defaults to 'change'. Possible values: `'change'` | `'blur'` | `'submit'`.
   *
   */
  options;
  /**
   * @description
   * Event emitter for producing the `ngModelChange` event after
   * the view model updates.
   */
  update = new EventEmitter();
  constructor(parent, validators, asyncValidators, valueAccessors, _changeDetectorRef, callSetDisabledState) {
    super();
    this._changeDetectorRef = _changeDetectorRef;
    this.callSetDisabledState = callSetDisabledState;
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
    this.valueAccessor = selectValueAccessor(this, valueAccessors);
  }
  /** @docs-private */
  ngOnChanges(changes) {
    this._checkForErrors();
    if (!this._registered || "name" in changes) {
      if (this._registered) {
        this._checkName();
        if (this.formDirective) {
          const oldName = changes["name"].previousValue;
          this.formDirective.removeControl({
            name: oldName,
            path: this._getPath(oldName)
          });
        }
      }
      this._setUpControl();
    }
    if ("isDisabled" in changes) {
      this._updateDisabled(changes);
    }
    if (isPropertyUpdated(changes, this.viewModel)) {
      this._updateValue(this.model);
      this.viewModel = this.model;
    }
  }
  /** @docs-private */
  ngOnDestroy() {
    this.formDirective && this.formDirective.removeControl(this);
  }
  /**
   * @description
   * Returns an array that represents the path from the top-level form to this control.
   * Each index is the string name of the control on that level.
   */
  get path() {
    return this._getPath(this.name);
  }
  /**
   * @description
   * The top-level directive for this control if present, otherwise null.
   */
  get formDirective() {
    return this._parent ? this._parent.formDirective : null;
  }
  /**
   * @description
   * Sets the new value for the view model and emits an `ngModelChange` event.
   *
   * @param newValue The new value emitted by `ngModelChange`.
   */
  viewToModelUpdate(newValue) {
    this.viewModel = newValue;
    this.update.emit(newValue);
  }
  _setUpControl() {
    this._setUpdateStrategy();
    this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this);
    this._registered = true;
  }
  _setUpdateStrategy() {
    if (this.options && this.options.updateOn != null) {
      this.control._updateOn = this.options.updateOn;
    }
  }
  _isStandalone() {
    return !this._parent || !!(this.options && this.options.standalone);
  }
  _setUpStandalone() {
    setUpControl(this.control, this, this.callSetDisabledState);
    this.control.updateValueAndValidity({
      emitEvent: false
    });
  }
  _checkForErrors() {
    if ((typeof ngDevMode === "undefined" || ngDevMode) && !this._isStandalone()) {
      checkParentType$1(this._parent);
    }
    this._checkName();
  }
  _checkName() {
    if (this.options && this.options.name) this.name = this.options.name;
    if (!this._isStandalone() && !this.name && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw missingNameException();
    }
  }
  _updateValue(value) {
    resolvedPromise.then(() => {
      this.control.setValue(value, {
        emitViewToModelChange: false
      });
      this._changeDetectorRef?.markForCheck();
    });
  }
  _updateDisabled(changes) {
    const disabledValue = changes["isDisabled"].currentValue;
    const isDisabled = disabledValue !== 0 && booleanAttribute(disabledValue);
    resolvedPromise.then(() => {
      if (isDisabled && !this.control.disabled) {
        this.control.disable();
      } else if (!isDisabled && this.control.disabled) {
        this.control.enable();
      }
      this._changeDetectorRef?.markForCheck();
    });
  }
  _getPath(controlName) {
    return this._parent ? controlPath(controlName, this._parent) : [controlName];
  }
  static \u0275fac = function NgModel_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgModel)(\u0275\u0275directiveInject(ControlContainer, 9), \u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10), \u0275\u0275directiveInject(NG_VALUE_ACCESSOR, 10), \u0275\u0275directiveInject(ChangeDetectorRef, 8), \u0275\u0275directiveInject(CALL_SET_DISABLED_STATE, 8));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NgModel,
    selectors: [["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""]],
    inputs: {
      name: "name",
      isDisabled: [0, "disabled", "isDisabled"],
      model: [0, "ngModel", "model"],
      options: [0, "ngModelOptions", "options"]
    },
    outputs: {
      update: "ngModelChange"
    },
    exportAs: ["ngModel"],
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([formControlBinding$1]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgModel, [{
    type: Directive,
    args: [{
      selector: "[ngModel]:not([formControlName]):not([formControl])",
      providers: [formControlBinding$1],
      exportAs: "ngModel",
      standalone: false
    }]
  }], () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALUE_ACCESSOR]
    }]
  }, {
    type: ChangeDetectorRef,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [ChangeDetectorRef]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }]
  }], {
    name: [{
      type: Input
    }],
    isDisabled: [{
      type: Input,
      args: ["disabled"]
    }],
    model: [{
      type: Input,
      args: ["ngModel"]
    }],
    options: [{
      type: Input,
      args: ["ngModelOptions"]
    }],
    update: [{
      type: Output,
      args: ["ngModelChange"]
    }]
  });
})();
function checkParentType$1(parent) {
  if (!(parent instanceof NgModelGroup) && parent instanceof AbstractFormGroupDirective) {
    throw formGroupNameException();
  } else if (!(parent instanceof NgModelGroup) && !(parent instanceof NgForm)) {
    throw modelParentException();
  }
}
var \u0275NgNoValidate = class _\u0275NgNoValidate {
  static \u0275fac = function \u0275NgNoValidate_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _\u0275NgNoValidate)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _\u0275NgNoValidate,
    selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
    hostAttrs: ["novalidate", ""],
    standalone: false
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(\u0275NgNoValidate, [{
    type: Directive,
    args: [{
      selector: "form:not([ngNoForm]):not([ngNativeValidate])",
      host: {
        "novalidate": ""
      },
      standalone: false
    }]
  }], null, null);
})();
var NUMBER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberValueAccessor),
  multi: true
};
var NumberValueAccessor = class _NumberValueAccessor extends BuiltInControlValueAccessor {
  /**
   * Sets the "value" property on the input element.
   * @docs-private
   */
  writeValue(value) {
    const normalizedValue = value == null ? "" : value;
    this.setProperty("value", normalizedValue);
  }
  /**
   * Registers a function called when the control value changes.
   * @docs-private
   */
  registerOnChange(fn) {
    this.onChange = (value) => {
      fn(value == "" ? null : parseFloat(value));
    };
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275NumberValueAccessor_BaseFactory;
    return function NumberValueAccessor_Factory(__ngFactoryType__) {
      return (\u0275NumberValueAccessor_BaseFactory || (\u0275NumberValueAccessor_BaseFactory = \u0275\u0275getInheritedFactory(_NumberValueAccessor)))(__ngFactoryType__ || _NumberValueAccessor);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NumberValueAccessor,
    selectors: [["input", "type", "number", "formControlName", ""], ["input", "type", "number", "formControl", ""], ["input", "type", "number", "ngModel", ""]],
    hostBindings: function NumberValueAccessor_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("input", function NumberValueAccessor_input_HostBindingHandler($event) {
          return ctx.onChange($event.target.value);
        })("blur", function NumberValueAccessor_blur_HostBindingHandler() {
          return ctx.onTouched();
        });
      }
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([NUMBER_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NumberValueAccessor, [{
    type: Directive,
    args: [{
      selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]",
      host: {
        "(input)": "onChange($event.target.value)",
        "(blur)": "onTouched()"
      },
      providers: [NUMBER_VALUE_ACCESSOR],
      standalone: false
    }]
  }], null, null);
})();
var RADIO_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioControlValueAccessor),
  multi: true
};
function throwNameError() {
  throw new RuntimeError(1202, `
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <input type="radio" formControlName="food" name="food">
    `);
}
var RadioControlRegistry = class _RadioControlRegistry {
  _accessors = [];
  /**
   * @description
   * Adds a control to the internal registry. For internal use only.
   */
  add(control, accessor) {
    this._accessors.push([control, accessor]);
  }
  /**
   * @description
   * Removes a control from the internal registry. For internal use only.
   */
  remove(accessor) {
    for (let i = this._accessors.length - 1; i >= 0; --i) {
      if (this._accessors[i][1] === accessor) {
        this._accessors.splice(i, 1);
        return;
      }
    }
  }
  /**
   * @description
   * Selects a radio button. For internal use only.
   */
  select(accessor) {
    this._accessors.forEach((c) => {
      if (this._isSameGroup(c, accessor) && c[1] !== accessor) {
        c[1].fireUncheck(accessor.value);
      }
    });
  }
  _isSameGroup(controlPair, accessor) {
    if (!controlPair[0].control) return false;
    return controlPair[0]._parent === accessor._control._parent && controlPair[1].name === accessor.name;
  }
  static \u0275fac = function RadioControlRegistry_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RadioControlRegistry)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _RadioControlRegistry,
    factory: _RadioControlRegistry.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RadioControlRegistry, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var RadioControlValueAccessor = class _RadioControlValueAccessor extends BuiltInControlValueAccessor {
  _registry;
  _injector;
  /** @internal */
  _state;
  /** @internal */
  _control;
  /** @internal */
  _fn;
  setDisabledStateFired = false;
  /**
   * The registered callback function called when a change event occurs on the input element.
   * Note: we declare `onChange` here (also used as host listener) as a function with no arguments
   * to override the `onChange` function (which expects 1 argument) in the parent
   * `BaseControlValueAccessor` class.
   * @docs-private
   */
  onChange = () => {
  };
  /**
   * @description
   * Tracks the name of the radio input element.
   */
  name;
  /**
   * @description
   * Tracks the name of the `FormControl` bound to the directive. The name corresponds
   * to a key in the parent `FormGroup` or `FormArray`.
   */
  formControlName;
  /**
   * @description
   * Tracks the value of the radio input element
   */
  value;
  callSetDisabledState = inject(CALL_SET_DISABLED_STATE, {
    optional: true
  }) ?? setDisabledStateDefault;
  constructor(renderer, elementRef, _registry, _injector) {
    super(renderer, elementRef);
    this._registry = _registry;
    this._injector = _injector;
  }
  /** @docs-private */
  ngOnInit() {
    this._control = this._injector.get(NgControl);
    this._checkName();
    this._registry.add(this._control, this);
  }
  /** @docs-private */
  ngOnDestroy() {
    this._registry.remove(this);
  }
  /**
   * Sets the "checked" property value on the radio input element.
   * @docs-private
   */
  writeValue(value) {
    this._state = value === this.value;
    this.setProperty("checked", this._state);
  }
  /**
   * Registers a function called when the control value changes.
   * @docs-private
   */
  registerOnChange(fn) {
    this._fn = fn;
    this.onChange = () => {
      fn(this.value);
      this._registry.select(this);
    };
  }
  /** @docs-private */
  setDisabledState(isDisabled) {
    if (this.setDisabledStateFired || isDisabled || this.callSetDisabledState === "whenDisabledForLegacyCode") {
      this.setProperty("disabled", isDisabled);
    }
    this.setDisabledStateFired = true;
  }
  /**
   * Sets the "value" on the radio input element and unchecks it.
   *
   * @param value
   */
  fireUncheck(value) {
    this.writeValue(value);
  }
  _checkName() {
    if (this.name && this.formControlName && this.name !== this.formControlName && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throwNameError();
    }
    if (!this.name && this.formControlName) this.name = this.formControlName;
  }
  static \u0275fac = function RadioControlValueAccessor_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RadioControlValueAccessor)(\u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(RadioControlRegistry), \u0275\u0275directiveInject(Injector));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _RadioControlValueAccessor,
    selectors: [["input", "type", "radio", "formControlName", ""], ["input", "type", "radio", "formControl", ""], ["input", "type", "radio", "ngModel", ""]],
    hostBindings: function RadioControlValueAccessor_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("change", function RadioControlValueAccessor_change_HostBindingHandler() {
          return ctx.onChange();
        })("blur", function RadioControlValueAccessor_blur_HostBindingHandler() {
          return ctx.onTouched();
        });
      }
    },
    inputs: {
      name: "name",
      formControlName: "formControlName",
      value: "value"
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([RADIO_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RadioControlValueAccessor, [{
    type: Directive,
    args: [{
      selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]",
      host: {
        "(change)": "onChange()",
        "(blur)": "onTouched()"
      },
      providers: [RADIO_VALUE_ACCESSOR],
      standalone: false
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: RadioControlRegistry
  }, {
    type: Injector
  }], {
    name: [{
      type: Input
    }],
    formControlName: [{
      type: Input
    }],
    value: [{
      type: Input
    }]
  });
})();
var RANGE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RangeValueAccessor),
  multi: true
};
var RangeValueAccessor = class _RangeValueAccessor extends BuiltInControlValueAccessor {
  /**
   * Sets the "value" property on the input element.
   * @docs-private
   */
  writeValue(value) {
    this.setProperty("value", parseFloat(value));
  }
  /**
   * Registers a function called when the control value changes.
   * @docs-private
   */
  registerOnChange(fn) {
    this.onChange = (value) => {
      fn(value == "" ? null : parseFloat(value));
    };
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275RangeValueAccessor_BaseFactory;
    return function RangeValueAccessor_Factory(__ngFactoryType__) {
      return (\u0275RangeValueAccessor_BaseFactory || (\u0275RangeValueAccessor_BaseFactory = \u0275\u0275getInheritedFactory(_RangeValueAccessor)))(__ngFactoryType__ || _RangeValueAccessor);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _RangeValueAccessor,
    selectors: [["input", "type", "range", "formControlName", ""], ["input", "type", "range", "formControl", ""], ["input", "type", "range", "ngModel", ""]],
    hostBindings: function RangeValueAccessor_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("change", function RangeValueAccessor_change_HostBindingHandler($event) {
          return ctx.onChange($event.target.value);
        })("input", function RangeValueAccessor_input_HostBindingHandler($event) {
          return ctx.onChange($event.target.value);
        })("blur", function RangeValueAccessor_blur_HostBindingHandler() {
          return ctx.onTouched();
        });
      }
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([RANGE_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RangeValueAccessor, [{
    type: Directive,
    args: [{
      selector: "input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]",
      host: {
        "(change)": "onChange($event.target.value)",
        "(input)": "onChange($event.target.value)",
        "(blur)": "onTouched()"
      },
      providers: [RANGE_VALUE_ACCESSOR],
      standalone: false
    }]
  }], null, null);
})();
var NG_MODEL_WITH_FORM_CONTROL_WARNING = new InjectionToken(ngDevMode ? "NgModelWithFormControlWarning" : "");
var formControlBinding = {
  provide: NgControl,
  useExisting: forwardRef(() => FormControlDirective)
};
var FormControlDirective = class _FormControlDirective extends NgControl {
  _ngModelWarningConfig;
  callSetDisabledState;
  /**
   * Internal reference to the view model value.
   * @docs-private
   */
  viewModel;
  /**
   * @description
   * Tracks the `FormControl` instance bound to the directive.
   */
  form;
  /**
   * @description
   * Triggers a warning in dev mode that this input should not be used with reactive forms.
   */
  set isDisabled(isDisabled) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      console.warn(disabledAttrWarning);
    }
  }
  // TODO(kara): remove next 4 properties once deprecation period is over
  /** @deprecated as of v6 */
  model;
  /** @deprecated as of v6 */
  update = new EventEmitter();
  /**
   * @description
   * Static property used to track whether any ngModel warnings have been sent across
   * all instances of FormControlDirective. Used to support warning config of "once".
   *
   * @internal
   */
  static _ngModelWarningSentOnce = false;
  /**
   * @description
   * Instance property used to track whether an ngModel warning has been sent out for this
   * particular `FormControlDirective` instance. Used to support warning config of "always".
   *
   * @internal
   */
  _ngModelWarningSent = false;
  constructor(validators, asyncValidators, valueAccessors, _ngModelWarningConfig, callSetDisabledState) {
    super();
    this._ngModelWarningConfig = _ngModelWarningConfig;
    this.callSetDisabledState = callSetDisabledState;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
    this.valueAccessor = selectValueAccessor(this, valueAccessors);
  }
  /** @docs-private */
  ngOnChanges(changes) {
    if (this._isControlChanged(changes)) {
      const previousForm = changes["form"].previousValue;
      if (previousForm) {
        cleanUpControl(
          previousForm,
          this,
          /* validateControlPresenceOnChange */
          false
        );
      }
      setUpControl(this.form, this, this.callSetDisabledState);
      this.form.updateValueAndValidity({
        emitEvent: false
      });
    }
    if (isPropertyUpdated(changes, this.viewModel)) {
      if (typeof ngDevMode === "undefined" || ngDevMode) {
        _ngModelWarning("formControl", _FormControlDirective, this, this._ngModelWarningConfig);
      }
      this.form.setValue(this.model);
      this.viewModel = this.model;
    }
  }
  /** @docs-private */
  ngOnDestroy() {
    if (this.form) {
      cleanUpControl(
        this.form,
        this,
        /* validateControlPresenceOnChange */
        false
      );
    }
  }
  /**
   * @description
   * Returns an array that represents the path from the top-level form to this control.
   * Each index is the string name of the control on that level.
   */
  get path() {
    return [];
  }
  /**
   * @description
   * The `FormControl` bound to this directive.
   */
  get control() {
    return this.form;
  }
  /**
   * @description
   * Sets the new value for the view model and emits an `ngModelChange` event.
   *
   * @param newValue The new value for the view model.
   */
  viewToModelUpdate(newValue) {
    this.viewModel = newValue;
    this.update.emit(newValue);
  }
  _isControlChanged(changes) {
    return changes.hasOwnProperty("form");
  }
  static \u0275fac = function FormControlDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormControlDirective)(\u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10), \u0275\u0275directiveInject(NG_VALUE_ACCESSOR, 10), \u0275\u0275directiveInject(NG_MODEL_WITH_FORM_CONTROL_WARNING, 8), \u0275\u0275directiveInject(CALL_SET_DISABLED_STATE, 8));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _FormControlDirective,
    selectors: [["", "formControl", ""]],
    inputs: {
      form: [0, "formControl", "form"],
      isDisabled: [0, "disabled", "isDisabled"],
      model: [0, "ngModel", "model"]
    },
    outputs: {
      update: "ngModelChange"
    },
    exportAs: ["ngForm"],
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([formControlBinding]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormControlDirective, [{
    type: Directive,
    args: [{
      selector: "[formControl]",
      providers: [formControlBinding],
      exportAs: "ngForm",
      standalone: false
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALUE_ACCESSOR]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }]
  }], {
    form: [{
      type: Input,
      args: ["formControl"]
    }],
    isDisabled: [{
      type: Input,
      args: ["disabled"]
    }],
    model: [{
      type: Input,
      args: ["ngModel"]
    }],
    update: [{
      type: Output,
      args: ["ngModelChange"]
    }]
  });
})();
var formDirectiveProvider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormGroupDirective)
};
var FormGroupDirective = class _FormGroupDirective extends ControlContainer {
  callSetDisabledState;
  /**
   * @description
   * Reports whether the form submission has been triggered.
   */
  get submitted() {
    return untracked(this._submittedReactive);
  }
  // TODO(atscott): Remove once invalid API usage is cleaned up internally
  set submitted(value) {
    this._submittedReactive.set(value);
  }
  /** @internal */
  _submitted = computed(() => this._submittedReactive());
  _submittedReactive = signal(false);
  /**
   * Reference to an old form group input value, which is needed to cleanup
   * old instance in case it was replaced with a new one.
   */
  _oldForm;
  /**
   * Callback that should be invoked when controls in FormGroup or FormArray collection change
   * (added or removed). This callback triggers corresponding DOM updates.
   */
  _onCollectionChange = () => this._updateDomValue();
  /**
   * @description
   * Tracks the list of added `FormControlName` instances
   */
  directives = [];
  /**
   * @description
   * Tracks the `FormGroup` bound to this directive.
   */
  form = null;
  /**
   * @description
   * Emits an event when the form submission has been triggered.
   */
  ngSubmit = new EventEmitter();
  constructor(validators, asyncValidators, callSetDisabledState) {
    super();
    this.callSetDisabledState = callSetDisabledState;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
  }
  /** @docs-private */
  ngOnChanges(changes) {
    if ((typeof ngDevMode === "undefined" || ngDevMode) && !this.form) {
      throw missingFormException();
    }
    if (changes.hasOwnProperty("form")) {
      this._updateValidators();
      this._updateDomValue();
      this._updateRegistrations();
      this._oldForm = this.form;
    }
  }
  /** @docs-private */
  ngOnDestroy() {
    if (this.form) {
      cleanUpValidators(this.form, this);
      if (this.form._onCollectionChange === this._onCollectionChange) {
        this.form._registerOnCollectionChange(() => {
        });
      }
    }
  }
  /**
   * @description
   * Returns this directive's instance.
   */
  get formDirective() {
    return this;
  }
  /**
   * @description
   * Returns the `FormGroup` bound to this directive.
   */
  get control() {
    return this.form;
  }
  /**
   * @description
   * Returns an array representing the path to this group. Because this directive
   * always lives at the top level of a form, it always an empty array.
   */
  get path() {
    return [];
  }
  /**
   * @description
   * Method that sets up the control directive in this group, re-calculates its value
   * and validity, and adds the instance to the internal list of directives.
   *
   * @param dir The `FormControlName` directive instance.
   */
  addControl(dir) {
    const ctrl = this.form.get(dir.path);
    setUpControl(ctrl, dir, this.callSetDisabledState);
    ctrl.updateValueAndValidity({
      emitEvent: false
    });
    this.directives.push(dir);
    return ctrl;
  }
  /**
   * @description
   * Retrieves the `FormControl` instance from the provided `FormControlName` directive
   *
   * @param dir The `FormControlName` directive instance.
   */
  getControl(dir) {
    return this.form.get(dir.path);
  }
  /**
   * @description
   * Removes the `FormControlName` instance from the internal list of directives
   *
   * @param dir The `FormControlName` directive instance.
   */
  removeControl(dir) {
    cleanUpControl(
      dir.control || null,
      dir,
      /* validateControlPresenceOnChange */
      false
    );
    removeListItem$1(this.directives, dir);
  }
  /**
   * Adds a new `FormGroupName` directive instance to the form.
   *
   * @param dir The `FormGroupName` directive instance.
   */
  addFormGroup(dir) {
    this._setUpFormContainer(dir);
  }
  /**
   * Performs the necessary cleanup when a `FormGroupName` directive instance is removed from the
   * view.
   *
   * @param dir The `FormGroupName` directive instance.
   */
  removeFormGroup(dir) {
    this._cleanUpFormContainer(dir);
  }
  /**
   * @description
   * Retrieves the `FormGroup` for a provided `FormGroupName` directive instance
   *
   * @param dir The `FormGroupName` directive instance.
   */
  getFormGroup(dir) {
    return this.form.get(dir.path);
  }
  /**
   * Performs the necessary setup when a `FormArrayName` directive instance is added to the view.
   *
   * @param dir The `FormArrayName` directive instance.
   */
  addFormArray(dir) {
    this._setUpFormContainer(dir);
  }
  /**
   * Performs the necessary cleanup when a `FormArrayName` directive instance is removed from the
   * view.
   *
   * @param dir The `FormArrayName` directive instance.
   */
  removeFormArray(dir) {
    this._cleanUpFormContainer(dir);
  }
  /**
   * @description
   * Retrieves the `FormArray` for a provided `FormArrayName` directive instance.
   *
   * @param dir The `FormArrayName` directive instance.
   */
  getFormArray(dir) {
    return this.form.get(dir.path);
  }
  /**
   * Sets the new value for the provided `FormControlName` directive.
   *
   * @param dir The `FormControlName` directive instance.
   * @param value The new value for the directive's control.
   */
  updateModel(dir, value) {
    const ctrl = this.form.get(dir.path);
    ctrl.setValue(value);
  }
  /**
   * @description
   * Method called with the "submit" event is triggered on the form.
   * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
   *
   * @param $event The "submit" event object
   */
  onSubmit($event) {
    this._submittedReactive.set(true);
    syncPendingControls(this.form, this.directives);
    this.ngSubmit.emit($event);
    this.form._events.next(new FormSubmittedEvent(this.control));
    return $event?.target?.method === "dialog";
  }
  /**
   * @description
   * Method called when the "reset" event is triggered on the form.
   */
  onReset() {
    this.resetForm();
  }
  /**
   * @description
   * Resets the form to an initial value and resets its submitted status.
   *
   * @param value The new value for the form.
   */
  resetForm(value = void 0) {
    this.form.reset(value);
    this._submittedReactive.set(false);
    this.form._events.next(new FormResetEvent(this.form));
  }
  /** @internal */
  _updateDomValue() {
    this.directives.forEach((dir) => {
      const oldCtrl = dir.control;
      const newCtrl = this.form.get(dir.path);
      if (oldCtrl !== newCtrl) {
        cleanUpControl(oldCtrl || null, dir);
        if (isFormControl(newCtrl)) {
          setUpControl(newCtrl, dir, this.callSetDisabledState);
          dir.control = newCtrl;
        }
      }
    });
    this.form._updateTreeValidity({
      emitEvent: false
    });
  }
  _setUpFormContainer(dir) {
    const ctrl = this.form.get(dir.path);
    setUpFormContainer(ctrl, dir);
    ctrl.updateValueAndValidity({
      emitEvent: false
    });
  }
  _cleanUpFormContainer(dir) {
    if (this.form) {
      const ctrl = this.form.get(dir.path);
      if (ctrl) {
        const isControlUpdated = cleanUpFormContainer(ctrl, dir);
        if (isControlUpdated) {
          ctrl.updateValueAndValidity({
            emitEvent: false
          });
        }
      }
    }
  }
  _updateRegistrations() {
    this.form._registerOnCollectionChange(this._onCollectionChange);
    if (this._oldForm) {
      this._oldForm._registerOnCollectionChange(() => {
      });
    }
  }
  _updateValidators() {
    setUpValidators(this.form, this);
    if (this._oldForm) {
      cleanUpValidators(this._oldForm, this);
    }
  }
  static \u0275fac = function FormGroupDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormGroupDirective)(\u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10), \u0275\u0275directiveInject(CALL_SET_DISABLED_STATE, 8));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _FormGroupDirective,
    selectors: [["", "formGroup", ""]],
    hostBindings: function FormGroupDirective_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("submit", function FormGroupDirective_submit_HostBindingHandler($event) {
          return ctx.onSubmit($event);
        })("reset", function FormGroupDirective_reset_HostBindingHandler() {
          return ctx.onReset();
        });
      }
    },
    inputs: {
      form: [0, "formGroup", "form"]
    },
    outputs: {
      ngSubmit: "ngSubmit"
    },
    exportAs: ["ngForm"],
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([formDirectiveProvider]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormGroupDirective, [{
    type: Directive,
    args: [{
      selector: "[formGroup]",
      providers: [formDirectiveProvider],
      host: {
        "(submit)": "onSubmit($event)",
        "(reset)": "onReset()"
      },
      exportAs: "ngForm",
      standalone: false
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }]
  }], {
    form: [{
      type: Input,
      args: ["formGroup"]
    }],
    ngSubmit: [{
      type: Output
    }]
  });
})();
var formGroupNameProvider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormGroupName)
};
var FormGroupName = class _FormGroupName extends AbstractFormGroupDirective {
  /**
   * @description
   * Tracks the name of the `FormGroup` bound to the directive. The name corresponds
   * to a key in the parent `FormGroup` or `FormArray`.
   * Accepts a name as a string or a number.
   * The name in the form of a string is useful for individual forms,
   * while the numerical form allows for form groups to be bound
   * to indices when iterating over groups in a `FormArray`.
   */
  name = null;
  constructor(parent, validators, asyncValidators) {
    super();
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
  }
  /** @internal */
  _checkParentType() {
    if (hasInvalidParent(this._parent) && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw groupParentException();
    }
  }
  static \u0275fac = function FormGroupName_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormGroupName)(\u0275\u0275directiveInject(ControlContainer, 13), \u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _FormGroupName,
    selectors: [["", "formGroupName", ""]],
    inputs: {
      name: [0, "formGroupName", "name"]
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([formGroupNameProvider]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormGroupName, [{
    type: Directive,
    args: [{
      selector: "[formGroupName]",
      providers: [formGroupNameProvider],
      standalone: false
    }]
  }], () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }, {
      type: SkipSelf
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }], {
    name: [{
      type: Input,
      args: ["formGroupName"]
    }]
  });
})();
var formArrayNameProvider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormArrayName)
};
var FormArrayName = class _FormArrayName extends ControlContainer {
  /** @internal */
  _parent;
  /**
   * @description
   * Tracks the name of the `FormArray` bound to the directive. The name corresponds
   * to a key in the parent `FormGroup` or `FormArray`.
   * Accepts a name as a string or a number.
   * The name in the form of a string is useful for individual forms,
   * while the numerical form allows for form arrays to be bound
   * to indices when iterating over arrays in a `FormArray`.
   */
  name = null;
  constructor(parent, validators, asyncValidators) {
    super();
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
  }
  /**
   * A lifecycle method called when the directive's inputs are initialized. For internal use only.
   * @throws If the directive does not have a valid parent.
   * @docs-private
   */
  ngOnInit() {
    if (hasInvalidParent(this._parent) && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw arrayParentException();
    }
    this.formDirective.addFormArray(this);
  }
  /**
   * A lifecycle method called before the directive's instance is destroyed. For internal use only.
   * @docs-private
   */
  ngOnDestroy() {
    this.formDirective?.removeFormArray(this);
  }
  /**
   * @description
   * The `FormArray` bound to this directive.
   */
  get control() {
    return this.formDirective.getFormArray(this);
  }
  /**
   * @description
   * The top-level directive for this group if present, otherwise null.
   */
  get formDirective() {
    return this._parent ? this._parent.formDirective : null;
  }
  /**
   * @description
   * Returns an array that represents the path from the top-level form to this control.
   * Each index is the string name of the control on that level.
   */
  get path() {
    return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
  }
  static \u0275fac = function FormArrayName_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormArrayName)(\u0275\u0275directiveInject(ControlContainer, 13), \u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _FormArrayName,
    selectors: [["", "formArrayName", ""]],
    inputs: {
      name: [0, "formArrayName", "name"]
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([formArrayNameProvider]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormArrayName, [{
    type: Directive,
    args: [{
      selector: "[formArrayName]",
      providers: [formArrayNameProvider],
      standalone: false
    }]
  }], () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }, {
      type: SkipSelf
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }], {
    name: [{
      type: Input,
      args: ["formArrayName"]
    }]
  });
})();
function hasInvalidParent(parent) {
  return !(parent instanceof FormGroupName) && !(parent instanceof FormGroupDirective) && !(parent instanceof FormArrayName);
}
var controlNameBinding = {
  provide: NgControl,
  useExisting: forwardRef(() => FormControlName)
};
var FormControlName = class _FormControlName extends NgControl {
  _ngModelWarningConfig;
  _added = false;
  /**
   * Internal reference to the view model value.
   * @internal
   */
  viewModel;
  /**
   * @description
   * Tracks the `FormControl` instance bound to the directive.
   */
  control;
  /**
   * @description
   * Tracks the name of the `FormControl` bound to the directive. The name corresponds
   * to a key in the parent `FormGroup` or `FormArray`.
   * Accepts a name as a string or a number.
   * The name in the form of a string is useful for individual forms,
   * while the numerical form allows for form controls to be bound
   * to indices when iterating over controls in a `FormArray`.
   */
  name = null;
  /**
   * @description
   * Triggers a warning in dev mode that this input should not be used with reactive forms.
   */
  set isDisabled(isDisabled) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      console.warn(disabledAttrWarning);
    }
  }
  // TODO(kara): remove next 4 properties once deprecation period is over
  /** @deprecated as of v6 */
  model;
  /** @deprecated as of v6 */
  update = new EventEmitter();
  /**
   * @description
   * Static property used to track whether any ngModel warnings have been sent across
   * all instances of FormControlName. Used to support warning config of "once".
   *
   * @internal
   */
  static _ngModelWarningSentOnce = false;
  /**
   * @description
   * Instance property used to track whether an ngModel warning has been sent out for this
   * particular FormControlName instance. Used to support warning config of "always".
   *
   * @internal
   */
  _ngModelWarningSent = false;
  constructor(parent, validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
    super();
    this._ngModelWarningConfig = _ngModelWarningConfig;
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
    this.valueAccessor = selectValueAccessor(this, valueAccessors);
  }
  /** @docs-private */
  ngOnChanges(changes) {
    if (!this._added) this._setUpControl();
    if (isPropertyUpdated(changes, this.viewModel)) {
      if (typeof ngDevMode === "undefined" || ngDevMode) {
        _ngModelWarning("formControlName", _FormControlName, this, this._ngModelWarningConfig);
      }
      this.viewModel = this.model;
      this.formDirective.updateModel(this, this.model);
    }
  }
  /** @docs-private */
  ngOnDestroy() {
    if (this.formDirective) {
      this.formDirective.removeControl(this);
    }
  }
  /**
   * @description
   * Sets the new value for the view model and emits an `ngModelChange` event.
   *
   * @param newValue The new value for the view model.
   */
  viewToModelUpdate(newValue) {
    this.viewModel = newValue;
    this.update.emit(newValue);
  }
  /**
   * @description
   * Returns an array that represents the path from the top-level form to this control.
   * Each index is the string name of the control on that level.
   */
  get path() {
    return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
  }
  /**
   * @description
   * The top-level directive for this group if present, otherwise null.
   */
  get formDirective() {
    return this._parent ? this._parent.formDirective : null;
  }
  _setUpControl() {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      checkParentType(this._parent, this.name);
    }
    this.control = this.formDirective.addControl(this);
    this._added = true;
  }
  static \u0275fac = function FormControlName_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormControlName)(\u0275\u0275directiveInject(ControlContainer, 13), \u0275\u0275directiveInject(NG_VALIDATORS, 10), \u0275\u0275directiveInject(NG_ASYNC_VALIDATORS, 10), \u0275\u0275directiveInject(NG_VALUE_ACCESSOR, 10), \u0275\u0275directiveInject(NG_MODEL_WITH_FORM_CONTROL_WARNING, 8));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _FormControlName,
    selectors: [["", "formControlName", ""]],
    inputs: {
      name: [0, "formControlName", "name"],
      isDisabled: [0, "disabled", "isDisabled"],
      model: [0, "ngModel", "model"]
    },
    outputs: {
      update: "ngModelChange"
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([controlNameBinding]), \u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormControlName, [{
    type: Directive,
    args: [{
      selector: "[formControlName]",
      providers: [controlNameBinding],
      standalone: false
    }]
  }], () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }, {
      type: SkipSelf
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALUE_ACCESSOR]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
    }]
  }], {
    name: [{
      type: Input,
      args: ["formControlName"]
    }],
    isDisabled: [{
      type: Input,
      args: ["disabled"]
    }],
    model: [{
      type: Input,
      args: ["ngModel"]
    }],
    update: [{
      type: Output,
      args: ["ngModelChange"]
    }]
  });
})();
function checkParentType(parent, name) {
  if (!(parent instanceof FormGroupName) && parent instanceof AbstractFormGroupDirective) {
    throw ngModelGroupException();
  } else if (!(parent instanceof FormGroupName) && !(parent instanceof FormGroupDirective) && !(parent instanceof FormArrayName)) {
    throw controlParentException(name);
  }
}
var SELECT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectControlValueAccessor),
  multi: true
};
function _buildValueString$1(id, value) {
  if (id == null) return `${value}`;
  if (value && typeof value === "object") value = "Object";
  return `${id}: ${value}`.slice(0, 50);
}
function _extractId$1(valueString) {
  return valueString.split(":")[0];
}
var SelectControlValueAccessor = class _SelectControlValueAccessor extends BuiltInControlValueAccessor {
  /** @docs-private */
  value;
  /** @internal */
  _optionMap = /* @__PURE__ */ new Map();
  /** @internal */
  _idCounter = 0;
  /**
   * @description
   * Tracks the option comparison algorithm for tracking identities when
   * checking for changes.
   */
  set compareWith(fn) {
    if (typeof fn !== "function" && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw new RuntimeError(1201, `compareWith must be a function, but received ${JSON.stringify(fn)}`);
    }
    this._compareWith = fn;
  }
  _compareWith = Object.is;
  /**
   * Sets the "value" property on the select element.
   * @docs-private
   */
  writeValue(value) {
    this.value = value;
    const id = this._getOptionId(value);
    const valueString = _buildValueString$1(id, value);
    this.setProperty("value", valueString);
  }
  /**
   * Registers a function called when the control value changes.
   * @docs-private
   */
  registerOnChange(fn) {
    this.onChange = (valueString) => {
      this.value = this._getOptionValue(valueString);
      fn(this.value);
    };
  }
  /** @internal */
  _registerOption() {
    return (this._idCounter++).toString();
  }
  /** @internal */
  _getOptionId(value) {
    for (const id of this._optionMap.keys()) {
      if (this._compareWith(this._optionMap.get(id), value)) return id;
    }
    return null;
  }
  /** @internal */
  _getOptionValue(valueString) {
    const id = _extractId$1(valueString);
    return this._optionMap.has(id) ? this._optionMap.get(id) : valueString;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275SelectControlValueAccessor_BaseFactory;
    return function SelectControlValueAccessor_Factory(__ngFactoryType__) {
      return (\u0275SelectControlValueAccessor_BaseFactory || (\u0275SelectControlValueAccessor_BaseFactory = \u0275\u0275getInheritedFactory(_SelectControlValueAccessor)))(__ngFactoryType__ || _SelectControlValueAccessor);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _SelectControlValueAccessor,
    selectors: [["select", "formControlName", "", 3, "multiple", ""], ["select", "formControl", "", 3, "multiple", ""], ["select", "ngModel", "", 3, "multiple", ""]],
    hostBindings: function SelectControlValueAccessor_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("change", function SelectControlValueAccessor_change_HostBindingHandler($event) {
          return ctx.onChange($event.target.value);
        })("blur", function SelectControlValueAccessor_blur_HostBindingHandler() {
          return ctx.onTouched();
        });
      }
    },
    inputs: {
      compareWith: "compareWith"
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([SELECT_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectControlValueAccessor, [{
    type: Directive,
    args: [{
      selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]",
      host: {
        "(change)": "onChange($event.target.value)",
        "(blur)": "onTouched()"
      },
      providers: [SELECT_VALUE_ACCESSOR],
      standalone: false
    }]
  }], null, {
    compareWith: [{
      type: Input
    }]
  });
})();
var NgSelectOption = class _NgSelectOption {
  _element;
  _renderer;
  _select;
  /**
   * @description
   * ID of the option element
   */
  id;
  constructor(_element, _renderer, _select) {
    this._element = _element;
    this._renderer = _renderer;
    this._select = _select;
    if (this._select) this.id = this._select._registerOption();
  }
  /**
   * @description
   * Tracks the value bound to the option element. Unlike the value binding,
   * ngValue supports binding to objects.
   */
  set ngValue(value) {
    if (this._select == null) return;
    this._select._optionMap.set(this.id, value);
    this._setElementValue(_buildValueString$1(this.id, value));
    this._select.writeValue(this._select.value);
  }
  /**
   * @description
   * Tracks simple string values bound to the option element.
   * For objects, use the `ngValue` input binding.
   */
  set value(value) {
    this._setElementValue(value);
    if (this._select) this._select.writeValue(this._select.value);
  }
  /** @internal */
  _setElementValue(value) {
    this._renderer.setProperty(this._element.nativeElement, "value", value);
  }
  /** @docs-private */
  ngOnDestroy() {
    if (this._select) {
      this._select._optionMap.delete(this.id);
      this._select.writeValue(this._select.value);
    }
  }
  static \u0275fac = function NgSelectOption_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgSelectOption)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(SelectControlValueAccessor, 9));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NgSelectOption,
    selectors: [["option"]],
    inputs: {
      ngValue: "ngValue",
      value: "value"
    },
    standalone: false
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgSelectOption, [{
    type: Directive,
    args: [{
      selector: "option",
      standalone: false
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }, {
    type: SelectControlValueAccessor,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }]
  }], {
    ngValue: [{
      type: Input,
      args: ["ngValue"]
    }],
    value: [{
      type: Input,
      args: ["value"]
    }]
  });
})();
var SELECT_MULTIPLE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectMultipleControlValueAccessor),
  multi: true
};
function _buildValueString(id, value) {
  if (id == null) return `${value}`;
  if (typeof value === "string") value = `'${value}'`;
  if (value && typeof value === "object") value = "Object";
  return `${id}: ${value}`.slice(0, 50);
}
function _extractId(valueString) {
  return valueString.split(":")[0];
}
var SelectMultipleControlValueAccessor = class _SelectMultipleControlValueAccessor extends BuiltInControlValueAccessor {
  /**
   * The current value.
   * @docs-private
   */
  value;
  /** @internal */
  _optionMap = /* @__PURE__ */ new Map();
  /** @internal */
  _idCounter = 0;
  /**
   * @description
   * Tracks the option comparison algorithm for tracking identities when
   * checking for changes.
   */
  set compareWith(fn) {
    if (typeof fn !== "function" && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw new RuntimeError(1201, `compareWith must be a function, but received ${JSON.stringify(fn)}`);
    }
    this._compareWith = fn;
  }
  _compareWith = Object.is;
  /**
   * Sets the "value" property on one or of more of the select's options.
   * @docs-private
   */
  writeValue(value) {
    this.value = value;
    let optionSelectedStateSetter;
    if (Array.isArray(value)) {
      const ids = value.map((v) => this._getOptionId(v));
      optionSelectedStateSetter = (opt, o) => {
        opt._setSelected(ids.indexOf(o.toString()) > -1);
      };
    } else {
      optionSelectedStateSetter = (opt, o) => {
        opt._setSelected(false);
      };
    }
    this._optionMap.forEach(optionSelectedStateSetter);
  }
  /**
   * Registers a function called when the control value changes
   * and writes an array of the selected options.
   * @docs-private
   */
  registerOnChange(fn) {
    this.onChange = (element) => {
      const selected = [];
      const selectedOptions = element.selectedOptions;
      if (selectedOptions !== void 0) {
        const options = selectedOptions;
        for (let i = 0; i < options.length; i++) {
          const opt = options[i];
          const val = this._getOptionValue(opt.value);
          selected.push(val);
        }
      } else {
        const options = element.options;
        for (let i = 0; i < options.length; i++) {
          const opt = options[i];
          if (opt.selected) {
            const val = this._getOptionValue(opt.value);
            selected.push(val);
          }
        }
      }
      this.value = selected;
      fn(selected);
    };
  }
  /** @internal */
  _registerOption(value) {
    const id = (this._idCounter++).toString();
    this._optionMap.set(id, value);
    return id;
  }
  /** @internal */
  _getOptionId(value) {
    for (const id of this._optionMap.keys()) {
      if (this._compareWith(this._optionMap.get(id)._value, value)) return id;
    }
    return null;
  }
  /** @internal */
  _getOptionValue(valueString) {
    const id = _extractId(valueString);
    return this._optionMap.has(id) ? this._optionMap.get(id)._value : valueString;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275SelectMultipleControlValueAccessor_BaseFactory;
    return function SelectMultipleControlValueAccessor_Factory(__ngFactoryType__) {
      return (\u0275SelectMultipleControlValueAccessor_BaseFactory || (\u0275SelectMultipleControlValueAccessor_BaseFactory = \u0275\u0275getInheritedFactory(_SelectMultipleControlValueAccessor)))(__ngFactoryType__ || _SelectMultipleControlValueAccessor);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _SelectMultipleControlValueAccessor,
    selectors: [["select", "multiple", "", "formControlName", ""], ["select", "multiple", "", "formControl", ""], ["select", "multiple", "", "ngModel", ""]],
    hostBindings: function SelectMultipleControlValueAccessor_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("change", function SelectMultipleControlValueAccessor_change_HostBindingHandler($event) {
          return ctx.onChange($event.target);
        })("blur", function SelectMultipleControlValueAccessor_blur_HostBindingHandler() {
          return ctx.onTouched();
        });
      }
    },
    inputs: {
      compareWith: "compareWith"
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([SELECT_MULTIPLE_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectMultipleControlValueAccessor, [{
    type: Directive,
    args: [{
      selector: "select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]",
      host: {
        "(change)": "onChange($event.target)",
        "(blur)": "onTouched()"
      },
      providers: [SELECT_MULTIPLE_VALUE_ACCESSOR],
      standalone: false
    }]
  }], null, {
    compareWith: [{
      type: Input
    }]
  });
})();
var \u0275NgSelectMultipleOption = class _\u0275NgSelectMultipleOption {
  _element;
  _renderer;
  _select;
  id;
  /** @internal */
  _value;
  constructor(_element, _renderer, _select) {
    this._element = _element;
    this._renderer = _renderer;
    this._select = _select;
    if (this._select) {
      this.id = this._select._registerOption(this);
    }
  }
  /**
   * @description
   * Tracks the value bound to the option element. Unlike the value binding,
   * ngValue supports binding to objects.
   */
  set ngValue(value) {
    if (this._select == null) return;
    this._value = value;
    this._setElementValue(_buildValueString(this.id, value));
    this._select.writeValue(this._select.value);
  }
  /**
   * @description
   * Tracks simple string values bound to the option element.
   * For objects, use the `ngValue` input binding.
   */
  set value(value) {
    if (this._select) {
      this._value = value;
      this._setElementValue(_buildValueString(this.id, value));
      this._select.writeValue(this._select.value);
    } else {
      this._setElementValue(value);
    }
  }
  /** @internal */
  _setElementValue(value) {
    this._renderer.setProperty(this._element.nativeElement, "value", value);
  }
  /** @internal */
  _setSelected(selected) {
    this._renderer.setProperty(this._element.nativeElement, "selected", selected);
  }
  /** @docs-private */
  ngOnDestroy() {
    if (this._select) {
      this._select._optionMap.delete(this.id);
      this._select.writeValue(this._select.value);
    }
  }
  static \u0275fac = function \u0275NgSelectMultipleOption_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _\u0275NgSelectMultipleOption)(\u0275\u0275directiveInject(ElementRef), \u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(SelectMultipleControlValueAccessor, 9));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _\u0275NgSelectMultipleOption,
    selectors: [["option"]],
    inputs: {
      ngValue: "ngValue",
      value: "value"
    },
    standalone: false
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(\u0275NgSelectMultipleOption, [{
    type: Directive,
    args: [{
      selector: "option",
      standalone: false
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }, {
    type: SelectMultipleControlValueAccessor,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }]
  }], {
    ngValue: [{
      type: Input,
      args: ["ngValue"]
    }],
    value: [{
      type: Input,
      args: ["value"]
    }]
  });
})();
function toInteger(value) {
  return typeof value === "number" ? value : parseInt(value, 10);
}
function toFloat(value) {
  return typeof value === "number" ? value : parseFloat(value);
}
var AbstractValidatorDirective = class _AbstractValidatorDirective {
  _validator = nullValidator;
  _onChange;
  /**
   * A flag that tracks whether this validator is enabled.
   *
   * Marking it `internal` (vs `protected`), so that this flag can be used in host bindings of
   * directive classes that extend this base class.
   * @internal
   */
  _enabled;
  /** @docs-private */
  ngOnChanges(changes) {
    if (this.inputName in changes) {
      const input = this.normalizeInput(changes[this.inputName].currentValue);
      this._enabled = this.enabled(input);
      this._validator = this._enabled ? this.createValidator(input) : nullValidator;
      if (this._onChange) {
        this._onChange();
      }
    }
  }
  /** @docs-private */
  validate(control) {
    return this._validator(control);
  }
  /** @docs-private */
  registerOnValidatorChange(fn) {
    this._onChange = fn;
  }
  /**
   * @description
   * Determines whether this validator should be active or not based on an input.
   * Base class implementation checks whether an input is defined (if the value is different from
   * `null` and `undefined`). Validator classes that extend this base class can override this
   * function with the logic specific to a particular validator directive.
   */
  enabled(input) {
    return input != null;
  }
  static \u0275fac = function AbstractValidatorDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AbstractValidatorDirective)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _AbstractValidatorDirective,
    features: [\u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AbstractValidatorDirective, [{
    type: Directive
  }], null, null);
})();
var MAX_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MaxValidator),
  multi: true
};
var MaxValidator = class _MaxValidator extends AbstractValidatorDirective {
  /**
   * @description
   * Tracks changes to the max bound to this directive.
   */
  max;
  /** @internal */
  inputName = "max";
  /** @internal */
  normalizeInput = (input) => toFloat(input);
  /** @internal */
  createValidator = (max) => maxValidator(max);
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MaxValidator_BaseFactory;
    return function MaxValidator_Factory(__ngFactoryType__) {
      return (\u0275MaxValidator_BaseFactory || (\u0275MaxValidator_BaseFactory = \u0275\u0275getInheritedFactory(_MaxValidator)))(__ngFactoryType__ || _MaxValidator);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MaxValidator,
    selectors: [["input", "type", "number", "max", "", "formControlName", ""], ["input", "type", "number", "max", "", "formControl", ""], ["input", "type", "number", "max", "", "ngModel", ""]],
    hostVars: 1,
    hostBindings: function MaxValidator_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("max", ctx._enabled ? ctx.max : null);
      }
    },
    inputs: {
      max: "max"
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([MAX_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MaxValidator, [{
    type: Directive,
    args: [{
      selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]",
      providers: [MAX_VALIDATOR],
      host: {
        "[attr.max]": "_enabled ? max : null"
      },
      standalone: false
    }]
  }], null, {
    max: [{
      type: Input
    }]
  });
})();
var MIN_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MinValidator),
  multi: true
};
var MinValidator = class _MinValidator extends AbstractValidatorDirective {
  /**
   * @description
   * Tracks changes to the min bound to this directive.
   */
  min;
  /** @internal */
  inputName = "min";
  /** @internal */
  normalizeInput = (input) => toFloat(input);
  /** @internal */
  createValidator = (min) => minValidator(min);
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MinValidator_BaseFactory;
    return function MinValidator_Factory(__ngFactoryType__) {
      return (\u0275MinValidator_BaseFactory || (\u0275MinValidator_BaseFactory = \u0275\u0275getInheritedFactory(_MinValidator)))(__ngFactoryType__ || _MinValidator);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MinValidator,
    selectors: [["input", "type", "number", "min", "", "formControlName", ""], ["input", "type", "number", "min", "", "formControl", ""], ["input", "type", "number", "min", "", "ngModel", ""]],
    hostVars: 1,
    hostBindings: function MinValidator_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("min", ctx._enabled ? ctx.min : null);
      }
    },
    inputs: {
      min: "min"
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([MIN_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MinValidator, [{
    type: Directive,
    args: [{
      selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]",
      providers: [MIN_VALIDATOR],
      host: {
        "[attr.min]": "_enabled ? min : null"
      },
      standalone: false
    }]
  }], null, {
    min: [{
      type: Input
    }]
  });
})();
var REQUIRED_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => RequiredValidator),
  multi: true
};
var CHECKBOX_REQUIRED_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => CheckboxRequiredValidator),
  multi: true
};
var RequiredValidator = class _RequiredValidator extends AbstractValidatorDirective {
  /**
   * @description
   * Tracks changes to the required attribute bound to this directive.
   */
  required;
  /** @internal */
  inputName = "required";
  /** @internal */
  normalizeInput = booleanAttribute;
  /** @internal */
  createValidator = (input) => requiredValidator;
  /** @docs-private */
  enabled(input) {
    return input;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275RequiredValidator_BaseFactory;
    return function RequiredValidator_Factory(__ngFactoryType__) {
      return (\u0275RequiredValidator_BaseFactory || (\u0275RequiredValidator_BaseFactory = \u0275\u0275getInheritedFactory(_RequiredValidator)))(__ngFactoryType__ || _RequiredValidator);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _RequiredValidator,
    selectors: [["", "required", "", "formControlName", "", 3, "type", "checkbox"], ["", "required", "", "formControl", "", 3, "type", "checkbox"], ["", "required", "", "ngModel", "", 3, "type", "checkbox"]],
    hostVars: 1,
    hostBindings: function RequiredValidator_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("required", ctx._enabled ? "" : null);
      }
    },
    inputs: {
      required: "required"
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([REQUIRED_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RequiredValidator, [{
    type: Directive,
    args: [{
      selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]",
      providers: [REQUIRED_VALIDATOR],
      host: {
        "[attr.required]": '_enabled ? "" : null'
      },
      standalone: false
    }]
  }], null, {
    required: [{
      type: Input
    }]
  });
})();
var CheckboxRequiredValidator = class _CheckboxRequiredValidator extends RequiredValidator {
  /** @internal */
  createValidator = (input) => requiredTrueValidator;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275CheckboxRequiredValidator_BaseFactory;
    return function CheckboxRequiredValidator_Factory(__ngFactoryType__) {
      return (\u0275CheckboxRequiredValidator_BaseFactory || (\u0275CheckboxRequiredValidator_BaseFactory = \u0275\u0275getInheritedFactory(_CheckboxRequiredValidator)))(__ngFactoryType__ || _CheckboxRequiredValidator);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CheckboxRequiredValidator,
    selectors: [["input", "type", "checkbox", "required", "", "formControlName", ""], ["input", "type", "checkbox", "required", "", "formControl", ""], ["input", "type", "checkbox", "required", "", "ngModel", ""]],
    hostVars: 1,
    hostBindings: function CheckboxRequiredValidator_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("required", ctx._enabled ? "" : null);
      }
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([CHECKBOX_REQUIRED_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CheckboxRequiredValidator, [{
    type: Directive,
    args: [{
      selector: "input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]",
      providers: [CHECKBOX_REQUIRED_VALIDATOR],
      host: {
        "[attr.required]": '_enabled ? "" : null'
      },
      standalone: false
    }]
  }], null, null);
})();
var EMAIL_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => EmailValidator),
  multi: true
};
var EmailValidator = class _EmailValidator extends AbstractValidatorDirective {
  /**
   * @description
   * Tracks changes to the email attribute bound to this directive.
   */
  email;
  /** @internal */
  inputName = "email";
  /** @internal */
  normalizeInput = booleanAttribute;
  /** @internal */
  createValidator = (input) => emailValidator;
  /** @docs-private */
  enabled(input) {
    return input;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275EmailValidator_BaseFactory;
    return function EmailValidator_Factory(__ngFactoryType__) {
      return (\u0275EmailValidator_BaseFactory || (\u0275EmailValidator_BaseFactory = \u0275\u0275getInheritedFactory(_EmailValidator)))(__ngFactoryType__ || _EmailValidator);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _EmailValidator,
    selectors: [["", "email", "", "formControlName", ""], ["", "email", "", "formControl", ""], ["", "email", "", "ngModel", ""]],
    inputs: {
      email: "email"
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([EMAIL_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmailValidator, [{
    type: Directive,
    args: [{
      selector: "[email][formControlName],[email][formControl],[email][ngModel]",
      providers: [EMAIL_VALIDATOR],
      standalone: false
    }]
  }], null, {
    email: [{
      type: Input
    }]
  });
})();
var MIN_LENGTH_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MinLengthValidator),
  multi: true
};
var MinLengthValidator = class _MinLengthValidator extends AbstractValidatorDirective {
  /**
   * @description
   * Tracks changes to the minimum length bound to this directive.
   */
  minlength;
  /** @internal */
  inputName = "minlength";
  /** @internal */
  normalizeInput = (input) => toInteger(input);
  /** @internal */
  createValidator = (minlength) => minLengthValidator(minlength);
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MinLengthValidator_BaseFactory;
    return function MinLengthValidator_Factory(__ngFactoryType__) {
      return (\u0275MinLengthValidator_BaseFactory || (\u0275MinLengthValidator_BaseFactory = \u0275\u0275getInheritedFactory(_MinLengthValidator)))(__ngFactoryType__ || _MinLengthValidator);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MinLengthValidator,
    selectors: [["", "minlength", "", "formControlName", ""], ["", "minlength", "", "formControl", ""], ["", "minlength", "", "ngModel", ""]],
    hostVars: 1,
    hostBindings: function MinLengthValidator_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("minlength", ctx._enabled ? ctx.minlength : null);
      }
    },
    inputs: {
      minlength: "minlength"
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([MIN_LENGTH_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MinLengthValidator, [{
    type: Directive,
    args: [{
      selector: "[minlength][formControlName],[minlength][formControl],[minlength][ngModel]",
      providers: [MIN_LENGTH_VALIDATOR],
      host: {
        "[attr.minlength]": "_enabled ? minlength : null"
      },
      standalone: false
    }]
  }], null, {
    minlength: [{
      type: Input
    }]
  });
})();
var MAX_LENGTH_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MaxLengthValidator),
  multi: true
};
var MaxLengthValidator = class _MaxLengthValidator extends AbstractValidatorDirective {
  /**
   * @description
   * Tracks changes to the maximum length bound to this directive.
   */
  maxlength;
  /** @internal */
  inputName = "maxlength";
  /** @internal */
  normalizeInput = (input) => toInteger(input);
  /** @internal */
  createValidator = (maxlength) => maxLengthValidator(maxlength);
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MaxLengthValidator_BaseFactory;
    return function MaxLengthValidator_Factory(__ngFactoryType__) {
      return (\u0275MaxLengthValidator_BaseFactory || (\u0275MaxLengthValidator_BaseFactory = \u0275\u0275getInheritedFactory(_MaxLengthValidator)))(__ngFactoryType__ || _MaxLengthValidator);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MaxLengthValidator,
    selectors: [["", "maxlength", "", "formControlName", ""], ["", "maxlength", "", "formControl", ""], ["", "maxlength", "", "ngModel", ""]],
    hostVars: 1,
    hostBindings: function MaxLengthValidator_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("maxlength", ctx._enabled ? ctx.maxlength : null);
      }
    },
    inputs: {
      maxlength: "maxlength"
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([MAX_LENGTH_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MaxLengthValidator, [{
    type: Directive,
    args: [{
      selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]",
      providers: [MAX_LENGTH_VALIDATOR],
      host: {
        "[attr.maxlength]": "_enabled ? maxlength : null"
      },
      standalone: false
    }]
  }], null, {
    maxlength: [{
      type: Input
    }]
  });
})();
var PATTERN_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => PatternValidator),
  multi: true
};
var PatternValidator = class _PatternValidator extends AbstractValidatorDirective {
  /**
   * @description
   * Tracks changes to the pattern bound to this directive.
   */
  pattern;
  // This input is always defined, since the name matches selector.
  /** @internal */
  inputName = "pattern";
  /** @internal */
  normalizeInput = (input) => input;
  /** @internal */
  createValidator = (input) => patternValidator(input);
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275PatternValidator_BaseFactory;
    return function PatternValidator_Factory(__ngFactoryType__) {
      return (\u0275PatternValidator_BaseFactory || (\u0275PatternValidator_BaseFactory = \u0275\u0275getInheritedFactory(_PatternValidator)))(__ngFactoryType__ || _PatternValidator);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _PatternValidator,
    selectors: [["", "pattern", "", "formControlName", ""], ["", "pattern", "", "formControl", ""], ["", "pattern", "", "ngModel", ""]],
    hostVars: 1,
    hostBindings: function PatternValidator_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("pattern", ctx._enabled ? ctx.pattern : null);
      }
    },
    inputs: {
      pattern: "pattern"
    },
    standalone: false,
    features: [\u0275\u0275ProvidersFeature([PATTERN_VALIDATOR]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PatternValidator, [{
    type: Directive,
    args: [{
      selector: "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]",
      providers: [PATTERN_VALIDATOR],
      host: {
        "[attr.pattern]": "_enabled ? pattern : null"
      },
      standalone: false
    }]
  }], null, {
    pattern: [{
      type: Input
    }]
  });
})();
var SHARED_FORM_DIRECTIVES = [\u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, RangeValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, SelectMultipleControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, MaxLengthValidator, PatternValidator, CheckboxRequiredValidator, EmailValidator, MinValidator, MaxValidator];
var TEMPLATE_DRIVEN_DIRECTIVES = [NgModel, NgModelGroup, NgForm];
var REACTIVE_DRIVEN_DIRECTIVES = [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName];
var \u0275InternalFormsSharedModule = class _\u0275InternalFormsSharedModule {
  static \u0275fac = function \u0275InternalFormsSharedModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _\u0275InternalFormsSharedModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _\u0275InternalFormsSharedModule,
    declarations: [\u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, RangeValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, SelectMultipleControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, MaxLengthValidator, PatternValidator, CheckboxRequiredValidator, EmailValidator, MinValidator, MaxValidator],
    exports: [\u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, RangeValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, SelectMultipleControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, MaxLengthValidator, PatternValidator, CheckboxRequiredValidator, EmailValidator, MinValidator, MaxValidator]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(\u0275InternalFormsSharedModule, [{
    type: NgModule,
    args: [{
      declarations: SHARED_FORM_DIRECTIVES,
      exports: SHARED_FORM_DIRECTIVES
    }]
  }], null, null);
})();
var FormArray = class extends AbstractControl {
  /**
   * Creates a new `FormArray` instance.
   *
   * @param controls An array of child controls. Each child control is given an index
   * where it is registered.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   */
  constructor(controls, validatorOrOpts, asyncValidator) {
    super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
    this.controls = controls;
    this._initObservables();
    this._setUpdateStrategy(validatorOrOpts);
    this._setUpControls();
    this.updateValueAndValidity({
      onlySelf: true,
      // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
      // `VALID` or `INVALID`.
      // The status should be broadcasted via the `statusChanges` observable, so we set `emitEvent`
      // to `true` to allow that during the control creation process.
      emitEvent: !!this.asyncValidator
    });
  }
  controls;
  /**
   * Get the `AbstractControl` at the given `index` in the array.
   *
   * @param index Index in the array to retrieve the control. If `index` is negative, it will wrap
   *     around from the back, and if index is greatly negative (less than `-length`), the result is
   * undefined. This behavior is the same as `Array.at(index)`.
   */
  at(index) {
    return this.controls[this._adjustIndex(index)];
  }
  /**
   * Insert a new `AbstractControl` at the end of the array.
   *
   * @param control Form control to be inserted
   * @param options Specifies whether this FormArray instance should emit events after a new
   *     control is added.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control is
   * inserted. When false, no events are emitted.
   */
  push(control, options = {}) {
    this.controls.push(control);
    this._registerControl(control);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  /**
   * Insert a new `AbstractControl` at the given `index` in the array.
   *
   * @param index Index in the array to insert the control. If `index` is negative, wraps around
   *     from the back. If `index` is greatly negative (less than `-length`), prepends to the array.
   * This behavior is the same as `Array.splice(index, 0, control)`.
   * @param control Form control to be inserted
   * @param options Specifies whether this FormArray instance should emit events after a new
   *     control is inserted.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control is
   * inserted. When false, no events are emitted.
   */
  insert(index, control, options = {}) {
    this.controls.splice(index, 0, control);
    this._registerControl(control);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
  }
  /**
   * Remove the control at the given `index` in the array.
   *
   * @param index Index in the array to remove the control.  If `index` is negative, wraps around
   *     from the back. If `index` is greatly negative (less than `-length`), removes the first
   *     element. This behavior is the same as `Array.splice(index, 1)`.
   * @param options Specifies whether this FormArray instance should emit events after a
   *     control is removed.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control is
   * removed. When false, no events are emitted.
   */
  removeAt(index, options = {}) {
    let adjustedIndex = this._adjustIndex(index);
    if (adjustedIndex < 0) adjustedIndex = 0;
    if (this.controls[adjustedIndex]) this.controls[adjustedIndex]._registerOnCollectionChange(() => {
    });
    this.controls.splice(adjustedIndex, 1);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
  }
  /**
   * Replace an existing control.
   *
   * @param index Index in the array to replace the control. If `index` is negative, wraps around
   *     from the back. If `index` is greatly negative (less than `-length`), replaces the first
   *     element. This behavior is the same as `Array.splice(index, 1, control)`.
   * @param control The `AbstractControl` control to replace the existing control
   * @param options Specifies whether this FormArray instance should emit events after an
   *     existing control is replaced with a new one.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control is
   * replaced with a new one. When false, no events are emitted.
   */
  setControl(index, control, options = {}) {
    let adjustedIndex = this._adjustIndex(index);
    if (adjustedIndex < 0) adjustedIndex = 0;
    if (this.controls[adjustedIndex]) this.controls[adjustedIndex]._registerOnCollectionChange(() => {
    });
    this.controls.splice(adjustedIndex, 1);
    if (control) {
      this.controls.splice(adjustedIndex, 0, control);
      this._registerControl(control);
    }
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  /**
   * Length of the control array.
   */
  get length() {
    return this.controls.length;
  }
  /**
   * Sets the value of the `FormArray`. It accepts an array that matches
   * the structure of the control.
   *
   * This method performs strict checks, and throws an error if you try
   * to set the value of a control that doesn't exist or if you exclude the
   * value of a control.
   *
   * @usageNotes
   * ### Set the values for the controls in the form array
   *
   * ```ts
   * const arr = new FormArray([
   *   new FormControl(),
   *   new FormControl()
   * ]);
   * console.log(arr.value);   // [null, null]
   *
   * arr.setValue(['Nancy', 'Drew']);
   * console.log(arr.value);   // ['Nancy', 'Drew']
   * ```
   *
   * @param value Array of values for the controls
   * @param options Configure options that determine how the control propagates changes and
   * emits events after the value changes
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
   * is false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control value is updated.
   * When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   */
  setValue(value, options = {}) {
    assertAllValuesPresent(this, false, value);
    value.forEach((newValue, index) => {
      assertControlPresent(this, false, index);
      this.at(index).setValue(newValue, {
        onlySelf: true,
        emitEvent: options.emitEvent
      });
    });
    this.updateValueAndValidity(options);
  }
  /**
   * Patches the value of the `FormArray`. It accepts an array that matches the
   * structure of the control, and does its best to match the values to the correct
   * controls in the group.
   *
   * It accepts both super-sets and sub-sets of the array without throwing an error.
   *
   * @usageNotes
   * ### Patch the values for controls in a form array
   *
   * ```ts
   * const arr = new FormArray([
   *    new FormControl(),
   *    new FormControl()
   * ]);
   * console.log(arr.value);   // [null, null]
   *
   * arr.patchValue(['Nancy']);
   * console.log(arr.value);   // ['Nancy', null]
   * ```
   *
   * @param value Array of latest values for the controls
   * @param options Configure options that determine how the control propagates changes and
   * emits events after the value changes
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
   * is false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when the control
   * value is updated. When false, no events are emitted. The configuration options are passed to
   * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   */
  patchValue(value, options = {}) {
    if (value == null) return;
    value.forEach((newValue, index) => {
      if (this.at(index)) {
        this.at(index).patchValue(newValue, {
          onlySelf: true,
          emitEvent: options.emitEvent
        });
      }
    });
    this.updateValueAndValidity(options);
  }
  /**
   * Resets the `FormArray` and all descendants are marked `pristine` and `untouched`, and the
   * value of all descendants to null or null maps.
   *
   * You reset to a specific form state by passing in an array of states
   * that matches the structure of the control. The state is a standalone value
   * or a form state object with both a value and a disabled status.
   *
   * @usageNotes
   * ### Reset the values in a form array
   *
   * ```ts
   * const arr = new FormArray([
   *    new FormControl(),
   *    new FormControl()
   * ]);
   * arr.reset(['name', 'last name']);
   *
   * console.log(arr.value);  // ['name', 'last name']
   * ```
   *
   * ### Reset the values in a form array and the disabled status for the first control
   *
   * ```ts
   * arr.reset([
   *   {value: 'name', disabled: true},
   *   'last'
   * ]);
   *
   * console.log(arr.value);  // ['last']
   * console.log(arr.at(0).status);  // 'DISABLED'
   * ```
   *
   * @param value Array of values for the controls
   * @param options Configure options that determine how the control propagates changes and
   * emits events after the value changes
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
   * is false.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges`
   * observables emit events with the latest status and value when the control is reset.
   * When false, no events are emitted.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   */
  reset(value = [], options = {}) {
    this._forEachChild((control, index) => {
      control.reset(value[index], {
        onlySelf: true,
        emitEvent: options.emitEvent
      });
    });
    this._updatePristine(options, this);
    this._updateTouched(options, this);
    this.updateValueAndValidity(options);
  }
  /**
   * The aggregate value of the array, including any disabled controls.
   *
   * Reports all values regardless of disabled status.
   */
  getRawValue() {
    return this.controls.map((control) => control.getRawValue());
  }
  /**
   * Remove all controls in the `FormArray`.
   *
   * @param options Specifies whether this FormArray instance should emit events after all
   *     controls are removed.
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   * `valueChanges` observables emit events with the latest status and value when all controls
   * in this FormArray instance are removed. When false, no events are emitted.
   *
   * @usageNotes
   * ### Remove all elements from a FormArray
   *
   * ```ts
   * const arr = new FormArray([
   *    new FormControl(),
   *    new FormControl()
   * ]);
   * console.log(arr.length);  // 2
   *
   * arr.clear();
   * console.log(arr.length);  // 0
   * ```
   *
   * It's a simpler and more efficient alternative to removing all elements one by one:
   *
   * ```ts
   * const arr = new FormArray([
   *    new FormControl(),
   *    new FormControl()
   * ]);
   *
   * while (arr.length) {
   *    arr.removeAt(0);
   * }
   * ```
   */
  clear(options = {}) {
    if (this.controls.length < 1) return;
    this._forEachChild((control) => control._registerOnCollectionChange(() => {
    }));
    this.controls.splice(0);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
  }
  /**
   * Adjusts a negative index by summing it with the length of the array. For very negative
   * indices, the result may remain negative.
   * @internal
   */
  _adjustIndex(index) {
    return index < 0 ? index + this.length : index;
  }
  /** @internal */
  _syncPendingControls() {
    let subtreeUpdated = this.controls.reduce((updated, child) => {
      return child._syncPendingControls() ? true : updated;
    }, false);
    if (subtreeUpdated) this.updateValueAndValidity({
      onlySelf: true
    });
    return subtreeUpdated;
  }
  /** @internal */
  _forEachChild(cb) {
    this.controls.forEach((control, index) => {
      cb(control, index);
    });
  }
  /** @internal */
  _updateValue() {
    this.value = this.controls.filter((control) => control.enabled || this.disabled).map((control) => control.value);
  }
  /** @internal */
  _anyControls(condition) {
    return this.controls.some((control) => control.enabled && condition(control));
  }
  /** @internal */
  _setUpControls() {
    this._forEachChild((control) => this._registerControl(control));
  }
  /** @internal */
  _allControlsDisabled() {
    for (const control of this.controls) {
      if (control.enabled) return false;
    }
    return this.controls.length > 0 || this.disabled;
  }
  _registerControl(control) {
    control.setParent(this);
    control._registerOnCollectionChange(this._onCollectionChange);
  }
  /** @internal */
  _find(name) {
    return this.at(name) ?? null;
  }
};
function isAbstractControlOptions(options) {
  return !!options && (options.asyncValidators !== void 0 || options.validators !== void 0 || options.updateOn !== void 0);
}
var FormBuilder = class _FormBuilder {
  useNonNullable = false;
  /**
   * @description
   * Returns a FormBuilder in which automatically constructed `FormControl` elements
   * have `{nonNullable: true}` and are non-nullable.
   *
   * **Constructing non-nullable controls**
   *
   * When constructing a control, it will be non-nullable, and will reset to its initial value.
   *
   * ```ts
   * let nnfb = new FormBuilder().nonNullable;
   * let name = nnfb.control('Alex'); // FormControl<string>
   * name.reset();
   * console.log(name); // 'Alex'
   * ```
   *
   * **Constructing non-nullable groups or arrays**
   *
   * When constructing a group or array, all automatically created inner controls will be
   * non-nullable, and will reset to their initial values.
   *
   * ```ts
   * let nnfb = new FormBuilder().nonNullable;
   * let name = nnfb.group({who: 'Alex'}); // FormGroup<{who: FormControl<string>}>
   * name.reset();
   * console.log(name); // {who: 'Alex'}
   * ```
   * **Constructing *nullable* fields on groups or arrays**
   *
   * It is still possible to have a nullable field. In particular, any `FormControl` which is
   * *already* constructed will not be altered. For example:
   *
   * ```ts
   * let nnfb = new FormBuilder().nonNullable;
   * // FormGroup<{who: FormControl<string|null>}>
   * let name = nnfb.group({who: new FormControl('Alex')});
   * name.reset(); console.log(name); // {who: null}
   * ```
   *
   * Because the inner control is constructed explicitly by the caller, the builder has
   * no control over how it is created, and cannot exclude the `null`.
   */
  get nonNullable() {
    const nnfb = new _FormBuilder();
    nnfb.useNonNullable = true;
    return nnfb;
  }
  group(controls, options = null) {
    const reducedControls = this._reduceControls(controls);
    let newOptions = {};
    if (isAbstractControlOptions(options)) {
      newOptions = options;
    } else if (options !== null) {
      newOptions.validators = options.validator;
      newOptions.asyncValidators = options.asyncValidator;
    }
    return new FormGroup(reducedControls, newOptions);
  }
  /**
   * @description
   * Constructs a new `FormRecord` instance. Accepts a single generic argument, which is an object
   * containing all the keys and corresponding inner control types.
   *
   * @param controls A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * @param options Configuration options object for the `FormRecord`. The object should have the
   * `AbstractControlOptions` type and might contain the following fields:
   * * `validators`: A synchronous validator function, or an array of validator functions.
   * * `asyncValidators`: A single async validator or array of async validator functions.
   * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur'
   * | submit').
   */
  record(controls, options = null) {
    const reducedControls = this._reduceControls(controls);
    return new FormRecord(reducedControls, options);
  }
  /**
   * @description
   * Constructs a new `FormControl` with the given state, validators and options. Sets
   * `{nonNullable: true}` in the options to get a non-nullable control. Otherwise, the
   * control will be nullable. Accepts a single generic argument, which is the type  of the
   * control's value.
   *
   * @param formState Initializes the control with an initial state value, or
   * with an object that contains both a value and a disabled status.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or a `FormControlOptions` object that contains
   * validation functions and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator
   * functions.
   *
   * @usageNotes
   *
   * ### Initialize a control as disabled
   *
   * The following example returns a control with an initial value in a disabled state.
   *
   * {@example forms/ts/formBuilder/form_builder_example.ts region='disabled-control'}
   */
  control(formState, validatorOrOpts, asyncValidator) {
    let newOptions = {};
    if (!this.useNonNullable) {
      return new FormControl(formState, validatorOrOpts, asyncValidator);
    }
    if (isAbstractControlOptions(validatorOrOpts)) {
      newOptions = validatorOrOpts;
    } else {
      newOptions.validators = validatorOrOpts;
      newOptions.asyncValidators = asyncValidator;
    }
    return new FormControl(formState, __spreadProps(__spreadValues({}, newOptions), {
      nonNullable: true
    }));
  }
  /**
   * Constructs a new `FormArray` from the given array of configurations,
   * validators and options. Accepts a single generic argument, which is the type of each control
   * inside the array.
   *
   * @param controls An array of child controls or control configs. Each child control is given an
   *     index when it is registered.
   *
   * @param validatorOrOpts A synchronous validator function, or an array of such functions, or an
   *     `AbstractControlOptions` object that contains
   * validation functions and a validation trigger.
   *
   * @param asyncValidator A single async validator or array of async validator functions.
   */
  array(controls, validatorOrOpts, asyncValidator) {
    const createdControls = controls.map((c) => this._createControl(c));
    return new FormArray(createdControls, validatorOrOpts, asyncValidator);
  }
  /** @internal */
  _reduceControls(controls) {
    const createdControls = {};
    Object.keys(controls).forEach((controlName) => {
      createdControls[controlName] = this._createControl(controls[controlName]);
    });
    return createdControls;
  }
  /** @internal */
  _createControl(controls) {
    if (controls instanceof FormControl) {
      return controls;
    } else if (controls instanceof AbstractControl) {
      return controls;
    } else if (Array.isArray(controls)) {
      const value = controls[0];
      const validator = controls.length > 1 ? controls[1] : null;
      const asyncValidator = controls.length > 2 ? controls[2] : null;
      return this.control(value, validator, asyncValidator);
    } else {
      return this.control(controls);
    }
  }
  static \u0275fac = function FormBuilder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormBuilder)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _FormBuilder,
    factory: _FormBuilder.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var NonNullableFormBuilder = class _NonNullableFormBuilder {
  static \u0275fac = function NonNullableFormBuilder_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NonNullableFormBuilder)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _NonNullableFormBuilder,
    factory: () => (() => inject(FormBuilder).nonNullable)(),
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NonNullableFormBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => inject(FormBuilder).nonNullable
    }]
  }], null, null);
})();
var UntypedFormBuilder = class _UntypedFormBuilder extends FormBuilder {
  group(controlsConfig, options = null) {
    return super.group(controlsConfig, options);
  }
  /**
   * Like `FormBuilder#control`, except the resulting control is untyped.
   */
  control(formState, validatorOrOpts, asyncValidator) {
    return super.control(formState, validatorOrOpts, asyncValidator);
  }
  /**
   * Like `FormBuilder#array`, except the resulting array is untyped.
   */
  array(controlsConfig, validatorOrOpts, asyncValidator) {
    return super.array(controlsConfig, validatorOrOpts, asyncValidator);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275UntypedFormBuilder_BaseFactory;
    return function UntypedFormBuilder_Factory(__ngFactoryType__) {
      return (\u0275UntypedFormBuilder_BaseFactory || (\u0275UntypedFormBuilder_BaseFactory = \u0275\u0275getInheritedFactory(_UntypedFormBuilder)))(__ngFactoryType__ || _UntypedFormBuilder);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _UntypedFormBuilder,
    factory: _UntypedFormBuilder.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UntypedFormBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var VERSION = new Version("19.2.15");
var FormsModule = class _FormsModule {
  /**
   * @description
   * Provides options for configuring the forms module.
   *
   * @param opts An object of configuration options
   * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
   * correct, or to only call it `whenDisabled`, which is the legacy behavior.
   */
  static withConfig(opts) {
    return {
      ngModule: _FormsModule,
      providers: [{
        provide: CALL_SET_DISABLED_STATE,
        useValue: opts.callSetDisabledState ?? setDisabledStateDefault
      }]
    };
  }
  static \u0275fac = function FormsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FormsModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _FormsModule,
    declarations: [NgModel, NgModelGroup, NgForm],
    exports: [\u0275InternalFormsSharedModule, NgModel, NgModelGroup, NgForm]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [\u0275InternalFormsSharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormsModule, [{
    type: NgModule,
    args: [{
      declarations: TEMPLATE_DRIVEN_DIRECTIVES,
      exports: [\u0275InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
    }]
  }], null, null);
})();
var ReactiveFormsModule = class _ReactiveFormsModule {
  /**
   * @description
   * Provides options for configuring the reactive forms module.
   *
   * @param opts An object of configuration options
   * * `warnOnNgModelWithFormControl` Configures when to emit a warning when an `ngModel`
   * binding is used with reactive form directives.
   * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
   * correct, or to only call it `whenDisabled`, which is the legacy behavior.
   */
  static withConfig(opts) {
    return {
      ngModule: _ReactiveFormsModule,
      providers: [{
        provide: NG_MODEL_WITH_FORM_CONTROL_WARNING,
        useValue: opts.warnOnNgModelWithFormControl ?? "always"
      }, {
        provide: CALL_SET_DISABLED_STATE,
        useValue: opts.callSetDisabledState ?? setDisabledStateDefault
      }]
    };
  }
  static \u0275fac = function ReactiveFormsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReactiveFormsModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _ReactiveFormsModule,
    declarations: [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName],
    exports: [\u0275InternalFormsSharedModule, FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [\u0275InternalFormsSharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReactiveFormsModule, [{
    type: NgModule,
    args: [{
      declarations: [REACTIVE_DRIVEN_DIRECTIVES],
      exports: [\u0275InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
    }]
  }], null, null);
})();

// src/app/components/new-folder-modal/new-folder-modal.component.ts
var NewFolderModalComponent = class _NewFolderModalComponent {
  fileManagerService = inject(FileManagerService);
  modalService = inject(ModalService);
  snackbarService = inject(SnackbarService);
  folderName = "";
  isVisible = computed(() => this.modalService.newFolderModal());
  constructor() {
    effect(() => {
      if (this.isVisible()) {
        setTimeout(() => {
          const input = document.querySelector("#folderNameInput");
          if (input) {
            input.focus();
          }
        }, 100);
      }
    });
  }
  close() {
    this.modalService.hideNewFolderModal();
    this.folderName = "";
  }
  createFolder() {
    const name = this.folderName.trim();
    if (!name) {
      return;
    }
    const invalidChars = /[\/\\:*?"<>|]/;
    if (invalidChars.test(name)) {
      this.snackbarService.error('Folder name contains invalid characters: / \\ : * ? " < > |');
      return;
    }
    this.fileManagerService.createFolder(name).subscribe({
      next: (newFolder) => {
        this.snackbarService.success(`Folder "${name}" created successfully`);
        this.close();
      },
      error: (error) => {
        console.error("Error creating folder:", error);
        let errorMessage = "Failed to create folder";
        if (error.message) {
          if (error.message.includes("already exists") || error.message.includes("duplicate")) {
            errorMessage = `A folder with the name "${name}" already exists`;
          } else if (error.message.includes("invalid") || error.message.includes("bad request")) {
            errorMessage = "Invalid folder name. Please use a different name.";
          } else if (error.message.includes("permission") || error.message.includes("unauthorized")) {
            errorMessage = "You do not have permission to create folders here";
          } else {
            errorMessage = error.message;
          }
        }
        this.snackbarService.error(errorMessage);
      }
    });
  }
  static \u0275fac = function NewFolderModalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NewFolderModalComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NewFolderModalComponent, selectors: [["app-new-folder-modal"]], decls: 10, vars: 4, consts: [["id", "new-folder-modal", 1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", "p-4", 2, "background-color", "rgba(107, 114, 128, 0.6)"], [1, "bg-white", "rounded-lg", "p-4", "sm:p-6", "w-full", "max-w-sm", "sm:max-w-md"], [1, "text-base", "sm:text-lg", "font-semibold", "text-gray-900", "mb-3", "sm:mb-4"], ["id", "folderNameInput", "type", "text", "placeholder", "Folder name", 1, "w-full", "px-3", "py-2", "text-sm", "border", "border-gray-300", "rounded-lg", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", "mb-3", "sm:mb-4", 3, "ngModelChange", "keydown.enter", "ngModel"], [1, "flex", "flex-col", "sm:flex-row", "justify-end", "space-y-2", "sm:space-y-0", "sm:space-x-3"], [1, "px-3", "sm:px-4", "py-1.5", "sm:py-2", "text-xs", "sm:text-sm", "font-medium", "text-gray-600", "hover:text-gray-900", "rounded-lg", 3, "click"], [1, "px-3", "sm:px-4", "py-1.5", "sm:py-2", "text-xs", "sm:text-sm", "font-medium", "text-white", "bg-green-600", "hover:bg-green-700", "rounded-lg", 3, "click", "disabled"]], template: function NewFolderModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h3", 2);
      \u0275\u0275text(3, " Create New Folder ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "input", 3);
      \u0275\u0275twoWayListener("ngModelChange", function NewFolderModalComponent_Template_input_ngModelChange_4_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.folderName, $event) || (ctx.folderName = $event);
        return $event;
      });
      \u0275\u0275listener("keydown.enter", function NewFolderModalComponent_Template_input_keydown_enter_4_listener() {
        return ctx.createFolder();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 4)(6, "button", 5);
      \u0275\u0275listener("click", function NewFolderModalComponent_Template_button_click_6_listener() {
        return ctx.close();
      });
      \u0275\u0275text(7, " Cancel ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "button", 6);
      \u0275\u0275listener("click", function NewFolderModalComponent_Template_button_click_8_listener() {
        return ctx.createFolder();
      });
      \u0275\u0275text(9, " Create ");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("hidden", !ctx.isVisible());
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.folderName);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", !ctx.folderName.trim());
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel], styles: ["\n\n.new-folder-modal[_ngcontent-%COMP%]   .modal-overlay[_ngcontent-%COMP%] {\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  animation: _ngcontent-%COMP%_fadeIn 0.3s ease-out;\n}\n.new-folder-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideUp 0.3s ease-out;\n}\n.new-folder-modal[_ngcontent-%COMP%]   .folder-input[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.new-folder-modal[_ngcontent-%COMP%]   .folder-input[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.new-folder-modal[_ngcontent-%COMP%]   .folder-input.error[_ngcontent-%COMP%] {\n  border-color: #ef4444;\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.new-folder-modal[_ngcontent-%COMP%]   .create-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.new-folder-modal[_ngcontent-%COMP%]   .create-button[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.new-folder-modal[_ngcontent-%COMP%]   .create-button[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n}\n.new-folder-modal[_ngcontent-%COMP%]   .create-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.new-folder-modal[_ngcontent-%COMP%]   .cancel-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.new-folder-modal[_ngcontent-%COMP%]   .cancel-button[_ngcontent-%COMP%]:hover {\n  background-color: #e5e7eb;\n}\n.new-folder-modal[_ngcontent-%COMP%]   .close-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.new-folder-modal[_ngcontent-%COMP%]   .close-button[_ngcontent-%COMP%]:hover {\n  color: #6b7280;\n  transform: scale(1.1);\n}\n.new-folder-modal[_ngcontent-%COMP%]   .validation-message[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideDown 0.2s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=new-folder-modal.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NewFolderModalComponent, [{
    type: Component,
    args: [{ selector: "app-new-folder-modal", standalone: true, imports: [FormsModule], template: '<div\n	id="new-folder-modal"\n	class="fixed inset-0 z-50 flex items-center justify-center p-4"\n	style="background-color: rgba(107, 114, 128, 0.6)"\n	[class.hidden]="!isVisible()">\n	<div class="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md">\n		<h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">\n			Create New Folder\n		</h3>\n		<input\n			id="folderNameInput"\n			type="text"\n			placeholder="Folder name"\n			class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3 sm:mb-4"\n			[(ngModel)]="folderName"\n			(keydown.enter)="createFolder()" />\n		<div\n			class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">\n			<button\n				class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg"\n				(click)="close()">\n				Cancel\n			</button>\n			<button\n				class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"\n				(click)="createFolder()"\n				[disabled]="!folderName.trim()">\n				Create\n			</button>\n		</div>\n	</div>\n</div>\n', styles: ["/* src/app/components/new-folder-modal/new-folder-modal.component.scss */\n.new-folder-modal .modal-overlay {\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  animation: fadeIn 0.3s ease-out;\n}\n.new-folder-modal .modal-content {\n  animation: slideUp 0.3s ease-out;\n}\n.new-folder-modal .folder-input {\n  transition: all 0.2s ease;\n}\n.new-folder-modal .folder-input:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.new-folder-modal .folder-input.error {\n  border-color: #ef4444;\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.new-folder-modal .create-button {\n  transition: all 0.2s ease;\n}\n.new-folder-modal .create-button:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.new-folder-modal .create-button:active {\n  transform: translateY(0);\n}\n.new-folder-modal .create-button:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.new-folder-modal .cancel-button {\n  transition: all 0.2s ease;\n}\n.new-folder-modal .cancel-button:hover {\n  background-color: #e5e7eb;\n}\n.new-folder-modal .close-button {\n  transition: all 0.2s ease;\n}\n.new-folder-modal .close-button:hover {\n  color: #6b7280;\n  transform: scale(1.1);\n}\n.new-folder-modal .validation-message {\n  animation: slideDown 0.2s ease-out;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=new-folder-modal.component.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NewFolderModalComponent, { className: "NewFolderModalComponent", filePath: "src/app/components/new-folder-modal/new-folder-modal.component.ts", lineNumber: 14 });
})();

// src/app/components/rename-modal/rename-modal.component.ts
var RenameModalComponent = class _RenameModalComponent {
  fileManagerService = inject(FileManagerService);
  modalService = inject(ModalService);
  newName = "";
  isVisible = computed(() => this.modalService.renameModal());
  itemToRename = computed(() => this.fileManagerService.itemToRename());
  constructor() {
    effect(() => {
      const item = this.itemToRename();
      if (item && this.isVisible()) {
        this.newName = item.name;
        setTimeout(() => {
          const input = document.querySelector("#renameInput");
          if (input) {
            input.focus();
            input.select();
          }
        }, 100);
      }
    });
  }
  close() {
    this.modalService.hideRenameModal();
    this.fileManagerService.clearItemToRename();
    this.newName = "";
  }
  confirmRename() {
    const name = this.newName.trim();
    const item = this.itemToRename();
    if (!name || !item) {
      return;
    }
    const invalidChars = /[\/\\:*?"<>|]/;
    if (invalidChars.test(name)) {
      console.error("Name contains invalid characters");
      return;
    }
    this.fileManagerService.renameItem(item.id, name).subscribe({
      next: (renamedItem) => {
        console.log("Item renamed successfully:", renamedItem);
        this.close();
      },
      error: (error) => {
        console.error("Error renaming item:", error);
      }
    });
  }
  static \u0275fac = function RenameModalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RenameModalComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RenameModalComponent, selectors: [["app-rename-modal"]], decls: 10, vars: 4, consts: [["id", "rename-modal", 1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", 2, "background-color", "rgba(107, 114, 128, 0.6)"], [1, "bg-white", "rounded-lg", "p-6", "w-full", "max-w-md", "mx-4"], [1, "text-lg", "font-semibold", "text-gray-900", "mb-4"], ["id", "renameInput", "type", "text", 1, "w-full", "px-3", "py-2", "border", "border-gray-300", "rounded-lg", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500", "focus:border-transparent", "mb-4", 3, "ngModelChange", "keydown.enter", "ngModel"], [1, "flex", "justify-end", "space-x-3"], [1, "px-4", "py-2", "text-sm", "font-medium", "text-gray-600", "hover:text-gray-900", 3, "click"], [1, "px-4", "py-2", "text-sm", "font-medium", "text-white", "bg-blue-600", "hover:bg-blue-700", "rounded-lg", 3, "click", "disabled"]], template: function RenameModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h3", 2);
      \u0275\u0275text(3, "Rename File");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "input", 3);
      \u0275\u0275twoWayListener("ngModelChange", function RenameModalComponent_Template_input_ngModelChange_4_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.newName, $event) || (ctx.newName = $event);
        return $event;
      });
      \u0275\u0275listener("keydown.enter", function RenameModalComponent_Template_input_keydown_enter_4_listener() {
        return ctx.confirmRename();
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 4)(6, "button", 5);
      \u0275\u0275listener("click", function RenameModalComponent_Template_button_click_6_listener() {
        return ctx.close();
      });
      \u0275\u0275text(7, " Cancel ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "button", 6);
      \u0275\u0275listener("click", function RenameModalComponent_Template_button_click_8_listener() {
        return ctx.confirmRename();
      });
      \u0275\u0275text(9, " Rename ");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("hidden", !ctx.isVisible());
      \u0275\u0275advance(4);
      \u0275\u0275twoWayProperty("ngModel", ctx.newName);
      \u0275\u0275advance(4);
      \u0275\u0275property("disabled", !ctx.newName.trim());
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel], styles: ["\n\n.rename-modal[_ngcontent-%COMP%]   .modal-overlay[_ngcontent-%COMP%] {\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  animation: _ngcontent-%COMP%_fadeIn 0.3s ease-out;\n}\n.rename-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideUp 0.3s ease-out;\n}\n.rename-modal[_ngcontent-%COMP%]   .rename-input[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.rename-modal[_ngcontent-%COMP%]   .rename-input[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.rename-modal[_ngcontent-%COMP%]   .rename-input.error[_ngcontent-%COMP%] {\n  border-color: #ef4444;\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.rename-modal[_ngcontent-%COMP%]   .rename-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.rename-modal[_ngcontent-%COMP%]   .rename-button[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.rename-modal[_ngcontent-%COMP%]   .rename-button[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n}\n.rename-modal[_ngcontent-%COMP%]   .rename-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.rename-modal[_ngcontent-%COMP%]   .cancel-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.rename-modal[_ngcontent-%COMP%]   .cancel-button[_ngcontent-%COMP%]:hover {\n  background-color: #e5e7eb;\n}\n.rename-modal[_ngcontent-%COMP%]   .close-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.rename-modal[_ngcontent-%COMP%]   .close-button[_ngcontent-%COMP%]:hover {\n  color: #6b7280;\n  transform: scale(1.1);\n}\n.rename-modal[_ngcontent-%COMP%]   .validation-message[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideDown 0.2s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=rename-modal.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RenameModalComponent, [{
    type: Component,
    args: [{ selector: "app-rename-modal", standalone: true, imports: [FormsModule], template: '<div\n	id="rename-modal"\n	class="fixed inset-0 z-50 flex items-center justify-center"\n	style="background-color: rgba(107, 114, 128, 0.6)"\n	[class.hidden]="!isVisible()">\n	<div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">\n		<h3 class="text-lg font-semibold text-gray-900 mb-4">Rename File</h3>\n		<input\n			id="renameInput"\n			type="text"\n			class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"\n			[(ngModel)]="newName"\n			(keydown.enter)="confirmRename()" />\n		<div class="flex justify-end space-x-3">\n			<button\n				class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"\n				(click)="close()">\n				Cancel\n			</button>\n			<button\n				class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"\n				(click)="confirmRename()"\n				[disabled]="!newName.trim()">\n				Rename\n			</button>\n		</div>\n	</div>\n</div>\n', styles: ["/* src/app/components/rename-modal/rename-modal.component.scss */\n.rename-modal .modal-overlay {\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  animation: fadeIn 0.3s ease-out;\n}\n.rename-modal .modal-content {\n  animation: slideUp 0.3s ease-out;\n}\n.rename-modal .rename-input {\n  transition: all 0.2s ease;\n}\n.rename-modal .rename-input:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.rename-modal .rename-input.error {\n  border-color: #ef4444;\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);\n}\n.rename-modal .rename-button {\n  transition: all 0.2s ease;\n}\n.rename-modal .rename-button:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.rename-modal .rename-button:active {\n  transform: translateY(0);\n}\n.rename-modal .rename-button:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.rename-modal .cancel-button {\n  transition: all 0.2s ease;\n}\n.rename-modal .cancel-button:hover {\n  background-color: #e5e7eb;\n}\n.rename-modal .close-button {\n  transition: all 0.2s ease;\n}\n.rename-modal .close-button:hover {\n  color: #6b7280;\n  transform: scale(1.1);\n}\n.rename-modal .validation-message {\n  animation: slideDown 0.2s ease-out;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=rename-modal.component.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RenameModalComponent, { className: "RenameModalComponent", filePath: "src/app/components/rename-modal/rename-modal.component.ts", lineNumber: 13 });
})();

// src/app/components/move-modal/move-modal.component.ts
var _c02 = (a0) => ({ node: a0 });
var _forTrack02 = ($index, $item) => $item.folder.id;
function MoveModalComponent_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 7);
  }
  if (rf & 2) {
    const node_r2 = ctx.$implicit;
    \u0275\u0275nextContext();
    const folderNode_r3 = \u0275\u0275reference(12);
    \u0275\u0275property("ngTemplateOutlet", folderNode_r3)("ngTemplateOutletContext", \u0275\u0275pureFunction1(2, _c02, node_r2));
  }
}
function MoveModalComponent_ng_template_11_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 13);
    \u0275\u0275listener("click", function MoveModalComponent_ng_template_11_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r7);
      const node_r5 = \u0275\u0275nextContext().node;
      const ctx_r5 = \u0275\u0275nextContext();
      ctx_r5.toggleFolder(node_r5);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(1, "i", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const node_r5 = \u0275\u0275nextContext().node;
    const ctx_r5 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("fa-chevron-right", !ctx_r5.isExpanded(node_r5.folder.id))("fa-chevron-down", ctx_r5.isExpanded(node_r5.folder.id));
  }
}
function MoveModalComponent_ng_template_11_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 12);
  }
}
function MoveModalComponent_ng_template_11_Conditional_6_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 7);
  }
  if (rf & 2) {
    const child_r8 = ctx.$implicit;
    \u0275\u0275nextContext(3);
    const folderNode_r3 = \u0275\u0275reference(12);
    \u0275\u0275property("ngTemplateOutlet", folderNode_r3)("ngTemplateOutletContext", \u0275\u0275pureFunction1(2, _c02, child_r8));
  }
}
function MoveModalComponent_ng_template_11_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, MoveModalComponent_ng_template_11_Conditional_6_For_1_Template, 1, 4, "ng-container", 7, _forTrack02);
  }
  if (rf & 2) {
    const node_r5 = \u0275\u0275nextContext().node;
    \u0275\u0275repeater(node_r5.children);
  }
}
function MoveModalComponent_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275listener("click", function MoveModalComponent_ng_template_11_Template_div_click_0_listener() {
      const node_r5 = \u0275\u0275restoreView(_r4).node;
      const ctx_r5 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r5.selectDestination(node_r5.folder.id));
    });
    \u0275\u0275template(1, MoveModalComponent_ng_template_11_Conditional_1_Template, 2, 4, "button", 11)(2, MoveModalComponent_ng_template_11_Conditional_2_Template, 1, 0, "div", 12);
    \u0275\u0275element(3, "i");
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, MoveModalComponent_ng_template_11_Conditional_6_Template, 2, 0);
  }
  if (rf & 2) {
    const node_r5 = ctx.node;
    const ctx_r5 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("padding-left", node_r5.level * 20 + 12 + "px");
    \u0275\u0275classProp("bg-blue-50", ctx_r5.selectedDestination() === node_r5.folder.id);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r5.hasChildren(node_r5) ? 1 : 2);
    \u0275\u0275advance(2);
    \u0275\u0275classMapInterpolate2("fa-solid ", node_r5.folder.icon, " ", node_r5.folder.color, " mr-3");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(node_r5.folder.name);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r5.isExpanded(node_r5.folder.id) ? 6 : -1);
  }
}
var MoveModalComponent = class _MoveModalComponent {
  fileManagerService = inject(FileManagerService);
  modalService = inject(ModalService);
  _selectedDestination = signal(null);
  _expandedFolders = signal(/* @__PURE__ */ new Set());
  isVisible = computed(() => this.modalService.moveModal());
  selectedDestination = this._selectedDestination.asReadonly();
  folderTree = computed(() => {
    const allFolders = this.fileManagerService.allFolders();
    const currentItem = this.fileManagerService.itemToMove();
    const currentFolderId = this.fileManagerService.currentFolderId();
    console.log("Move modal folderTree computed - allFolders:", allFolders.length, allFolders.map((f) => f.name));
    const filteredFolders = allFolders.filter((folder) => {
      if (folder.id === currentFolderId)
        return false;
      if (currentItem && currentItem.type === "folder" && folder.id === currentItem.id)
        return false;
      if (currentItem && currentItem.type === "folder" && this.isDescendant(folder, currentItem.id, allFolders)) {
        return false;
      }
      return true;
    });
    console.log("Move modal folderTree computed - filteredFolders:", filteredFolders.length, filteredFolders.map((f) => f.name));
    return this.buildFolderTree(filteredFolders);
  });
  buildFolderTree(folders) {
    const folderMap = /* @__PURE__ */ new Map();
    const rootNodes = [];
    folders.forEach((folder) => {
      const node = {
        folder,
        children: [],
        expanded: this._expandedFolders().has(folder.id),
        level: 0
      };
      folderMap.set(folder.id, node);
    });
    folders.forEach((folder) => {
      const node = folderMap.get(folder.id);
      const parentId = folder.parentId;
      if (parentId && folderMap.has(parentId)) {
        const parentNode = folderMap.get(parentId);
        parentNode.children.push(node);
        node.level = parentNode.level + 1;
      } else {
        rootNodes.push(node);
      }
    });
    return rootNodes;
  }
  isDescendant(folder, ancestorId, allFolders) {
    let currentParentId = folder.parentId;
    while (currentParentId) {
      if (currentParentId === ancestorId) {
        return true;
      }
      const parent = allFolders.find((f) => f.id === currentParentId);
      if (!parent)
        break;
      currentParentId = parent.parentId;
    }
    return false;
  }
  show() {
    this.modalService.showMoveModal();
    this._selectedDestination.set(null);
    console.log("Move modal show() - refreshing folders");
    this.fileManagerService.getAllFolders().subscribe({
      next: (folders) => {
        console.log("Move modal - folders refreshed:", folders.length, folders.map((f) => f.name));
      },
      error: (error) => {
        console.error("Move modal - error refreshing folders:", error);
      }
    });
  }
  close() {
    this.modalService.hideMoveModal();
    this._selectedDestination.set(null);
    this._expandedFolders.set(/* @__PURE__ */ new Set());
    this.fileManagerService.clearItemToMove();
  }
  selectDestination(path) {
    this._selectedDestination.set(path);
  }
  toggleFolder(node) {
    const expanded = this._expandedFolders();
    const newExpanded = new Set(expanded);
    if (expanded.has(node.folder.id)) {
      newExpanded.delete(node.folder.id);
    } else {
      newExpanded.add(node.folder.id);
    }
    this._expandedFolders.set(newExpanded);
  }
  isExpanded(folderId) {
    return this._expandedFolders().has(folderId);
  }
  hasChildren(node) {
    return node.children.length > 0;
  }
  getDestinationName() {
    const destination = this.selectedDestination();
    if (destination === null) {
      return "Root";
    }
    const folder = this.fileManagerService.allFolders().find((f) => f.id === destination);
    return folder ? folder.name : "Unknown";
  }
  confirmMove() {
    const destination = this.selectedDestination();
    const itemToMove = this.fileManagerService.itemToMove();
    if (itemToMove) {
      this.fileManagerService.moveItem(itemToMove.id, destination).subscribe({
        next: () => {
          this.fileManagerService.clearItemToMove();
          this.close();
        },
        error: (error) => {
          console.error("Error moving item:", error);
        }
      });
    }
  }
  static \u0275fac = function MoveModalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MoveModalComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MoveModalComponent, selectors: [["app-move-modal"]], decls: 18, vars: 4, consts: [["folderNode", ""], ["id", "move-modal", 1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", 2, "background-color", "rgba(107, 114, 128, 0.6)"], [1, "bg-white", "rounded-lg", "p-6", "w-full", "max-w-lg", "mx-4"], [1, "text-lg", "font-semibold", "text-gray-900", "mb-4"], [1, "border", "border-gray-300", "rounded-lg", "max-h-64", "overflow-y-auto"], [1, "p-3", "hover:bg-gray-100", "cursor-pointer", "flex", "items-center", 3, "click"], [1, "fa-solid", "fa-home", "text-gray-500", "mr-3"], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "flex", "justify-end", "space-x-3", "mt-4"], [1, "px-4", "py-2", "text-sm", "font-medium", "text-gray-600", "hover:text-gray-900", 3, "click"], [1, "px-4", "py-2", "text-sm", "font-medium", "text-white", "bg-blue-600", "hover:bg-blue-700", "rounded-lg", 3, "click"], [1, "mr-2", "text-gray-400", "hover:text-gray-600", "w-4", "h-4", "flex", "items-center", "justify-center"], [1, "w-4", "mr-2"], [1, "mr-2", "text-gray-400", "hover:text-gray-600", "w-4", "h-4", "flex", "items-center", "justify-center", 3, "click"], [1, "fa-solid", "text-xs"]], template: function MoveModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "div", 2)(2, "h3", 3);
      \u0275\u0275text(3, "Move to Folder");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(4, "div", 4)(5, "div", 5);
      \u0275\u0275listener("click", function MoveModalComponent_Template_div_click_5_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.selectDestination(null));
      });
      \u0275\u0275element(6, "i", 6);
      \u0275\u0275elementStart(7, "span");
      \u0275\u0275text(8, "Root");
      \u0275\u0275elementEnd()();
      \u0275\u0275repeaterCreate(9, MoveModalComponent_For_10_Template, 1, 4, "ng-container", 7, _forTrack02);
      \u0275\u0275elementEnd();
      \u0275\u0275template(11, MoveModalComponent_ng_template_11_Template, 7, 11, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
      \u0275\u0275elementStart(13, "div", 8)(14, "button", 9);
      \u0275\u0275listener("click", function MoveModalComponent_Template_button_click_14_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.close());
      });
      \u0275\u0275text(15, " Cancel ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "button", 10);
      \u0275\u0275listener("click", function MoveModalComponent_Template_button_click_16_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.confirmMove());
      });
      \u0275\u0275text(17, " Move ");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("hidden", !ctx.isVisible());
      \u0275\u0275advance(5);
      \u0275\u0275classProp("bg-blue-50", ctx.selectedDestination() === null);
      \u0275\u0275advance(4);
      \u0275\u0275repeater(ctx.folderTree());
    }
  }, dependencies: [CommonModule, NgTemplateOutlet], styles: ["\n\n.move-modal[_ngcontent-%COMP%]   .modal-overlay[_ngcontent-%COMP%] {\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  animation: _ngcontent-%COMP%_fadeIn 0.3s ease-out;\n}\n.move-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideUp 0.3s ease-out;\n}\n.move-modal[_ngcontent-%COMP%]   .folder-tree[_ngcontent-%COMP%]   .folder-tree-item[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.move-modal[_ngcontent-%COMP%]   .folder-tree[_ngcontent-%COMP%]   .folder-tree-item[_ngcontent-%COMP%]:hover {\n  background-color: #f8fafc;\n}\n.move-modal[_ngcontent-%COMP%]   .folder-tree[_ngcontent-%COMP%]   .folder-tree-item.selected[_ngcontent-%COMP%] {\n  background-color: #eff6ff;\n  border-left: 3px solid #3b82f6;\n}\n.move-modal[_ngcontent-%COMP%]   .folder-tree[_ngcontent-%COMP%]   .folder-tree-item[_ngcontent-%COMP%]   .folder-icon[_ngcontent-%COMP%] {\n  transition: transform 0.2s ease;\n}\n.move-modal[_ngcontent-%COMP%]   .folder-tree[_ngcontent-%COMP%]   .folder-tree-item[_ngcontent-%COMP%]:hover   .folder-icon[_ngcontent-%COMP%] {\n  transform: scale(1.1);\n}\n.move-modal[_ngcontent-%COMP%]   .destination-info[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideDown 0.2s ease-out;\n  background:\n    linear-gradient(\n      135deg,\n      #eff6ff,\n      #dbeafe);\n}\n.move-modal[_ngcontent-%COMP%]   .move-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.move-modal[_ngcontent-%COMP%]   .move-button[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.move-modal[_ngcontent-%COMP%]   .move-button[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n}\n.move-modal[_ngcontent-%COMP%]   .cancel-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.move-modal[_ngcontent-%COMP%]   .cancel-button[_ngcontent-%COMP%]:hover {\n  background-color: #e5e7eb;\n}\n.move-modal[_ngcontent-%COMP%]   .close-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.move-modal[_ngcontent-%COMP%]   .close-button[_ngcontent-%COMP%]:hover {\n  color: #6b7280;\n  transform: scale(1.1);\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=move-modal.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MoveModalComponent, [{
    type: Component,
    args: [{ selector: "app-move-modal", standalone: true, imports: [CommonModule], template: `<div
	id="move-modal"
	class="fixed inset-0 z-50 flex items-center justify-center"
	style="background-color: rgba(107, 114, 128, 0.6)"
	[class.hidden]="!isVisible()">
	<div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
		<h3 class="text-lg font-semibold text-gray-900 mb-4">Move to Folder</h3>
		<div class="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
			<div
				class="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
				[class.bg-blue-50]="selectedDestination() === null"
				(click)="selectDestination(null)">
				<i class="fa-solid fa-home text-gray-500 mr-3"></i>
				<span>Root</span>
			</div>
			@for (node of folderTree(); track node.folder.id) {
			<ng-container
				[ngTemplateOutlet]="folderNode"
				[ngTemplateOutletContext]="{ node: node }"></ng-container>
			}
		</div>

		<ng-template #folderNode let-node="node">
			<div
				class="p-3 hover:bg-gray-100 cursor-pointer flex items-center"
				[class.bg-blue-50]="selectedDestination() === node.folder.id"
				[style.padding-left]="(node.level * 20 + 12) + 'px'"
				(click)="selectDestination(node.folder.id)">
				@if (hasChildren(node)) {
				<button
					class="mr-2 text-gray-400 hover:text-gray-600 w-4 h-4 flex items-center justify-center"
					(click)="toggleFolder(node); $event.stopPropagation()">
					<i
						class="fa-solid text-xs"
						[class.fa-chevron-right]="!isExpanded(node.folder.id)"
						[class.fa-chevron-down]="isExpanded(node.folder.id)"></i>
				</button>
				} @else {
				<div class="w-4 mr-2"></div>
				}
				<i
					class="fa-solid {{ node.folder.icon }} {{ node.folder.color }} mr-3"></i>
				<span>{{ node.folder.name }}</span>
			</div>
			@if (isExpanded(node.folder.id)) { @for (child of node.children; track
			child.folder.id) {
			<ng-container
				[ngTemplateOutlet]="folderNode"
				[ngTemplateOutletContext]="{ node: child }"></ng-container>
			} }
		</ng-template>
		<div class="flex justify-end space-x-3 mt-4">
			<button
				class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
				(click)="close()">
				Cancel
			</button>
			<button
				class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
				(click)="confirmMove()">
				Move
			</button>
		</div>
	</div>
</div>
`, styles: ["/* src/app/components/move-modal/move-modal.component.scss */\n.move-modal .modal-overlay {\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  animation: fadeIn 0.3s ease-out;\n}\n.move-modal .modal-content {\n  animation: slideUp 0.3s ease-out;\n}\n.move-modal .folder-tree .folder-tree-item {\n  transition: all 0.2s ease;\n}\n.move-modal .folder-tree .folder-tree-item:hover {\n  background-color: #f8fafc;\n}\n.move-modal .folder-tree .folder-tree-item.selected {\n  background-color: #eff6ff;\n  border-left: 3px solid #3b82f6;\n}\n.move-modal .folder-tree .folder-tree-item .folder-icon {\n  transition: transform 0.2s ease;\n}\n.move-modal .folder-tree .folder-tree-item:hover .folder-icon {\n  transform: scale(1.1);\n}\n.move-modal .destination-info {\n  animation: slideDown 0.2s ease-out;\n  background:\n    linear-gradient(\n      135deg,\n      #eff6ff,\n      #dbeafe);\n}\n.move-modal .move-button {\n  transition: all 0.2s ease;\n}\n.move-modal .move-button:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);\n}\n.move-modal .move-button:active {\n  transform: translateY(0);\n}\n.move-modal .cancel-button {\n  transition: all 0.2s ease;\n}\n.move-modal .cancel-button:hover {\n  background-color: #e5e7eb;\n}\n.move-modal .close-button {\n  transition: all 0.2s ease;\n}\n.move-modal .close-button:hover {\n  color: #6b7280;\n  transform: scale(1.1);\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=move-modal.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MoveModalComponent, { className: "MoveModalComponent", filePath: "src/app/components/move-modal/move-modal.component.ts", lineNumber: 23 });
})();

// src/app/components/delete-modal/delete-modal.component.ts
var DeleteModalComponent = class _DeleteModalComponent {
  fileManagerService = inject(FileManagerService);
  modalService = inject(ModalService);
  snackbarService = inject(SnackbarService);
  isVisible = computed(() => this.modalService.deleteModal());
  itemsToDelete = computed(() => this.fileManagerService.itemsToDelete());
  deleteMessage = computed(() => {
    const items = this.itemsToDelete();
    if (items.length === 0) {
      return "No items selected for deletion.";
    } else if (items.length === 1) {
      const files = this.fileManagerService.files();
      const item = files.find((f) => f.id === items[0]);
      const itemName = item ? item.name : "this item";
      return `Are you sure you want to delete "${itemName}"?`;
    } else {
      return `Are you sure you want to delete ${items.length} selected items?`;
    }
  });
  close() {
    this.modalService.hideDeleteModal();
    this.fileManagerService.clearItemsToDelete();
  }
  confirmDelete() {
    const itemsToDelete = this.itemsToDelete();
    if (itemsToDelete.length > 0) {
      this.fileManagerService.deleteItems(itemsToDelete).subscribe({
        next: () => {
          this.snackbarService.success("Items deleted successfully");
          this.close();
        },
        error: (error) => {
          console.error("Error deleting items:", error);
          let errorMessage = "Failed to delete items";
          if (error.message) {
            if (error.message.includes("Cannot delete folder that contains items")) {
              errorMessage = "Cannot delete folder that contains items. Please empty the folder first.";
            } else if (error.message.includes("NOT_FOUND")) {
              errorMessage = "Item not found. It may have been already deleted.";
            } else {
              errorMessage = error.message;
            }
          }
          this.snackbarService.error(errorMessage);
        }
      });
    }
  }
  static \u0275fac = function DeleteModalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DeleteModalComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DeleteModalComponent, selectors: [["app-delete-modal"]], decls: 21, vars: 3, consts: [[1, "fixed", "inset-0", "z-50", "flex", "items-center", "justify-center", 2, "background-color", "rgba(107, 114, 128, 0.6)"], [1, "bg-white", "rounded-lg", "shadow-xl", "w-full", "max-w-md", "mx-4"], [1, "flex", "items-center", "justify-between", "p-6", "border-b", "border-gray-200"], [1, "text-xl", "font-semibold", "text-gray-800"], [1, "text-gray-400", "hover:text-gray-600", 3, "click"], [1, "fa-solid", "fa-times", "text-xl"], [1, "p-6"], [1, "flex", "items-center", "mb-4"], [1, "w-12", "h-12", "bg-red-100", "rounded-full", "flex", "items-center", "justify-center", "mr-4"], [1, "fa-solid", "fa-exclamation-triangle", "text-red-600", "text-xl"], [1, "font-semibold", "text-gray-800"], [1, "text-sm", "text-gray-600"], [1, "flex", "justify-end", "space-x-3"], [1, "px-4", "py-2", "text-gray-700", "bg-gray-100", "rounded-lg", "hover:bg-gray-200", 3, "click"], [1, "px-4", "py-2", "bg-red-600", "text-white", "rounded-lg", "hover:bg-red-700", 3, "click"]], template: function DeleteModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3);
      \u0275\u0275text(4, "Confirm Delete");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "button", 4);
      \u0275\u0275listener("click", function DeleteModalComponent_Template_button_click_5_listener() {
        return ctx.close();
      });
      \u0275\u0275element(6, "i", 5);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "div", 6)(8, "div", 7)(9, "div", 8);
      \u0275\u0275element(10, "i", 9);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "div")(12, "h3", 10);
      \u0275\u0275text(13, "Delete Items");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "p", 11);
      \u0275\u0275text(15);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(16, "div", 12)(17, "button", 13);
      \u0275\u0275listener("click", function DeleteModalComponent_Template_button_click_17_listener() {
        return ctx.close();
      });
      \u0275\u0275text(18, " Cancel ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "button", 14);
      \u0275\u0275listener("click", function DeleteModalComponent_Template_button_click_19_listener() {
        return ctx.confirmDelete();
      });
      \u0275\u0275text(20, " Delete ");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("hidden", !ctx.isVisible());
      \u0275\u0275advance(15);
      \u0275\u0275textInterpolate(ctx.deleteMessage());
    }
  }, styles: ["\n\n.delete-modal[_ngcontent-%COMP%]   .modal-overlay[_ngcontent-%COMP%] {\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  animation: _ngcontent-%COMP%_fadeIn 0.3s ease-out;\n}\n.delete-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideUp 0.3s ease-out;\n}\n.delete-modal[_ngcontent-%COMP%]   .warning-icon[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_pulse 2s infinite;\n}\n.delete-modal[_ngcontent-%COMP%]   .delete-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.delete-modal[_ngcontent-%COMP%]   .delete-button[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);\n  background-color: #dc2626;\n}\n.delete-modal[_ngcontent-%COMP%]   .delete-button[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n}\n.delete-modal[_ngcontent-%COMP%]   .cancel-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.delete-modal[_ngcontent-%COMP%]   .cancel-button[_ngcontent-%COMP%]:hover {\n  background-color: #e5e7eb;\n}\n.delete-modal[_ngcontent-%COMP%]   .close-button[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\n.delete-modal[_ngcontent-%COMP%]   .close-button[_ngcontent-%COMP%]:hover {\n  color: #6b7280;\n  transform: scale(1.1);\n}\n.delete-modal[_ngcontent-%COMP%]   .info-box[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideDown 0.2s ease-out;\n  background:\n    linear-gradient(\n      135deg,\n      #f9fafb,\n      #f3f4f6);\n}\n.delete-modal[_ngcontent-%COMP%]   .warning-content[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideIn 0.3s ease-out;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_slideIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.7;\n  }\n}\n/*# sourceMappingURL=delete-modal.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DeleteModalComponent, [{
    type: Component,
    args: [{ selector: "app-delete-modal", standalone: true, template: '<div\n	class="fixed inset-0 z-50 flex items-center justify-center"\n	style="background-color: rgba(107, 114, 128, 0.6)"\n	[class.hidden]="!isVisible()">\n	<div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">\n		<div class="flex items-center justify-between p-6 border-b border-gray-200">\n			<h2 class="text-xl font-semibold text-gray-800">Confirm Delete</h2>\n			<button class="text-gray-400 hover:text-gray-600" (click)="close()">\n				<i class="fa-solid fa-times text-xl"></i>\n			</button>\n		</div>\n\n		<div class="p-6">\n			<div class="flex items-center mb-4">\n				<div\n					class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">\n					<i class="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>\n				</div>\n				<div>\n					<h3 class="font-semibold text-gray-800">Delete Items</h3>\n					<p class="text-sm text-gray-600">{{ deleteMessage() }}</p>\n				</div>\n			</div>\n\n			<div class="flex justify-end space-x-3">\n				<button\n					class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"\n					(click)="close()">\n					Cancel\n				</button>\n				<button\n					class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"\n					(click)="confirmDelete()">\n					Delete\n				</button>\n			</div>\n		</div>\n	</div>\n</div>\n', styles: ["/* src/app/components/delete-modal/delete-modal.component.scss */\n.delete-modal .modal-overlay {\n  -webkit-backdrop-filter: blur(4px);\n  backdrop-filter: blur(4px);\n  animation: fadeIn 0.3s ease-out;\n}\n.delete-modal .modal-content {\n  animation: slideUp 0.3s ease-out;\n}\n.delete-modal .warning-icon {\n  animation: pulse 2s infinite;\n}\n.delete-modal .delete-button {\n  transition: all 0.2s ease;\n}\n.delete-modal .delete-button:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);\n  background-color: #dc2626;\n}\n.delete-modal .delete-button:active {\n  transform: translateY(0);\n}\n.delete-modal .cancel-button {\n  transition: all 0.2s ease;\n}\n.delete-modal .cancel-button:hover {\n  background-color: #e5e7eb;\n}\n.delete-modal .close-button {\n  transition: all 0.2s ease;\n}\n.delete-modal .close-button:hover {\n  color: #6b7280;\n  transform: scale(1.1);\n}\n.delete-modal .info-box {\n  animation: slideDown 0.2s ease-out;\n  background:\n    linear-gradient(\n      135deg,\n      #f9fafb,\n      #f3f4f6);\n}\n.delete-modal .warning-content {\n  animation: slideIn 0.3s ease-out;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes slideIn {\n  from {\n    opacity: 0;\n    transform: translateX(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n@keyframes pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.7;\n  }\n}\n/*# sourceMappingURL=delete-modal.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DeleteModalComponent, { className: "DeleteModalComponent", filePath: "src/app/components/delete-modal/delete-modal.component.ts", lineNumber: 12 });
})();

// src/app/components/snackbar/snackbar.component.ts
var _forTrack03 = ($index, $item) => $item.id;
function SnackbarComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275listener("click", function SnackbarComponent_For_2_Template_div_click_0_listener() {
      const message_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.removeMessage(message_r2.id));
    });
    \u0275\u0275elementStart(1, "div", 3);
    \u0275\u0275element(2, "i", 4);
    \u0275\u0275elementStart(3, "span", 5);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "button", 6);
    \u0275\u0275listener("click", function SnackbarComponent_For_2_Template_button_click_5_listener($event) {
      const message_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      ctx_r2.removeMessage(message_r2.id);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275element(6, "i", 7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const message_r2 = ctx.$implicit;
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r2.getMessageClasses(message_r2.type));
    \u0275\u0275advance(2);
    \u0275\u0275classMap(ctx_r2.getIconClasses(message_r2.type));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(message_r2.message);
  }
}
var SnackbarComponent = class _SnackbarComponent {
  snackbarService = inject(SnackbarService);
  messages = computed(() => this.snackbarService.messages());
  removeMessage(id) {
    this.snackbarService.remove(id);
  }
  getMessageClasses(type) {
    const baseClasses = "cursor-pointer";
    switch (type) {
      case "success":
        return `${baseClasses} bg-green-500 text-white`;
      case "error":
        return `${baseClasses} bg-red-500 text-white`;
      case "warning":
        return `${baseClasses} bg-yellow-500 text-white`;
      case "info":
      default:
        return `${baseClasses} bg-blue-500 text-white`;
    }
  }
  getIconClasses(type) {
    switch (type) {
      case "success":
        return "fa-solid fa-check-circle";
      case "error":
        return "fa-solid fa-exclamation-circle";
      case "warning":
        return "fa-solid fa-exclamation-triangle";
      case "info":
      default:
        return "fa-solid fa-info-circle";
    }
  }
  static \u0275fac = function SnackbarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SnackbarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SnackbarComponent, selectors: [["app-snackbar"]], decls: 3, vars: 0, consts: [[1, "fixed", "top-4", "right-4", "z-50", "space-y-2"], [1, "flex", "items-center", "justify-between", "p-4", "rounded-lg", "shadow-lg", "max-w-sm", "transform", "transition-all", "duration-300", "ease-in-out", 3, "class"], [1, "flex", "items-center", "justify-between", "p-4", "rounded-lg", "shadow-lg", "max-w-sm", "transform", "transition-all", "duration-300", "ease-in-out", 3, "click"], [1, "flex", "items-center", "space-x-3"], [1, "text-sm"], [1, "text-sm", "font-medium"], [1, "ml-4", "text-current", "opacity-70", "hover:opacity-100", "transition-opacity", 3, "click"], [1, "fa-solid", "fa-times", "text-xs"]], template: function SnackbarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275repeaterCreate(1, SnackbarComponent_For_2_Template, 7, 5, "div", 1, _forTrack03);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.messages());
    }
  }, dependencies: [CommonModule], styles: ["\n\n.snackbar-enter[_ngcontent-%COMP%] {\n  transform: translateX(100%);\n  opacity: 0;\n}\n.snackbar-enter-active[_ngcontent-%COMP%] {\n  transform: translateX(0);\n  opacity: 1;\n}\n.snackbar-exit[_ngcontent-%COMP%] {\n  transform: translateX(0);\n  opacity: 1;\n}\n.snackbar-exit-active[_ngcontent-%COMP%] {\n  transform: translateX(100%);\n  opacity: 0;\n}\n/*# sourceMappingURL=snackbar.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SnackbarComponent, [{
    type: Component,
    args: [{ selector: "app-snackbar", standalone: true, imports: [CommonModule], template: '<div class="fixed top-4 right-4 z-50 space-y-2">\n	@for (message of messages(); track message.id) {\n	<div\n		class="flex items-center justify-between p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ease-in-out"\n		[class]="getMessageClasses(message.type)"\n		(click)="removeMessage(message.id)">\n		<div class="flex items-center space-x-3">\n			<i [class]="getIconClasses(message.type)" class="text-sm"></i>\n			<span class="text-sm font-medium">{{ message.message }}</span>\n		</div>\n\n		<button\n			class="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"\n			(click)="removeMessage(message.id); $event.stopPropagation()">\n			<i class="fa-solid fa-times text-xs"></i>\n		</button>\n	</div>\n	}\n</div>\n', styles: ["/* src/app/components/snackbar/snackbar.component.scss */\n.snackbar-enter {\n  transform: translateX(100%);\n  opacity: 0;\n}\n.snackbar-enter-active {\n  transform: translateX(0);\n  opacity: 1;\n}\n.snackbar-exit {\n  transform: translateX(0);\n  opacity: 1;\n}\n.snackbar-exit-active {\n  transform: translateX(100%);\n  opacity: 0;\n}\n/*# sourceMappingURL=snackbar.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SnackbarComponent, { className: "SnackbarComponent", filePath: "src/app/components/snackbar/snackbar.component.ts", lineNumber: 12 });
})();

// src/app/components/file-explorer/file-explorer.component.ts
var _forTrack04 = ($index, $item) => $item.id;
function FileExplorerComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10);
    \u0275\u0275element(1, "div", 12);
    \u0275\u0275elementStart(2, "p", 13);
    \u0275\u0275text(3, "Loading files...");
    \u0275\u0275elementEnd()();
  }
}
function FileExplorerComponent_Conditional_15_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-file-item", 15);
    \u0275\u0275listener("onClick", function FileExplorerComponent_Conditional_15_For_2_Template_app_file_item_onClick_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onFileClick($event));
    })("onToggleSelection", function FileExplorerComponent_Conditional_15_For_2_Template_app_file_item_onToggleSelection_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.toggleSelection($event));
    })("onSelectRange", function FileExplorerComponent_Conditional_15_For_2_Template_app_file_item_onSelectRange_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.selectRange($event));
    })("onAction", function FileExplorerComponent_Conditional_15_For_2_Template_app_file_item_onAction_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onFileAction($event.action, $event.file));
    })("onContextMenu", function FileExplorerComponent_Conditional_15_For_2_Template_app_file_item_onContextMenu_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.fileManagerService.showContextMenu($event.file, $event.x, $event.y));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const file_r3 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("file", file_r3)("viewMode", ctx_r1.viewMode())("isSelected", ctx_r1.isSelected(file_r3.id));
  }
}
function FileExplorerComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275repeaterCreate(1, FileExplorerComponent_Conditional_15_For_2_Template, 1, 3, "app-file-item", 14, _forTrack04);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r1.getViewClasses());
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.files());
  }
}
var FileExplorerComponent = class _FileExplorerComponent {
  fileManagerService = inject(FileManagerService);
  modalService = inject(ModalService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  // Outputs
  onFileClicked = new EventEmitter();
  // Signals
  viewMode = signal("grid");
  // Computed signals
  files = computed(() => this.fileManagerService.files());
  sortedFiles = computed(() => this.fileManagerService.sortedFiles());
  isLoading = computed(() => this.fileManagerService.isLoading());
  selectedItems = computed(() => this.fileManagerService.selectedItems());
  currentPath = computed(() => this.fileManagerService.currentPath());
  ngOnInit() {
    this.route.url.subscribe((urlSegments) => {
      console.log("Route URL segments:", urlSegments);
      console.log("Current URL:", this.router.url);
      if (urlSegments.length === 0 || urlSegments[0].path === "home") {
        console.log("Loading home content");
        this.loadFolderContent(null, []);
      } else if (urlSegments[0].path === "documents") {
        console.log("Loading documents content");
        this.loadFolderContent("documents", ["Documents"]);
      } else if (urlSegments[0].path === "projects") {
        console.log("Loading projects content");
        this.loadFolderContent("projects", ["Projects"]);
      } else {
        const folderPath = urlSegments.map((segment) => segment.path);
        console.log("Navigating to folder path:", folderPath);
        this.loadFolderByPath(folderPath);
      }
    });
  }
  loadFolderContent(folderId, path) {
    console.log("Loading folder content:", { folderId, path });
    this.fileManagerService.navigateToPath(path, folderId);
  }
  loadFolderByName(folderName) {
    console.log("Loading folder by name:", folderName);
    this.fileManagerService.navigateToFolderByName(folderName);
  }
  loadFolderByPath(folderPath) {
    console.log("Loading folder by path:", folderPath);
    this.fileManagerService.navigateToPath(folderPath);
  }
  getViewClasses() {
    const currentViewMode = this.viewMode();
    if (currentViewMode === "grid") {
      return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4";
    } else {
      return "space-y-2";
    }
  }
  getCurrentFolderName() {
    const path = this.currentPath();
    if (path.length === 0) {
      return "Home";
    }
    const lastSegment = path[path.length - 1];
    if (lastSegment && lastSegment.length > 20) {
      const currentFiles = this.files();
      const currentFolder = currentFiles.find((file) => file.id === lastSegment);
      return currentFolder ? currentFolder.name : lastSegment;
    }
    return lastSegment;
  }
  showNewFolderModal() {
    this.modalService.showNewFolderModal();
  }
  onFileClick(file) {
    console.log("File clicked:", file);
    this.fileManagerService.clearSelection();
    if (file.type === "folder") {
      const currentPath = this.currentPath();
      const newPath = [...currentPath, file.name];
      console.log("Navigating to folder with path:", newPath);
      console.log("Current URL before navigation:", this.router.url);
      this.router.navigate(["/", ...newPath]).then((success) => {
        console.log("Navigation success:", success);
        console.log("Current URL after navigation:", this.router.url);
      }).catch((error) => {
        console.error("Navigation error:", error);
      });
    } else {
      console.log("File clicked:", file.name);
    }
  }
  toggleSelection(fileId) {
    this.fileManagerService.toggleSelection(fileId);
  }
  selectRange(fileId) {
    this.fileManagerService.toggleSelection(fileId);
  }
  isSelected(fileId) {
    return this.fileManagerService.isSelected(fileId);
  }
  onFileAction(action, file) {
    switch (action) {
      case "move":
        this.fileManagerService.setItemToMove(file);
        this.modalService.showMoveModal();
        break;
      case "rename":
        this.fileManagerService.setItemToRename(file);
        this.modalService.showRenameModal();
        break;
      case "delete":
        this.fileManagerService.setItemsToDelete([file.id]);
        this.modalService.showDeleteModal();
        break;
      case "download":
        this.fileManagerService.downloadFile(file.id).subscribe({
          next: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = file.name;
            a.click();
            window.URL.revokeObjectURL(url);
          },
          error: (error) => {
            console.error("Error downloading file:", error);
          }
        });
        break;
    }
  }
  // Navigation methods
  navigateToRoot() {
    this.router.navigate(["/home"]);
  }
  navigateToPath(path) {
    if (path.length === 0) {
      this.router.navigate(["/home"]);
    } else if (path.length === 1) {
      const folderName = path[0].toLowerCase();
      if (folderName === "home") {
        this.router.navigate(["/home"]);
      } else if (folderName === "documents") {
        this.router.navigate(["/documents"]);
      } else if (folderName === "projects") {
        this.router.navigate(["/projects"]);
      } else {
        this.router.navigate(["/", path[0]]);
      }
    } else {
      this.router.navigate(["/", ...path]);
    }
  }
  navigateBack() {
    this.fileManagerService.navigateBack();
  }
  navigateForward() {
    this.fileManagerService.navigateForward();
  }
  refresh() {
    this.fileManagerService.refresh();
  }
  toggleViewMode() {
    this.viewMode.update((mode) => mode === "grid" ? "list" : "grid");
  }
  setViewMode(mode) {
    this.viewMode.set(mode);
  }
  static \u0275fac = function FileExplorerComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FileExplorerComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _FileExplorerComponent, selectors: [["app-file-explorer"]], outputs: { onFileClicked: "onFileClicked" }, decls: 21, vars: 5, consts: [[1, "min-h-screen", "w-full", "bg-gray-50"], [1, "flex-1", "flex", "flex-col", "w-full"], [1, "bg-white", "border-b", "border-gray-200", "px-4", "py-3"], [3, "onNavigateToRoot", "onNavigateToPath", "onNavigateBack", "onNavigateForward", "onRefresh", "onToggleViewMode", "onSetViewMode", "viewMode"], [1, "bg-white", "border-b", "border-gray-200", "px-4", "py-2"], [3, "onNewFolder", "onDelete", "onSelectAll", "onClearSelection", "onToggleViewMode", "onSetViewMode", "selectedCount", "viewMode"], ["id", "file-explorer", 1, "flex-1", "overflow-auto", "bg-gray-50", "w-full"], [1, "p-4", "sm:p-6"], [1, "text-base", "sm:text-lg", "font-semibold", "text-gray-900", "mb-3", "sm:mb-4", "flex", "items-center"], [1, "fa-solid", "fa-folder", "mr-1", "sm:mr-2", "text-blue-500", "text-sm", "sm:text-base"], [1, "flex", "flex-col", "items-center", "justify-center", "py-12"], [3, "class"], [1, "animate-spin", "rounded-full", "h-12", "w-12", "border-b-2", "border-blue-600", "mb-4"], [1, "text-gray-500", "text-sm"], [3, "file", "viewMode", "isSelected"], [3, "onClick", "onToggleSelection", "onSelectRange", "onAction", "onContextMenu", "file", "viewMode", "isSelected"]], template: function FileExplorerComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "app-header");
      \u0275\u0275elementStart(2, "div", 1)(3, "div", 2)(4, "app-breadcrumb", 3);
      \u0275\u0275listener("onNavigateToRoot", function FileExplorerComponent_Template_app_breadcrumb_onNavigateToRoot_4_listener() {
        return ctx.navigateToRoot();
      })("onNavigateToPath", function FileExplorerComponent_Template_app_breadcrumb_onNavigateToPath_4_listener($event) {
        return ctx.navigateToPath($event);
      })("onNavigateBack", function FileExplorerComponent_Template_app_breadcrumb_onNavigateBack_4_listener() {
        return ctx.navigateBack();
      })("onNavigateForward", function FileExplorerComponent_Template_app_breadcrumb_onNavigateForward_4_listener() {
        return ctx.navigateForward();
      })("onRefresh", function FileExplorerComponent_Template_app_breadcrumb_onRefresh_4_listener() {
        return ctx.refresh();
      })("onToggleViewMode", function FileExplorerComponent_Template_app_breadcrumb_onToggleViewMode_4_listener() {
        return ctx.toggleViewMode();
      })("onSetViewMode", function FileExplorerComponent_Template_app_breadcrumb_onSetViewMode_4_listener($event) {
        return ctx.setViewMode($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(5, "div", 4)(6, "app-toolbar", 5);
      \u0275\u0275listener("onNewFolder", function FileExplorerComponent_Template_app_toolbar_onNewFolder_6_listener() {
        return ctx.showNewFolderModal();
      })("onDelete", function FileExplorerComponent_Template_app_toolbar_onDelete_6_listener() {
        return ctx.modalService.showDeleteModal();
      })("onSelectAll", function FileExplorerComponent_Template_app_toolbar_onSelectAll_6_listener() {
        return ctx.fileManagerService.selectAll();
      })("onClearSelection", function FileExplorerComponent_Template_app_toolbar_onClearSelection_6_listener() {
        return ctx.fileManagerService.clearSelection();
      })("onToggleViewMode", function FileExplorerComponent_Template_app_toolbar_onToggleViewMode_6_listener() {
        return ctx.toggleViewMode();
      })("onSetViewMode", function FileExplorerComponent_Template_app_toolbar_onSetViewMode_6_listener($event) {
        return ctx.setViewMode($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(7, "section", 6)(8, "div", 7);
      \u0275\u0275element(9, "app-file-upload");
      \u0275\u0275elementStart(10, "div")(11, "h2", 8);
      \u0275\u0275element(12, "i", 9);
      \u0275\u0275text(13);
      \u0275\u0275elementEnd();
      \u0275\u0275template(14, FileExplorerComponent_Conditional_14_Template, 4, 0, "div", 10)(15, FileExplorerComponent_Conditional_15_Template, 3, 2, "div", 11);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275element(16, "app-new-folder-modal")(17, "app-rename-modal")(18, "app-move-modal")(19, "app-delete-modal")(20, "app-snackbar");
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275property("viewMode", ctx.viewMode());
      \u0275\u0275advance(2);
      \u0275\u0275property("selectedCount", ctx.selectedItems().size)("viewMode", ctx.viewMode());
      \u0275\u0275advance(7);
      \u0275\u0275textInterpolate1(" ", ctx.getCurrentFolderName(), " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.isLoading() ? 14 : 15);
    }
  }, dependencies: [
    CommonModule,
    HeaderComponent,
    BreadcrumbComponent,
    ToolbarComponent,
    FileUploadComponent,
    FileItemComponent,
    NewFolderModalComponent,
    RenameModalComponent,
    MoveModalComponent,
    DeleteModalComponent,
    SnackbarComponent
  ], styles: ["\n\n.file-explorer[_ngcontent-%COMP%]   .drop-zone-overlay[_ngcontent-%COMP%] {\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n  animation: _ngcontent-%COMP%_fadeIn 0.3s ease-out;\n}\n.file-explorer[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_pulse 2s infinite;\n}\n.file-explorer[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_slideUp 0.5s ease-out;\n}\n.file-explorer[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   .empty-icon[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_bounce 2s infinite;\n}\n.file-explorer[_ngcontent-%COMP%]   .files-grid[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.3s ease-out;\n}\n.file-explorer[_ngcontent-%COMP%]   .files-grid.grid-view[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\n}\n@media (min-width: 640px) {\n  .file-explorer[_ngcontent-%COMP%]   .files-grid.grid-view[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));\n  }\n}\n@media (min-width: 768px) {\n  .file-explorer[_ngcontent-%COMP%]   .files-grid.grid-view[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));\n  }\n}\n@media (min-width: 1024px) {\n  .file-explorer[_ngcontent-%COMP%]   .files-grid.grid-view[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));\n  }\n}\n@media (min-width: 1280px) {\n  .file-explorer[_ngcontent-%COMP%]   .files-grid.grid-view[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  }\n}\n.file-explorer[_ngcontent-%COMP%]   .files-grid.list-view[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_bounce {\n  0%, 20%, 50%, 80%, 100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-10px);\n  }\n  60% {\n    transform: translateY(-5px);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n/*# sourceMappingURL=file-explorer.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FileExplorerComponent, [{
    type: Component,
    args: [{ selector: "app-file-explorer", standalone: true, imports: [
      CommonModule,
      HeaderComponent,
      BreadcrumbComponent,
      ToolbarComponent,
      FileUploadComponent,
      FileItemComponent,
      NewFolderModalComponent,
      RenameModalComponent,
      MoveModalComponent,
      DeleteModalComponent,
      SnackbarComponent
    ], template: '<div class="min-h-screen w-full bg-gray-50">\n	<!-- Header -->\n	<app-header></app-header>\n\n	<!-- Main Content -->\n	<div class="flex-1 flex flex-col w-full">\n		<!-- Breadcrumb Navigation -->\n		<div class="bg-white border-b border-gray-200 px-4 py-3">\n			<app-breadcrumb\n				[viewMode]="viewMode()"\n				(onNavigateToRoot)="navigateToRoot()"\n				(onNavigateToPath)="navigateToPath($event)"\n				(onNavigateBack)="navigateBack()"\n				(onNavigateForward)="navigateForward()"\n				(onRefresh)="refresh()"\n				(onToggleViewMode)="toggleViewMode()"\n				(onSetViewMode)="setViewMode($event)">\n			</app-breadcrumb>\n		</div>\n\n		<!-- Toolbar -->\n		<div class="bg-white border-b border-gray-200 px-4 py-2">\n			<app-toolbar\n				[selectedCount]="selectedItems().size"\n				[viewMode]="viewMode()"\n				(onNewFolder)="showNewFolderModal()"\n				(onDelete)="modalService.showDeleteModal()"\n				(onSelectAll)="fileManagerService.selectAll()"\n				(onClearSelection)="fileManagerService.clearSelection()"\n				(onToggleViewMode)="toggleViewMode()"\n				(onSetViewMode)="setViewMode($event)">\n			</app-toolbar>\n		</div>\n\n		<!-- File Explorer -->\n		<section id="file-explorer" class="flex-1 overflow-auto bg-gray-50 w-full">\n			<div class="p-4 sm:p-6">\n				<!-- File Upload Component -->\n				<app-file-upload></app-file-upload>\n\n				<!-- Files Section -->\n				<div>\n					<h2\n						class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">\n						<i\n							class="fa-solid fa-folder mr-1 sm:mr-2 text-blue-500 text-sm sm:text-base"></i>\n						{{ getCurrentFolderName() }}\n					</h2>\n\n					<!-- Loading State -->\n					@if (isLoading()) {\n					<div class="flex flex-col items-center justify-center py-12">\n						<div\n							class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>\n						<p class="text-gray-500 text-sm">Loading files...</p>\n					</div>\n					} @else {\n					<!-- Files Grid -->\n					<div [class]="getViewClasses()">\n						@for (file of files(); track file.id) {\n						<app-file-item\n							[file]="file"\n							[viewMode]="viewMode()"\n							[isSelected]="isSelected(file.id)"\n							(onClick)="onFileClick($event)"\n							(onToggleSelection)="toggleSelection($event)"\n							(onSelectRange)="selectRange($event)"\n							(onAction)="onFileAction($event.action, $event.file)"\n							(onContextMenu)="fileManagerService.showContextMenu($event.file, $event.x, $event.y)">\n						</app-file-item>\n						}\n					</div>\n					}\n				</div>\n			</div>\n		</section>\n	</div>\n\n	<!-- Modals -->\n	<app-new-folder-modal></app-new-folder-modal>\n	<app-rename-modal></app-rename-modal>\n	<app-move-modal></app-move-modal>\n	<app-delete-modal></app-delete-modal>\n\n	<!-- Snackbar -->\n	<app-snackbar></app-snackbar>\n</div>\n', styles: ["/* src/app/components/file-explorer/file-explorer.component.scss */\n.file-explorer .drop-zone-overlay {\n  -webkit-backdrop-filter: blur(2px);\n  backdrop-filter: blur(2px);\n  animation: fadeIn 0.3s ease-out;\n}\n.file-explorer .loading-state {\n  animation: pulse 2s infinite;\n}\n.file-explorer .empty-state {\n  animation: slideUp 0.5s ease-out;\n}\n.file-explorer .empty-state .empty-icon {\n  animation: bounce 2s infinite;\n}\n.file-explorer .files-grid {\n  animation: fadeIn 0.3s ease-out;\n}\n.file-explorer .files-grid.grid-view {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));\n}\n@media (min-width: 640px) {\n  .file-explorer .files-grid.grid-view {\n    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));\n  }\n}\n@media (min-width: 768px) {\n  .file-explorer .files-grid.grid-view {\n    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));\n  }\n}\n@media (min-width: 1024px) {\n  .file-explorer .files-grid.grid-view {\n    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));\n  }\n}\n@media (min-width: 1280px) {\n  .file-explorer .files-grid.grid-view {\n    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  }\n}\n.file-explorer .files-grid.list-view {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes bounce {\n  0%, 20%, 50%, 80%, 100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-10px);\n  }\n  60% {\n    transform: translateY(-5px);\n  }\n}\n@keyframes pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n/*# sourceMappingURL=file-explorer.component.css.map */\n"] }]
  }], null, { onFileClicked: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(FileExplorerComponent, { className: "FileExplorerComponent", filePath: "src/app/components/file-explorer/file-explorer.component.ts", lineNumber: 47 });
})();
export {
  FileExplorerComponent
};
/*! Bundled license information:

@angular/forms/fesm2022/forms.mjs:
  (**
   * @license Angular v19.2.15
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=chunk-3635SOO5.js.map
