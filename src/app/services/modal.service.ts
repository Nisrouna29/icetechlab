import { Injectable, signal } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ModalService {
	private _newFolderModal = signal(false);
	private _renameModal = signal(false);
	private _moveModal = signal(false);
	private _deleteModal = signal(false);

	// Readonly signals
	newFolderModal = this._newFolderModal.asReadonly();
	renameModal = this._renameModal.asReadonly();
	moveModal = this._moveModal.asReadonly();
	deleteModal = this._deleteModal.asReadonly();

	showNewFolderModal() {
		this._newFolderModal.set(true);
	}

	hideNewFolderModal() {
		this._newFolderModal.set(false);
	}

	showRenameModal() {
		this._renameModal.set(true);
	}

	hideRenameModal() {
		this._renameModal.set(false);
	}

	showMoveModal() {
		this._moveModal.set(true);
	}

	hideMoveModal() {
		this._moveModal.set(false);
	}

	showDeleteModal() {
		this._deleteModal.set(true);
	}

	hideDeleteModal() {
		this._deleteModal.set(false);
	}

	hideAllModals() {
		this._newFolderModal.set(false);
		this._renameModal.set(false);
		this._moveModal.set(false);
		this._deleteModal.set(false);
	}
}
