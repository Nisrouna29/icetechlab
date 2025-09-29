import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./components/file-explorer/file-explorer.component').then(
				m => m.FileExplorerComponent
			),
		data: { folderId: null, folderName: 'Home' },
	},
	{
		path: 'documents',
		loadComponent: () =>
			import('./components/file-explorer/file-explorer.component').then(
				m => m.FileExplorerComponent
			),
		data: { folderId: 'documents', folderName: 'Documents' },
	},
	{
		path: 'projects',
		loadComponent: () =>
			import('./components/file-explorer/file-explorer.component').then(
				m => m.FileExplorerComponent
			),
		data: { folderId: 'projects', folderName: 'Projects' },
	},
	{
		path: '**',
		loadComponent: () =>
			import('./components/file-explorer/file-explorer.component').then(
				m => m.FileExplorerComponent
			),
	},
];
