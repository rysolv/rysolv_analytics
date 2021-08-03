import { exec } from '../helpers';

export async function parseGitCommit({ hash, repoName }) {
	const rawFiles = await exec({
		cmd: `git show ${hash} --numstat --pretty=format:`,
		dir: `/git/${repoName}`,
	});

	const resultArray = [];

	if (rawFiles && rawFiles.length > 0) {
		const fileArray = rawFiles.split('\n');
		for (const el of fileArray) {
			if (el !== '') {
				const stats = el.split('\t');
				if (stats.length === 3) {
					resultArray.push({
						additions: Number(stats[0]) || 0,
						deletions: Number(stats[1]) || 0,
						fileName: stats[2].trim(),
					});
				}
			}
		}
	}
	return resultArray;
}
