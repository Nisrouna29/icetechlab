import {
	Component,
	computed,
	inject,
	signal,
	Output,
	EventEmitter,
	OnInit,
	effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
	FileManagerService,
	FileItem,
} from '../../services/file-manager.service';
import { ModalService } from '../../services/modal.service';
import { SnackbarService } from '../../services/snackbar.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { FileItemComponent } from '../file-item/file-item.component';
import { HeaderComponent } from '../header/header.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { NewFolderModalComponent } from '../new-folder-modal/new-folder-modal.component';
import { RenameModalComponent } from '../rename-modal/rename-modal.component';
import { MoveModalComponent } from '../move-modal/move-modal.component';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
	selector: 'app-file-explorer',
	standalone: true,
	imports: [
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
		SnackbarComponent,
	],
	templateUrl: './file-explorer.component.html',
	styleUrl: './file-explorer.component.scss',
})
export class FileExplorerComponent implements OnInit {
	fileManagerService = inject(FileManagerService);
	modalService = inject(ModalService);
	private snackbarService = inject(SnackbarService);
	private route = inject(ActivatedRoute);
	private router = inject(Router);

	// Outputs
	@Output() onFileClicked = new EventEmitter<FileItem>();

	// Signals
	viewMode = signal<'grid' | 'list'>('grid');
	private _showErrorModal = signal(false);
	private _errorHandled = signal(false);
	private _missingFolderName = signal<string>('');

	// Computed signals
	files = computed(() => this.fileManagerService.files());
	isLoading = computed(() => this.fileManagerService.isLoading());
	selectedItems = computed(() => this.fileManagerService.selectedItems());
	currentPath = computed(() => this.fileManagerService.currentPath());
	error = computed(() => this.fileManagerService.error());
	showErrorModal = computed(() => this._showErrorModal());
	missingFolderName = computed(() => this._missingFolderName());

	constructor() {
		// Handle errors - if folder doesn't exist, navigate to parent and show modal
		effect(() => {
			const error = this.fileManagerService.error();
			if (error && error.includes('Failed to load folder contents') && !this._errorHandled()) {
				this._errorHandled.set(true);
				// Get the missing folder name from the service
				const missingFolder = this.fileManagerService.missingFolderName();
				this._missingFolderName.set(missingFolder || 'Unknown');
				
				// Get the last valid path and navigate to it
				const lastValid = this.fileManagerService.getLastValidPath();
				const targetPath = lastValid.path.length === 0 ? [] : lastValid.path;
				
				this.router.navigate(['/', ...targetPath]).then(() => {
					// Ensure root folder is loaded if we're at root
					if (targetPath.length === 0) {
						this.loadFolderContent(null, [], true);
					}
					// Show modal after navigation and loading
					setTimeout(() => {
						this.displayErrorModal();
					}, 1000);
				});
			}
		});
	}

	ngOnInit() {
		// Handle route changes
		this.route.url.subscribe(urlSegments => {
			// Clear files immediately to prevent showing previous content
			this.fileManagerService.clearFiles();
			// Reset error handling when navigating to a new route
			this._errorHandled.set(false);

			if (urlSegments.length === 0) {
				this.loadFolderContent(null, []);
			} else {
				// Handle nested folder paths
				const folderPath = urlSegments.map(segment => segment.path);
				this.loadFolderByPath(folderPath);
			}
		});
	}

	private loadFolderContent(folderId: string | null, path: string[], preserveError: boolean = false) {
		if (preserveError) {
			// Store the current error state
			const currentError = this.fileManagerService.error();
			const currentMissingFolder = this.fileManagerService.missingFolderName();
			
			this.fileManagerService.navigateToPath(path, folderId);
			
			// Restore the error state after navigation
			if (currentError) {
				setTimeout(() => {
					// Re-trigger the error effect by setting the error again
					this.fileManagerService['_error'].set(currentError);
					if (currentMissingFolder) {
						this.fileManagerService['_missingFolderName'].set(currentMissingFolder);
					}
				}, 100);
			}
		} else {
			this.fileManagerService.navigateToPath(path, folderId);
		}
	}

	private loadFolderByPath(folderPath: string[]) {
		this.fileManagerService.navigateToPath(folderPath);
	}


