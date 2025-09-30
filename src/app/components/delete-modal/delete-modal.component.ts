import { Component, signal, computed, inject } from '@angular/core';
import { FileManagerService } from '../../services/file-manager.service';
import { ModalService } from '../../services/modal.service';
import { finalize } from 'rxjs';

@Component({
	selector: 'app-delete-modal',
	standalone: true,
	templateUrl: './delete-modal.component.html',
	styleUrl: './delete-modal.component.scss',
})
export class DeleteModalComponent {
	private fileManagerService = inject(FileManagerService);
	private modalService = inject(ModalService);

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

		this.fileManagerService.deleteItem(item).pipe(finalize((()=>{	this.close();}))).subscribe();
	}
}
