import { exec, listFiles } from '../helpers';

export async function clean() {
	if (!listFiles({ dir: '/git' }).length) {
		console.log('Folder is already empty');
	} else {
		console.log('Clearing ./git contents');
		await exec({ cmd: 'rm -r ./*', dir: '/git' });
		console.log('Done!');
	}
}