	private displayErrorModal() {
		this._showErrorModal.set(true);
	}

	closeErrorModal() {
		this._showErrorModal.set(false);
		this._errorHandled.set(false);
		this._missingFolderName.set('');
		this.fileManagerService.clearError();
	}

	getViewClasses(): string {
		const currentViewMode = this.viewMode();
		if (currentViewMode === 'grid') {
			return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4';
		} else {
			return 'space-y-2';
		}
	}

	getCurrentFolderName(): string {
		const path = this.currentPath();
		if (path.length === 0) {
			return 'Home';
		}
		// For now, return the last path segment
		// In a real app, you'd want to resolve the folder name from the ID
		const lastSegment = path[path.length - 1];
		// If it's a UUID (folder ID), try to find the folder name from the current files
		if (lastSegment && lastSegment.length > 20) {
			// This looks like a UUID, try to find the folder name
			const currentFiles = this.files();
			const currentFolder = currentFiles.find(file => file.id === lastSegment);
			return currentFolder ? currentFolder.name : lastSegment;
		}
		return lastSegment;
	}

	showNewFolderModal() {
		this.modalService.showNewFolderModal();
	}

	onFileClick(file: FileItem) {
		// Clear selection and navigate/open
		this.fileManagerService.clearSelection();
		if (file.type === 'folder') {
			// Always use navigateToPath with folder ID for consistency
			const currentPath = this.currentPath();
			const newPath = [...currentPath, file.name];
			
			// Use navigateToPath with the folder ID to avoid path resolution issues
			this.fileManagerService.navigateToPath(newPath, file.id);
			
			// Navigate to the URL path
			this.router.navigate(['/', ...newPath]);
		}
		// For files, do nothing when clicked
	}


	isSelected(fileId: string): boolean {
		return this.fileManagerService.isSelected(fileId);
	}

	onFileAction(action: string, file: FileItem) {
		switch (action) {
			case 'move':
				this.fileManagerService.setItemToMove(file);
				this.modalService.showMoveModal();
				break;
			case 'rename':
				this.fileManagerService.setItemToRename(file);
				this.modalService.showRenameModal();
				break;
			case 'delete':
				this.fileManagerService.setItemsToDelete([file.id]);
				this.modalService.showDeleteModal();
				break;
			case 'download':
				this.fileManagerService.downloadFile(file.id).subscribe({
					next: blob => {
						const url = window.URL.createObjectURL(blob);
						const a = document.createElement('a');
						a.href = url;
						a.download = file.name;
						a.click();
						window.URL.revokeObjectURL(url);
					},
					error: error => {
						console.error('Error downloading file:', error);
						this.snackbarService.error(
							`Failed to download "${file.name}": ${error.message || 'Unknown error'}`
						);
					},
				});
				break;
		}
	}

	// Navigation methods
	navigateToRoot() {
		this.router.navigate(['']);
	}

	navigateToPath(path: string[]) {
		if (path.length === 0) {
			this.router.navigate(['']);
		} else {
			// For nested paths, navigate to the full path
			this.router.navigate(['/', ...path]);
		}
	}


	setViewMode(mode: 'grid' | 'list') {
		this.viewMode.set(mode);
	}

	onUploadComplete() {
		// Refresh the file explorer after all uploads complete
		this.fileManagerService.refresh();
		// Refresh all folders first, then refresh counts
		this.fileManagerService.refreshAllFolders().subscribe({
			next: () => {
				// Now refresh folder counts with updated folder list
				this.fileManagerService.refreshFolderCounts();
			},
			error: error => {
				console.error('Error refreshing folders:', error);
				// Still try to refresh counts even if folder refresh fails
				this.fileManagerService.refreshFolderCounts();
			},
		});
	}

	onUploadError() {
		// Refresh the file explorer after upload error
		this.fileManagerService.refresh();
		// Refresh all folders first, then refresh counts
		this.fileManagerService.refreshAllFolders().subscribe({
			next: () => {
				// Now refresh folder counts with updated folder list
				this.fileManagerService.refreshFolderCounts();
			},
			error: error => {
				console.error('Error refreshing folders:', error);
				// Still try to refresh counts even if folder refresh fails
				this.fileManagerService.refreshFolderCounts();
			},
		});
	}
}
