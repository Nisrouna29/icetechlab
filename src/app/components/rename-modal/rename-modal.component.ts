import { Component, signal, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FileManagerService } from '../../services/file-manager.service';
import { ModalService } from '../../services/modal.service';
import { finalize } from 'rxjs';

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

	newName = '';
	private _validationError = signal<string | null>(null);

	isVisible = computed(() => this.modalService.renameModal());
	itemToRename = computed(() => this.fileManagerService.itemToRename());
	validationError = this._validationError.asReadonly();

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
		this._validationError.set(null);
	}

	validateName(name: string): boolean {
		const invalidChars = /[\/\\:*?"<>|]/;
		if (invalidChars.test(name)) {
			this._validationError.set('Name contains invalid characters: / \\ : * ? " < > |');
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

	confirmRename() {
		const name = this.newName.trim();
		const item = this.itemToRename();

		if (!name || !item) {
			return;
		}

		// Validate name
		if (!this.validateName(name)) {
			return;
		}

		this.fileManagerService.renameItem(item.id, name).pipe(finalize(()=>{	this.close();})).subscribe();
	}
}
