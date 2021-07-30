export function parseGitCommit({ raw, commit }) {
	// There is an error here where it is not splitting on the multi-line commits
	const rawFiles = raw.split(commit.message)[1];

	if (rawFiles && rawFiles.length > 0) {
		const fileArray = rawFiles.split('\n');

		return fileArray.reduce((acc, el) => {
			if (el !== '') {
				const stats = el.split('\t');
				if (stats.length === 3) {
					acc.push({
						additions: stats[0].trim(),
						deletions: stats[1].trim(),
						filename: stats[2].trim(),
					});
				}
			}
			return acc;
		}, []);
	}
}
