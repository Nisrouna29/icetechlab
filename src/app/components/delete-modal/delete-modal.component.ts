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

		this.fileManagerService.deleteItem(item).subscribe({
			next: () => {
				// Success handling is done in the file manager service
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
