import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
	selector: 'app-snackbar',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './snackbar.component.html',
	styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
	private snackbarService = inject(SnackbarService);

	messages = computed(() => this.snackbarService.messages());

	removeMessage(id: string) {
		this.snackbarService.remove(id);
	}

	getMessageClasses(type: string): string {
		const baseClasses = 'cursor-pointer';

		switch (type) {
			case 'success':
				return `${baseClasses} bg-green-500 text-white`;
			case 'error':
				return `${baseClasses} bg-red-500 text-white`;
			case 'warning':
				return `${baseClasses} bg-yellow-500 text-white`;
			case 'info':
			default:
				return `${baseClasses} bg-blue-500 text-white`;
		}
	}

	getIconClasses(type: string): string {
		switch (type) {
			case 'success':
				return 'fa-solid fa-check-circle';
			case 'error':
				return 'fa-solid fa-exclamation-circle';
			case 'warning':
				return 'fa-solid fa-exclamation-triangle';
			case 'info':
			default:
				return 'fa-solid fa-info-circle';
		}
	}
}
