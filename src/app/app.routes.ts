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
		path: '**',
		loadComponent: () =>
			import('./components/file-explorer/file-explorer.component').then(
				m => m.FileExplorerComponent
			),
	},
];
