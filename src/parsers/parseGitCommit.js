import { exec, languageList } from '../helpers/index.js';

export async function parseGitCommit({ hash, repoName }) {
	const rawFiles = await exec({
		cmd: `git show ${hash} --numstat --pretty=format:`,
		dir: `/git/${repoName}.git`,
	});

	const resultArray = [];

	if (rawFiles && rawFiles.length > 0) {
		const fileArray = rawFiles.split('\n');
		for (const el of fileArray) {
			if (el !== '') {
				const stats = el.split('\t');
				if (stats.length === 3) {
					const fileName = stats[2];
					const rename = fileName.includes('=>');

					// Split on either '.' or '/' and take the last value
					// Works for: .js, .py, DockerFile, CNAME etc.
					const fileNameArray = fileName.split(/[\/.]/);
					const fileExtension =
						fileNameArray[fileNameArray.length - 1];

					if (!rename) {
						resultArray.push({
							additions: Number(stats[0]) || 0,
							deletions: Number(stats[1]) || 0,
							fileExtension,
							fileName,
							language: languageList[fileExtension] || null,
						});
					}
				}
			}
		}
	}
	return resultArray;
}
