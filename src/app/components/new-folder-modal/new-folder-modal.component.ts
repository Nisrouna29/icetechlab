import { Component, signal, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileManagerService } from '../../services/file-manager.service';
import { ModalService } from '../../services/modal.service';
import { finalize } from 'rxjs';

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

	folderName = '';
	private _validationError = signal<string | null>(null);

	isVisible = computed(() => this.modalService.newFolderModal());
	validationError = this._validationError.asReadonly();

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
		this._validationError.set(null);
	}

	validateName(name: string): boolean {
		const invalidChars = /[\/\\:*?"<>|]/;
		if (invalidChars.test(name)) {
			this._validationError.set('Folder name contains invalid characters: / \\ : * ? " < > |');
			return false;
		}
		this._validationError.set(null);
		return true;
	}

	onNameChange() {
		// Clear validation error when user starts typing
		if (this._validationError()) {
			this._validationError.set(null);
		}
	}

	createFolder() {
		const name = this.folderName.trim();

		if (!name) {
			return;
		}

		// Validate folder name
		if (!this.validateName(name)) {
			return;
		}

		this.fileManagerService.createFolder(name).pipe(finalize(()=>{	this.close();})).subscribe();
	}
}
