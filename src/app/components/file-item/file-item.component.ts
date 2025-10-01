import { Component, Input, Output, EventEmitter, inject, computed } from '@angular/core';
import {
	FileManagerService,
	FileItem,
} from '../../services/file-manager.service';

@Component({
	selector: 'app-file-item',
	standalone: true,
	templateUrl: './file-item.component.html',
	styleUrl: './file-item.component.scss',
})
export class FileItemComponent {
	@Input({ required: true }) file!: FileItem;
	@Input() viewMode: 'grid' | 'list' = 'grid';
	@Input() isSelected: boolean = false;

	@Output() onClick = new EventEmitter<FileItem>();
	@Output() onAction = new EventEmitter<{ action: string; file: FileItem }>();

	private fileManagerService = inject(FileManagerService);

	// Computed signal to get the folder count
	folderCount = computed(() => {
		if (this.file.type === 'folder') {
			const counts = this.fileManagerService.folderItemCounts();
			return counts.get(this.file.id) || 0;
		}
		return 0;
	});

	// Computed signal to get the display text for folder count
	folderCountText = computed(() => {
		const count = this.folderCount();
		if (count === 0) return 'Empty';
		if (count === 1) return '1 item';
		return `${count} items`;
	});

	onItemClick(event: MouseEvent) {
		// Don't handle click if it's on action buttons
		if ((event.target as HTMLElement).closest('button')) {
			return;
		}

		this.onClick.emit(this.file);
	}
}
