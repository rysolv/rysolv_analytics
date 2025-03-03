import { exec, listFiles } from '../helpers/index.js';

export async function fetchRepo({ repo }) {
	const repoName = repo.split('/')[1];

	if (!listFiles({ dir: '/git' }).includes(`${repoName}.git`)) {
		console.log(`Fetching ${repo}...`);
		await exec({
			cmd: `git clone --bare https://github.com/${repo}.git`,
			dir: '/git',
		});
	} else {
		console.log('Pulling latest changes...');
		await exec({
			cmd: `git fetch`,
			dir: `/git/${repoName}.git`,
		});
	}
	console.log(`${repo} up to date.`);
}
