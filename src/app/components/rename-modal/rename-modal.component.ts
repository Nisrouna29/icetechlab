import { Component, signal, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileManagerService } from '../../services/file-manager.service';
import { ModalService } from '../../services/modal.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
	selector: 'app-rename-modal',
	standalone: true,
	imports: [FormsModule],
	templateUrl: './rename-modal.component.html',
	styleUrl: './rename-modal.component.scss',
})
export class RenameModalComponent {
	private fileManagerService = inject(FileManagerService);
	private modalService = inject(ModalService);
	private snackbarService = inject(SnackbarService);

	newName = '';

	isVisible = computed(() => this.modalService.renameModal());
	itemToRename = computed(() => this.fileManagerService.itemToRename());

	constructor() {
		// Focus and select input when modal becomes visible
		effect(() => {
			const item = this.itemToRename();
			if (item && this.isVisible()) {
				this.newName = item.name;
				setTimeout(() => {
					const input = document.querySelector(
						'#renameInput'
					) as HTMLInputElement;
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
		this.newName = '';
	}

	confirmRename() {
		const name = this.newName.trim();
		const item = this.itemToRename();

		if (!name || !item) {
			return;
		}

		// Validate name
		const invalidChars = /[\/\\:*?"<>|]/;
		if (invalidChars.test(name)) {
			console.error('Name contains invalid characters');
			return;
		}

		this.fileManagerService.renameItem(item.id, name).subscribe({
			next: renamedItem => {
				this.close();
			},
			error: error => {
				// Error handling is done in the file manager service
				// Just close the modal on error
				this.close();
			},
		});
	}
}
