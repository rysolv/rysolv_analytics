import { exec, listFiles } from '../helpers';

export function clean() {
	if (!listFiles({ dir: '/git' }).length) {
		console.log('Folder is already empty');
	} else {
		exec({ cmd: 'rm -r ./*', dir: '/git' });
		console.log('Cleared ./git contents');
	}
}
