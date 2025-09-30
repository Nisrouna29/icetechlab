import {
	Component,
	inject,
	signal,
	ViewChild,
	ElementRef,
	Output,
	EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerService } from '../../services/file-manager.service';
import { SnackbarService } from '../../services/snackbar.service';

export interface UploadingFile {
	file: File;
	progress: number;
	status: 'uploading' | 'completed' | 'error';
}

@Component({
	selector: 'app-file-upload',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './file-upload.component.html',
	styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
	@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
	@ViewChild('folderInput') folderInput!: ElementRef<HTMLInputElement>;

	@Output() onUploadComplete = new EventEmitter<void>();
	@Output() onUploadError = new EventEmitter<void>();

	private fileManagerService = inject(FileManagerService);
	private snackbarService = inject(SnackbarService);

	private _uploadingFiles = signal<UploadingFile[]>([]);
	private _isDragOver = signal(false);
	private _droppedFiles: File[] = [];
	private _allFolders: string[] = [];
	private _isDirectoryUpload = false;

	uploadingFiles = this._uploadingFiles.asReadonly();
	isDragOver = this._isDragOver.asReadonly();

	onDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this._isDragOver.set(true);
	}

	onDragLeave(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this._isDragOver.set(false);
	}

	onDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		this._isDragOver.set(false);

		const items = event.dataTransfer?.items;
		const files = event.dataTransfer?.files;

		// Try both items and files approaches
		if (items && items.length > 0) {
			// Reset dropped files array and folders
			this._droppedFiles = [];
			this._allFolders = [];

			// Track async operations
			let pendingOperations = 0;
			let hasDirectFiles = false;
			let rootFolderName = '';

			// First pass: determine if we have folders and get root folder name
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				if (item.kind === 'file') {
					const entry = item.webkitGetAsEntry();
					if (entry && entry.isDirectory) {
						// This is a folder, use its name as root folder
						rootFolderName = entry.name;
						break;
					}
				}
			}

			// Second pass: process all items
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				if (item.kind === 'file') {
					const entry = item.webkitGetAsEntry(); // For folder support (Chrome/Edge specific)
					if (entry) {
						if (entry.isDirectory) {
							// This is a folder - process it
							// Use the folder's own name as root if no rootFolderName was set
							const folderRootName = rootFolderName || entry.name;
							pendingOperations++;
							this.traverseFileTree(entry, '', folderRootName, () => {
								pendingOperations--;
								if (pendingOperations === 0) {
									this.processDroppedFiles();
								}
							});
						} else {
							// This is a file - track it as a pending operation
							pendingOperations++;
							hasDirectFiles = true;
							(entry as any).file((file: File) => {
								// Only add webkitRelativePath if we have a root folder (directory structure)
								if (rootFolderName) {
									const relativePath = rootFolderName + '/' + file.name;
									Object.defineProperty(file, 'webkitRelativePath', {
										value: relativePath,
										writable: false,
									});
								}

								// Store the file for later processing
								if (!this._droppedFiles) {
									this._droppedFiles = [];
								}
								this._droppedFiles.push(file);

								// Decrement pending operations and process if complete
								pendingOperations--;
								if (pendingOperations === 0) {
									this.processDroppedFiles();
								}
							});
						}
					} else {
						// Handle individual files if webkitGetAsEntry is not available
						const file = item.getAsFile();
						if (file) {
							// Only add webkitRelativePath if we have a root folder (directory structure)
							if (rootFolderName) {
								const relativePath = rootFolderName + '/' + file.name;
								Object.defineProperty(file, 'webkitRelativePath', {
									value: relativePath,
									writable: false,
								});
							}

							// Store the file for later processing
							if (!this._droppedFiles) {
								this._droppedFiles = [];
							}
							this._droppedFiles.push(file);
						}
					}
				}
			}

			// If no async operations, process immediately
			if (pendingOperations === 0) {
				this.processDroppedFiles();
			}
		} else if (files && files.length > 0) {
			this._droppedFiles = Array.from(files);
			this._allFolders = [];
			this.processDroppedFiles();
		}
	}

	// Recursive function to traverse folder structure
	private traverseFileTree(
		item: any,
		path: string = '',
		rootFolderName: string = '',
		onComplete?: () => void
	): void {
		if (item.isFile) {
			item.file((file: File) => {
				// Create the full relative path including root folder
				// path already includes the root folder name from the recursive calls
				let relativePath = path + file.name;

				// If this is the root level and we have a rootFolderName, ensure it's included
				if (
					rootFolderName &&
					path === '' &&
					!relativePath.startsWith(rootFolderName)
				) {
					relativePath = rootFolderName + '/' + relativePath;
				}

				// Add the full path to the file object
				Object.defineProperty(file, 'webkitRelativePath', {
					value: relativePath,
					writable: false,
				});

				// Store the file for later processing
				if (!this._droppedFiles) {
					this._droppedFiles = [];
				}
				this._droppedFiles.push(file);

				// Call completion callback if provided
				if (onComplete) {
					onComplete();
				}
			});
		} else if (item.isDirectory) {
			// Build the directory path
			let dirPath = path + item.name + '/';

			// If this is the root directory and we have a rootFolderName, ensure it's included
			if (
				rootFolderName &&
				path === '' &&
				!dirPath.startsWith(rootFolderName)
			) {
				dirPath = rootFolderName + '/' + dirPath;
			}

			// Store the folder path (remove trailing slash for consistency)
			const folderPath = dirPath.slice(0, -1);
			if (folderPath && !this._allFolders.includes(folderPath)) {
				this._allFolders.push(folderPath);
			}
			const dirReader = item.createReader();
			dirReader.readEntries((entries: any[]) => {
				if (entries.length === 0) {
					// Empty directory, call completion callback
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

	private processDroppedFiles(): void {
		if (!this._droppedFiles || this._droppedFiles.length === 0) {
			return;
		}

		// Check if any file has webkitRelativePath (indicates directory structure)
		const hasDirectoryStructure = this._droppedFiles.some(
			file => (file as any).webkitRelativePath
		);

		// Only use directory upload if we actually have folders to create
		if (hasDirectoryStructure && this._allFolders.length > 0) {
			// Extract root folder name from the first file's webkitRelativePath
			const firstFile = this._droppedFiles[0] as any;
			let rootFolderName = '';
			if (firstFile.webkitRelativePath) {
				const pathSegments = firstFile.webkitRelativePath.split('/');
				rootFolderName = pathSegments[0];
			}
			this.uploadDirectory(
				this._droppedFiles,
				rootFolderName,
				this._allFolders
			);
		} else {
			this.uploadFiles(this._droppedFiles);
		}
	}

	openFileDialog() {
		// Use setTimeout to ensure ViewChild is initialized
		setTimeout(() => {
			if (this.fileInput) {
				this.fileInput.nativeElement.click();
			}
		}, 0);
	}

	openFolderDialog() {
		// Use setTimeout to ensure ViewChild is initialized
		setTimeout(() => {
			if (this.folderInput) {
				this.folderInput.nativeElement.click();
			}
		}, 0);
	}

	onFileSelected(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const files = Array.from(target.files);
			this.uploadFiles(files);
		}
	}

	onFolderSelected(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const files = Array.from(target.files);
			const hasDirectoryStructure = files.some(
				file => (file as any).webkitRelativePath
			);

			if (hasDirectoryStructure) {
				// Extract root folder name from the first file's webkitRelativePath
				const firstFile = files[0] as any;
				let rootFolderName = '';
				if (firstFile.webkitRelativePath) {
					const pathSegments = firstFile.webkitRelativePath.split('/');
					rootFolderName = pathSegments[0];
				}

				// Extract all folder paths from webkitRelativePath
				// For file input, we need to create all intermediate folders
				// that might exist between files, even if they don't contain files
				const allFolders = new Set<string>();
				files.forEach(file => {
					const relativePath = (file as any).webkitRelativePath;
					if (relativePath) {
						const pathSegments = relativePath.split('/');
						// Add all possible folder combinations
						// Start from index 2 to skip the root folder name and include subfolders
						for (let i = 2; i < pathSegments.length; i++) {
							const folderPath = pathSegments.slice(0, i).join('/');
							allFolders.add(folderPath);
						}
					}
				});
				this.uploadDirectory(files, rootFolderName, Array.from(allFolders));
			} else {
				this.uploadFiles(files);
			}
		}
	}

	private uploadFiles(files: File[]) {
		// Add files to uploading state
		const currentUploading = [...this._uploadingFiles()];
		files.forEach(file => {
			currentUploading.push({
				file,
				progress: 0,
				status: 'uploading',
			});
		});
		this._uploadingFiles.set(currentUploading);

		// Upload files using the file manager service
		this.fileManagerService.uploadFiles(files).subscribe({
			next: response => {
				// Mark files as completed
				const updatedUploading = this._uploadingFiles().map(uploadingFile => {
					if (files.some(f => f.name === uploadingFile.file.name)) {
						return {
							...uploadingFile,
							status: 'completed' as const,
							progress: 100,
						};
					}
					return uploadingFile;
				});
				this._uploadingFiles.set(updatedUploading);

				// Success - no snackbar needed
				// Emit completion event for regular file upload only if not part of directory upload
				if (!this._isDirectoryUpload) {
					this.onUploadComplete.emit();
				}

				// Remove completed files after a delay
				setTimeout(() => {
					const filteredUploading = this._uploadingFiles().filter(
						uploadingFile =>
							!files.some(f => f.name === uploadingFile.file.name)
					);
					this._uploadingFiles.set(filteredUploading);
				}, 2000);
			},
			error: error => {
				// Mark files as failed
				const updatedUploading = this._uploadingFiles().map(uploadingFile => {
					if (files.some(f => f.name === uploadingFile.file.name)) {
						return { ...uploadingFile, status: 'error' as const };
					}
					return uploadingFile;
				});
				this._uploadingFiles.set(updatedUploading);

				// Show error snackbar with detailed message
				const errorMessage =
					error?.message || error?.error?.message || 'Unknown error occurred';
				this.snackbarService.error(
					`File upload failed: ${errorMessage}. Please check your files and try again.`,
					5000
				);

				// Emit error event only if not part of directory upload
				if (!this._isDirectoryUpload) {
					this.onUploadError.emit();
				}

				// Remove failed files after a delay
				setTimeout(() => {
					const filteredUploading = this._uploadingFiles().filter(
						uploadingFile =>
							!files.some(f => f.name === uploadingFile.file.name)
					);
					this._uploadingFiles.set(filteredUploading);
				}, 3000);
			},
		});

		// Simulate progress updates
		files.forEach(file => {
			this.simulateUploadProgress(file);
		});
	}

	private uploadDirectory(
		files: File[],
		rootFolderName: string,
		allFolders: string[] = []
	) {
		// Set directory upload flag
		this._isDirectoryUpload = true;

		// Add files to uploading state
		const currentUploading = [...this._uploadingFiles()];
		files.forEach(file => {
			currentUploading.push({
				file,
				progress: 0,
				status: 'uploading',
			});
		});
		this._uploadingFiles.set(currentUploading);

		// Upload directory using the file manager service
		this.fileManagerService
			.uploadDirectory(files, rootFolderName, allFolders)
			.subscribe({
				next: response => {
					// Mark files as completed
					const updatedUploading = this._uploadingFiles().map(uploadingFile => {
						if (files.some(f => f.name === uploadingFile.file.name)) {
							return {
								...uploadingFile,
								status: 'completed' as const,
								progress: 100,
							};
						}
						return uploadingFile;
					});
					this._uploadingFiles.set(updatedUploading);

					// Success - no snackbar needed
					// Reset directory upload flag
					this._isDirectoryUpload = false;

					// Remove completed files after a delay
					setTimeout(() => {
						const filteredUploading = this._uploadingFiles().filter(
							uploadingFile =>
								!files.some(f => f.name === uploadingFile.file.name)
						);
						this._uploadingFiles.set(filteredUploading);
					}, 2000);

					// Emit completion event for directory upload AFTER all operations complete
					// Add a delay to ensure server has processed all files and folders
					setTimeout(() => {
						this.onUploadComplete.emit();
					}, 1000);
				},
				error: error => {
					// Mark files as failed
					const updatedUploading = this._uploadingFiles().map(uploadingFile => {
						if (files.some(f => f.name === uploadingFile.file.name)) {
							return { ...uploadingFile, status: 'error' as const };
						}
						return uploadingFile;
					});
					this._uploadingFiles.set(updatedUploading);

					// Show error snackbar with detailed message
					const errorMessage =
						error?.message || error?.error?.message || 'Unknown error occurred';
					this.snackbarService.error(
						`Directory upload failed: ${errorMessage}. Please check your files and try again.`,
						5000
					);

					// Reset directory upload flag
					this._isDirectoryUpload = false;

					// Remove failed files after a delay
					setTimeout(() => {
						const filteredUploading = this._uploadingFiles().filter(
							uploadingFile =>
								!files.some(f => f.name === uploadingFile.file.name)
						);
						this._uploadingFiles.set(filteredUploading);
					}, 3000);

					// Emit error event
					this.onUploadError.emit();
				},
			});
	}

	private simulateUploadProgress(file: File) {
		const totalSteps = 20;
		let currentStep = 0;

		const interval = setInterval(
			() => {
				currentStep++;
				const progress = (currentStep / totalSteps) * 100;

				const updatedUploading = this._uploadingFiles().map(uploadingFile => {
					if (
						uploadingFile.file.name === file.name &&
						uploadingFile.status === 'uploading'
					) {
						return { ...uploadingFile, progress };
					}
					return uploadingFile;
				});
				this._uploadingFiles.set(updatedUploading);

				if (currentStep >= totalSteps) {
					clearInterval(interval);
				}
			},
			100 + Math.random() * 200
		);
	}


	getFileIcon(fileName: string): string {
		return this.fileManagerService.getFileIcon(fileName);
	}

	getFileColor(fileName: string): string {
		return this.fileManagerService.getFileColor(fileName);
	}
}
