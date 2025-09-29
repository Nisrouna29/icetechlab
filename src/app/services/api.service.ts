import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface ApiItem {
	id: string;
	parentId: string | null;
	name: string;
	folder: boolean;
	creation: string;
	modification: string;
	filePath?: string;
	mimeType?: string;
	size?: number;
}

export interface ApiResponse {
	items?: ApiItem[];
	item?: ApiItem;
	successful?: ApiItem[];
	failed?: Array<{
		filename: string;
		error: string;
		message: string;
	}>;
	code?: string;
	desc?: string;
	message?: string;
}

export interface CreateFolderRequest {
	name: string;
	folder: boolean;
	parentId?: string;
}

export interface UpdateItemRequest {
	name?: string;
	parentId?: string | null;
}

export interface DirectoryUploadItem {
	file: File;
	relativePath: string;
	folderPath: string[];
}

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	private readonly baseUrl = 'http://localhost:3001/api';

	constructor(private http: HttpClient) {}

	/**
	 * Get items (files and folders) from a specific parent folder
	 * @param parentId - Parent folder ID (null for root)
	 */
	getItems(parentId?: string | null): Observable<ApiItem[]> {
		let params = new HttpParams();
		if (parentId !== undefined && parentId !== null) {
			params = params.set('parentId', parentId);
		}

		return this.http.get<ApiResponse>(`${this.baseUrl}/items`, { params }).pipe(
			map(response => response.items || []),
			catchError(this.handleError)
		);
	}

	/**
	 * Create a new folder
	 * @param name - Folder name
	 * @param parentId - Parent folder ID (optional)
	 */
	createFolder(name: string, parentId?: string): Observable<ApiItem> {
		const body: CreateFolderRequest = {
			name: name.trim(),
			folder: true,
		};

		if (parentId) {
			body.parentId = parentId;
		}

		return this.http.post<ApiResponse>(`${this.baseUrl}/items`, body).pipe(
			map(response => response.item!),
			catchError(this.handleError)
		);
	}

	/**
	 * Upload files to a specific folder
	 * @param files - Array of files to upload
	 * @param parentId - Parent folder ID (optional)
	 */
	uploadFiles(files: File[], parentId?: string): Observable<ApiResponse> {
		const formData = new FormData();

		// Add files to FormData
		files.forEach(file => {
			formData.append('files', file);
		});

		// Add parentId if provided
		if (parentId) {
			formData.append('parentId', parentId);
		}

		return this.http
			.post<ApiResponse>(`${this.baseUrl}/items`, formData)
			.pipe(catchError(this.handleError));
	}

	/**
	 * Upload a single file to a specific folder
	 * @param file - Single file to upload
	 * @param parentId - Parent folder ID (optional)
	 */
	uploadSingleFile(file: File, parentId?: string): Observable<ApiResponse> {
		const formData = new FormData();

		// Add single file to FormData
		formData.append('files', file);

		// Add parentId if provided
		if (parentId) {
			formData.append('parentId', parentId);
		}

		return this.http
			.post<ApiResponse>(`${this.baseUrl}/items`, formData)
			.pipe(catchError(this.handleError));
	}

	/**
	 * Download a file
	 * @param itemId - File ID
	 */
	downloadFile(itemId: string): Observable<Blob> {
		return this.http
			.get(`${this.baseUrl}/items/${itemId}`, {
				responseType: 'blob',
			})
			.pipe(catchError(this.handleError));
	}

	/**
	 * Delete an item (file or folder)
	 * @param itemId - Item ID
	 */
	deleteItem(itemId: string): Observable<void> {
		return this.http.delete(`${this.baseUrl}/items/${itemId}`).pipe(
			map(() => void 0),
			catchError(this.handleError)
		);
	}

	/**
	 * Update an item (rename or move)
	 * @param itemId - Item ID
	 * @param updates - Update data
	 */
	updateItem(itemId: string, updates: UpdateItemRequest): Observable<ApiItem> {
		return this.http
			.patch<ApiItem>(`${this.baseUrl}/items/${itemId}`, updates)
			.pipe(catchError(this.handleError));
	}

	/**
	 * Get the path to an item
	 * @param itemId - Item ID
	 */
	getItemPath(itemId: string): Observable<ApiItem[]> {
		return this.http
			.get<ApiResponse>(`${this.baseUrl}/items/${itemId}/path`)
			.pipe(
				map(response => response.items || []),
				catchError(this.handleError)
			);
	}

	/**
	 * Rename an item
	 * @param itemId - Item ID
	 * @param newName - New name
	 */
	renameItem(itemId: string, newName: string): Observable<ApiItem> {
		return this.updateItem(itemId, { name: newName });
	}

	/**
	 * Move an item to a different folder
	 * @param itemId - Item ID
	 * @param newParentId - New parent folder ID (null for root)
	 */
	moveItem(itemId: string, newParentId: string | null): Observable<ApiItem> {
		return this.updateItem(itemId, { parentId: newParentId });
	}

	/**
	 * Get all folders for navigation (used in move modal, etc.)
	 */
	getAllFolders(): Observable<ApiItem[]> {
		return this.getItems().pipe(
			map(items => items.filter(item => item.folder))
		);
	}

	/**
	 * Get folder hierarchy for breadcrumb navigation
	 * @param itemId - Current item ID
	 */
	getFolderHierarchy(itemId: string): Observable<ApiItem[]> {
		return this.getItemPath(itemId);
	}

	/**
	 * Format file size for display
	 * @param bytes - File size in bytes
	 */
	formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B';

		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	/**
	 * Get file icon based on mime type or file extension
	 * @param item - API item
	 */
	getFileIcon(item: ApiItem): string {
		if (item.folder) {
			return 'fa-solid fa-folder';
		}

		const mimeType = item.mimeType || '';
		const fileName = item.name.toLowerCase();

		// Image files
		if (
			mimeType.startsWith('image/') ||
			/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/.test(fileName)
		) {
			return 'fa-solid fa-file-image';
		}

		// Video files
		if (
			mimeType.startsWith('video/') ||
			/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/.test(fileName)
		) {
			return 'fa-solid fa-file-video';
		}

		// Audio files
		if (
			mimeType.startsWith('audio/') ||
			/\.(mp3|wav|flac|aac|ogg)$/.test(fileName)
		) {
			return 'fa-solid fa-file-audio';
		}

		// Document files
		if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
			return 'fa-solid fa-file-pdf';
		}

		if (
			mimeType.includes('wordprocessingml') ||
			/\.(doc|docx)$/.test(fileName)
		) {
			return 'fa-solid fa-file-word';
		}

		if (mimeType.includes('spreadsheetml') || /\.(xls|xlsx)$/.test(fileName)) {
			return 'fa-solid fa-file-excel';
		}

		if (mimeType.includes('presentationml') || /\.(ppt|pptx)$/.test(fileName)) {
			return 'fa-solid fa-file-powerpoint';
		}

		// Archive files
		if (/\.(zip|rar|7z|tar|gz)$/.test(fileName)) {
			return 'fa-solid fa-file-zipper';
		}

		// Text files
		if (
			mimeType.startsWith('text/') ||
			/\.(txt|md|json|xml|html|css|js|ts)$/.test(fileName)
		) {
			return 'fa-solid fa-file-lines';
		}

		// Default file icon
		return 'fa-solid fa-file';
	}

	/**
	 * Get file color based on type
	 * @param item - API item
	 */
	getFileColor(item: ApiItem): string {
		if (item.folder) {
			return 'text-yellow-500';
		}

		const mimeType = item.mimeType || '';
		const fileName = item.name.toLowerCase();

		// Image files
		if (
			mimeType.startsWith('image/') ||
			/\.(jpg|jpeg|png|gif|bmp|svg|webp)$/.test(fileName)
		) {
			return 'text-green-500';
		}

		// Video files
		if (
			mimeType.startsWith('video/') ||
			/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/.test(fileName)
		) {
			return 'text-purple-500';
		}

		// Audio files
		if (
			mimeType.startsWith('audio/') ||
			/\.(mp3|wav|flac|aac|ogg)$/.test(fileName)
		) {
			return 'text-pink-500';
		}

		// Document files
		if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
			return 'text-red-500';
		}

		if (
			mimeType.includes('wordprocessingml') ||
			/\.(doc|docx)$/.test(fileName)
		) {
			return 'text-blue-600';
		}

		if (mimeType.includes('spreadsheetml') || /\.(xls|xlsx)$/.test(fileName)) {
			return 'text-green-600';
		}

		if (mimeType.includes('presentationml') || /\.(ppt|pptx)$/.test(fileName)) {
			return 'text-orange-500';
		}

		// Archive files
		if (/\.(zip|rar|7z|tar|gz)$/.test(fileName)) {
			return 'text-yellow-600';
		}

		// Text files
		if (
			mimeType.startsWith('text/') ||
			/\.(txt|md|json|xml|html|css|js|ts)$/.test(fileName)
		) {
			return 'text-gray-600';
		}

		// Default color
		return 'text-gray-500';
	}

	/**
	 * Handle HTTP errors
	 * @param error - HTTP error
	 */
	private handleError(error: any): Observable<never> {
		console.error('API Error:', error);

		let errorMessage = 'An error occurred';

		if (error.error) {
			if (typeof error.error === 'string') {
				errorMessage = error.error;
			} else if (error.error.desc) {
				errorMessage = error.error.desc;
			} else if (error.error.message) {
				errorMessage = error.error.message;
			}
		} else if (error.message) {
			errorMessage = error.message;
		}

		return throwError(() => new Error(errorMessage));
	}
}
