import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
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
	@Output() onToggleSelection = new EventEmitter<string>();
	@Output() onSelectRange = new EventEmitter<string>();
	@Output() onAction = new EventEmitter<{ action: string; file: FileItem }>();
	@Output() onContextMenu = new EventEmitter<{
		file: FileItem;
		x: number;
		y: number;
	}>();

	onItemClick(event: MouseEvent) {
		// Don't handle click if it's on action buttons
		if ((event.target as HTMLElement).closest('button')) {
			return;
		}

		this.onClick.emit(this.file);
	}
}
