import { exec, listFiles } from '../helpers/index.js';

export async function deleteRepo({ repoName }) {
	if (!listFiles({ dir: '/git' }).includes(repoName)) {
		console.log('Repo not found in /git');
	} else {
		console.log('Clearing ./git contents');
		await exec({ cmd: `rm -r ${repoName}.git`, dir: '/git' });
		console.log(`Removed ${repoName}`);
	}
}
