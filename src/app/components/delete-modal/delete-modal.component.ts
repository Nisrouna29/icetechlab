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
	itemsToDelete = computed(() => this.fileManagerService.itemsToDelete());

	deleteMessage = computed(() => {
		const items = this.itemsToDelete();
		if (items.length === 0) {
			return 'No items selected for deletion.';
		} else if (items.length === 1) {
			const files = this.fileManagerService.files();
			const item = files.find(f => f.id === items[0]);
			const itemName = item ? item.name : 'this item';
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
					this.snackbarService.success('Items deleted successfully');
					this.close();
				},
				error: error => {
					// Show specific error messages based on the error
					let errorMessage = 'Failed to delete items';

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
}
