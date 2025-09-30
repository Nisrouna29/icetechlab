import {
	Component,
	computed,
	inject,
	Input,
	Output,
	EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerService } from '../../services/file-manager.service';

@Component({
	selector: 'app-toolbar',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './toolbar.component.html',
	styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
	private fileManagerService = inject(FileManagerService);

	// Inputs
	@Input() selectedCount: number = 0;

	@Output() onNewFolder = new EventEmitter<void>();

	itemCount = computed(() => this.fileManagerService.files().length);

	showNewFolderModal() {
		this.onNewFolder.emit();
	}

	refresh() {
		this.fileManagerService.refresh();
	}
}
