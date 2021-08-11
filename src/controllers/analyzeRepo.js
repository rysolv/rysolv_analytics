import {
	deleteRepo,
	fetchRepo,
	parseGitCommit,
	parseGitLog,
} from '../parsers/index.js';
import { uploadRepo } from '../db/index.js';

/**
 * Takes @repo (ex: rysolv/rysolv, tylermaran/izac) and returns:
 * [{
		committerName: 'Anna Pojawis',
		committerEmail: 'annapojawis@gmail.com',
		authorName: 'Anna Pojawis',
		authorEmail: 'annapojawis@gmail.com',
		commitHash: '6b8bf7d06d1358bcad252b987c418b2a71a764b0',
		date: '2021-07-25T15:38:22-04:00',
		subject: 'Make CompanyRecruitment mobile friendly',
		body: '',
		signer: '',
		signerKey: '',
		files: [
			{
			additions: '1',
			deletions: '1',
			filename: 'app/components/CompanyRecruitment/index.jsx'
			},
		]
	},]
*/

export async function analyzeRepo({ cleanup, repo, repoId, user }) {
	const repoName = repo.split('/')[1];

	// Clone repo || pull down changes
	await fetchRepo({ repo });

	// Fetch Git Log from repo and parse into array
	const commitArray = await parseGitLog({
		repoName,
		userId: user.userId,
		emails: user.emails,
	});
	console.log(`\nReviewing ${commitArray.length} commits in ${repo}`);

	// Fetch file change data from each commit
	const gitHistory = await Promise.all(
		commitArray.map(async (el) => {
			return {
				...el,
				files: await parseGitCommit({ hash: el.commitHash, repoName }),
			};
		})
	);

	// Save commit & updated files into db
	await uploadRepo({ gitHistory, repoId });
	console.log(`Uploaded ${repoName}`);

	if (cleanup) deleteRepo({ repoName });
	return gitHistory;
}
