import { exec } from '../helpers';

export function nuke() {
	// Clears the Git folder
	console.log('Deleting Git contents');
	console.log(__dirname);
	exec({ command: 'rm', dir: '/git/*' });
}
