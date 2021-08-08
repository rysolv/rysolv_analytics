import { getUserRepos } from '../integrations/index.js';
import { analyzeRepo } from './analyzeRepo.js';
import { pool, getUserById } from '../db/index.js';

export async function analyzeUser({ cleanup, username, userId }) {
	const t1 = Date.now();
	const user = {
		username,
		userId,
	};

	if (userId) {
		const { githubUsername, userEmails } = await getUserById({ userId });
		user.username = githubUsername;
		user.emails = userEmails;
	}

	console.log(`Analyzing ${user.username}`);
	const repos = await getUserRepos({ username: user.username });
	console.log(`Reviewing ${repos.length} repos`);

	for (const repo of repos) {
		await analyzeRepo({ repo, cleanup, user });
	}
	pool.end();
	const t2 = Date.now();
	console.log(`Finished in  ${t2 - t1}ms`);
}
