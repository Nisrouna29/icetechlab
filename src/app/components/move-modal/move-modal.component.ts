import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FileManagerService,
	FileItem,
} from '../../services/file-manager.service';
import { ModalService } from '../../services/modal.service';
import { SnackbarService } from '../../services/snackbar.service';

interface FolderTreeNode {
	folder: FileItem;
	children: FolderTreeNode[];
	expanded: boolean;
	level: number;
}

@Component({
	selector: 'app-move-modal',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './move-modal.component.html',
	styleUrl: './move-modal.component.scss',
})
export class MoveModalComponent {
	private fileManagerService = inject(FileManagerService);
	private modalService = inject(ModalService);
	private snackbarService = inject(SnackbarService);

	private _selectedDestination = signal<string | null>(null);
	private _expandedFolders = signal<Set<string>>(new Set());

	isVisible = computed(() => this.modalService.moveModal());
	selectedDestination = this._selectedDestination.asReadonly();

	folderTree = computed(() => {
		const allFolders = this.fileManagerService.allFolders();
		const currentItem = this.fileManagerService.itemToMove();
		const currentFolderId = this.fileManagerService.currentFolderId();

		// First, identify folders to exclude
		const excludedFolderIds = new Set<string>();
		
		// Exclude current folder
		if (currentFolderId) {
			excludedFolderIds.add(currentFolderId);
		}
		
		// Exclude the item being moved if it's a folder
		if (currentItem && currentItem.type === 'folder') {
			excludedFolderIds.add(currentItem.id);
		}
		
		// Exclude children of the folder being moved
		if (currentItem && currentItem.type === 'folder') {
			allFolders.forEach(folder => {
				if (this.isDescendant(folder, currentItem.id, allFolders)) {
					excludedFolderIds.add(folder.id);
				}
			});
		}

		// Get valid folders (not excluded)
		const validFolders = allFolders.filter(folder => !excludedFolderIds.has(folder.id));
		
		// Include all ancestors of valid folders to maintain tree structure
		const foldersWithAncestors = this.includeAncestors(validFolders, allFolders);


		return this.buildFolderTree(foldersWithAncestors);
	});

	private buildFolderTree(folders: FileItem[]): FolderTreeNode[] {
		const folderMap = new Map<string, FolderTreeNode>();
		const rootNodes: FolderTreeNode[] = [];

		// Create tree nodes for all folders
		folders.forEach(folder => {
			const node: FolderTreeNode = {
				folder,
				children: [],
				expanded: this._expandedFolders().has(folder.id),
				level: 0,
			};
			folderMap.set(folder.id, node);
		});

		// Build the tree structure
		folders.forEach(folder => {
			const node = folderMap.get(folder.id)!;
			const parentId = folder.parentId;

			if (parentId && folderMap.has(parentId)) {
				const parentNode = folderMap.get(parentId)!;
				parentNode.children.push(node);
				node.level = parentNode.level + 1;
			} else {
				// If parent is not in the map, this is a root node
				rootNodes.push(node);
			}
		});

		// Recursively set levels to ensure correct indentation
		this.setLevelsRecursively(rootNodes, 0);

		return rootNodes;
	}

	private setLevelsRecursively(nodes: FolderTreeNode[], level: number): void {
		nodes.forEach(node => {
			node.level = level;
			if (node.children.length > 0) {
				this.setLevelsRecursively(node.children, level + 1);
			}
		});
	}

	private includeAncestors(validFolders: FileItem[], allFolders: FileItem[]): FileItem[] {
		const result = new Set<string>();
		
		// Add all valid folders
		validFolders.forEach(folder => result.add(folder.id));
		
		// For each valid folder, add all its ancestors
		validFolders.forEach(folder => {
			let current = folder;
			while (current.parentId) {
				const parent = allFolders.find(f => f.id === current.parentId);
				if (parent) {
					result.add(parent.id);
					current = parent;
				} else {
					break;
				}
			}
		});
		
		// Return all folders (valid + ancestors) in the same order as allFolders
		return allFolders.filter(folder => result.has(folder.id));
	}

	private isDescendant(
		folder: FileItem,
		ancestorId: string,
		allFolders: FileItem[]
	): boolean {
		let currentParentId = folder.parentId;
		while (currentParentId) {
			if (currentParentId === ancestorId) {
				return true;
			}
			const parent = allFolders.find(f => f.id === currentParentId);
			if (!parent) break;
			currentParentId = parent.parentId;
		}
		return false;
	}

	show() {
		this.modalService.showMoveModal();
		this._selectedDestination.set(null);
		this.fileManagerService.getAllFolders().subscribe();
	}

	close() {
		this.modalService.hideMoveModal();
		this._selectedDestination.set(null);
		this._expandedFolders.set(new Set());
		this.fileManagerService.clearItemToMove();
	}

	selectDestination(path: string | null) {
		this._selectedDestination.set(path);
	}

	toggleFolder(node: FolderTreeNode) {
		const expanded = this._expandedFolders();
		const newExpanded = new Set(expanded);

		if (expanded.has(node.folder.id)) {
			newExpanded.delete(node.folder.id);
		} else {
			newExpanded.add(node.folder.id);
		}

		this._expandedFolders.set(newExpanded);
	}

	isExpanded(folderId: string): boolean {
		return this._expandedFolders().has(folderId);
	}

	hasChildren(node: FolderTreeNode): boolean {
		return node.children.length > 0;
	}

	getDestinationName(): string {
		const destination = this.selectedDestination();
		if (destination === null) {
			return 'Root';
		}
		const folder = this.fileManagerService
			.allFolders()
			.find(f => f.id === destination);
		return folder ? folder.name : 'Unknown';
	}

	confirmMove() {
		const destination = this.selectedDestination();
		const itemToMove = this.fileManagerService.itemToMove();

		if (itemToMove) {
			this.fileManagerService.moveItem(itemToMove.id, destination).subscribe({
				next: () => {
					// Refresh the folder list to update the tree
					this.fileManagerService.getAllFolders().subscribe();
					this.fileManagerService.clearItemToMove();
					this.close();
				},
				error: error => {
					console.error('Error moving item:', error);
					this.snackbarService.error(
						`Failed to move "${itemToMove.name}": ${error.message || 'Unknown error'}`
					);
				},
			});
		}
	}
}
