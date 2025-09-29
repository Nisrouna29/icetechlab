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
				const targetPath = lastValid.path.length === 0 ? [''] : lastValid.path;
				
				this.router.navigate(['/', ...targetPath]).then(() => {
					// Show modal after navigation
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

	private loadFolderContent(folderId: string | null, path: string[]) {
		this.fileManagerService.navigateToPath(path, folderId);
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
			// Navigate to folder using the full path
			const currentPath = this.currentPath();
			// Filter out 'home' from the path
			const filteredPath = currentPath.filter(segment => segment !== 'home');
			const newPath = [...filteredPath, file.name];
			// Navigate directly using the folder ID for faster loading
			this.fileManagerService.navigateToPath(newPath, file.id);
			this.router.navigate(['/', ...newPath]);
		}
	}

	toggleSelection(fileId: string) {
		this.fileManagerService.toggleSelection(fileId);
	}

	selectRange(fileId: string) {
		// TODO: Implement range selection
		this.fileManagerService.toggleSelection(fileId);
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

	navigateBack() {
		this.fileManagerService.navigateBack();
		// Update URL after navigation
		const currentPath = this.fileManagerService.currentPath();
		if (currentPath.length === 0) {
			this.router.navigate(['']);
		} else {
			this.router.navigate(['/', ...currentPath]);
		}
	}

	navigateForward() {
		this.fileManagerService.navigateForward();
		// Update URL after navigation
		const currentPath = this.fileManagerService.currentPath();
		if (currentPath.length === 0) {
			this.router.navigate(['']);
		} else {
			this.router.navigate(['/', ...currentPath]);
		}
	}

	refresh() {
		this.fileManagerService.refresh();
	}

	toggleViewMode() {
		this.viewMode.update(mode => (mode === 'grid' ? 'list' : 'grid'));
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
