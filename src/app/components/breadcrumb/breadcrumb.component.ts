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
	selector: 'app-breadcrumb',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './breadcrumb.component.html',
	styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
	private fileManagerService = inject(FileManagerService);

	// Inputs
	@Input() viewMode: 'grid' | 'list' = 'grid';

	// Outputs
	@Output() onNavigateToRoot = new EventEmitter<void>();
	@Output() onNavigateToPath = new EventEmitter<string[]>();
	@Output() onNavigateBack = new EventEmitter<void>();
	@Output() onNavigateForward = new EventEmitter<void>();
	@Output() onRefresh = new EventEmitter<void>();
	@Output() onToggleViewMode = new EventEmitter<void>();
	@Output() onSetViewMode = new EventEmitter<'grid' | 'list'>();

	// Computed signals
	breadcrumbPath = computed(() => this.fileManagerService.breadcrumbPath());
	canGoBack = computed(() => this.fileManagerService.canGoBack());
	canGoForward = computed(() => this.fileManagerService.canGoForward());

	navigateToRoot() {
		this.onNavigateToRoot.emit();
	}

	navigateToPath(path: string[]) {
		this.onNavigateToPath.emit(path);
	}

	navigateBack() {
		this.onNavigateBack.emit();
	}

	navigateForward() {
		this.onNavigateForward.emit();
	}

	refresh() {
		this.onRefresh.emit();
	}

	toggleViewMode() {
		this.onToggleViewMode.emit();
	}

	setViewMode(mode: 'grid' | 'list') {
		this.onSetViewMode.emit(mode);
	}
}
