import { Injectable, signal } from '@angular/core';

export interface SnackbarMessage {
	id: string;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	duration?: number;
}

@Injectable({
	providedIn: 'root',
})
export class SnackbarService {
	private _messages = signal<SnackbarMessage[]>([]);

	messages = this._messages.asReadonly();

	show(
		message: string,
		type: 'success' | 'error' | 'info' | 'warning' = 'info',
		duration: number = 3000
	) {
		const id = Math.random().toString(36).substr(2, 9);
		const snackbarMessage: SnackbarMessage = {
			id,
			message,
			type,
			duration,
		};

		const currentMessages = this._messages();
		this._messages.set([...currentMessages, snackbarMessage]);

		// Auto remove after duration
		setTimeout(() => {
			this.remove(id);
		}, duration);
	}

	remove(id: string) {
		const currentMessages = this._messages();
		const filteredMessages = currentMessages.filter(msg => msg.id !== id);
		this._messages.set(filteredMessages);
	}

	clear() {
		this._messages.set([]);
	}

	// Convenience methods
	success(message: string, duration?: number) {
		this.show(message, 'success', duration);
	}

	error(message: string, duration?: number) {
		this.show(message, 'error', duration);
	}

	info(message: string, duration?: number) {
		this.show(message, 'info', duration);
	}

	warning(message: string, duration?: number) {
		this.show(message, 'warning', duration);
	}
}
