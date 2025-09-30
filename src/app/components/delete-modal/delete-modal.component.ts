import { Component, signal, computed, inject } from '@angular/core';
import { FileManagerService } from '../../services/file-manager.service';
import { ModalService } from '../../services/modal.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
	selector: 'app-delete-modal',
	standalone: true,
	templateUrl: './delete-modal.component.html',
	styleUrl: './delete-modal.component.scss',
})
export class DeleteModalComponent {
	private fileManagerService = inject(FileManagerService);
	private modalService = inject(ModalService);
	private snackbarService = inject(SnackbarService);

	isVisible = computed(() => this.modalService.deleteModal());
	itemToDelete = computed(() => this.fileManagerService.itemToDelete());

	deleteMessage = computed(() => {
		const item = this.itemToDelete();
		if (!item) {
			return 'No item selected for deletion.';
		}
		return `Are you sure you want to delete "${item.name}"?`;
	});

	close() {
		this.modalService.hideDeleteModal();
		this.fileManagerService.clearItemToDelete();
	}

	confirmDelete() {
		const item = this.itemToDelete();
		if (!item) return;

		this.fileManagerService.deleteItems([item.id]).subscribe({
			next: () => {
				this.snackbarService.success(`${item.type === 'folder' ? 'Folder' : 'File'} deleted successfully`);
				this.close();
			},
			error: error => {
				// Show specific error messages based on the error
				let errorMessage = `Failed to delete ${item.type}`;

				if (error.message) {
					if (
						error.message.includes('Cannot delete folder that contains items')
					) {
						errorMessage =
							'Cannot delete folder that contains items. Please empty the folder first.';
					} else if (error.message.includes('NOT_FOUND')) {
						errorMessage =
							'Item not found. It may have been already deleted.';
					} else {
						errorMessage = error.message;
					}
				}

				this.snackbarService.error(errorMessage);
			},
		});
	}
}
