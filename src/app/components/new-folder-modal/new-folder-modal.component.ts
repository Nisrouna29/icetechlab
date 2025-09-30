import { Component, signal, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileManagerService } from '../../services/file-manager.service';
import { ModalService } from '../../services/modal.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
	selector: 'app-new-folder-modal',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './new-folder-modal.component.html',
	styleUrl: './new-folder-modal.component.scss',
})
export class NewFolderModalComponent {
	private fileManagerService = inject(FileManagerService);
	private modalService = inject(ModalService);
	private snackbarService = inject(SnackbarService);

	folderName = '';

	isVisible = computed(() => this.modalService.newFolderModal());

	constructor() {
		// Focus input when modal becomes visible
		effect(() => {
			if (this.isVisible()) {
				setTimeout(() => {
					const input = document.querySelector(
						'#folderNameInput'
					) as HTMLInputElement;
					if (input) {
						input.focus();
					}
				}, 100);
			}
		});
	}

	close() {
		this.modalService.hideNewFolderModal();
		this.folderName = '';
	}

	createFolder() {
		const name = this.folderName.trim();

		if (!name) {
			return;
		}

		// Validate folder name
		const invalidChars = /[\/\\:*?"<>|]/;
		if (invalidChars.test(name)) {
			this.snackbarService.error(
				'Folder name contains invalid characters: / \\ : * ? " < > |'
			);
			return;
		}

		this.fileManagerService.createFolder(name).subscribe({
			next: newFolder => {
				this.snackbarService.success(`Folder "${name}" created successfully`);
				this.close();
			},
			error: error => {
				// Show specific error messages based on the error
				let errorMessage = 'Failed to create folder';

				if (error.message) {
					if (
						error.message.includes('already exists') ||
						error.message.includes('duplicate')
					) {
						errorMessage = `A folder with the name "${name}" already exists`;
					} else {
						errorMessage = error.message;
					}
				}

				this.snackbarService.error(errorMessage);
			},
		});
	}
}
