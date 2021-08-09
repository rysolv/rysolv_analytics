import { getUserRepos } from '../integrations/index.js';
import { analyzeRepo } from './analyzeRepo.js';
import { pool, getUserById, updateUserLanguageCount } from '../db/index.js';

export async function analyzeUser({ cleanup, username, userId }) {
	const t1 = Date.now();
	const user = {
		username,
		userId,
	};

	if (userId) {
		const { github_username, userEmails } = await getUserById({ userId });
		user.username = github_username;
		user.emails = userEmails;
	}

	// Pull User repos (includes forks and orgs)
	const repos = await getUserRepos({ username: user.username });
	console.log(`Analyzing ${user.username}`);
	console.log(`Reviewing ${repos.length} repos`);

	// Parse each repo and save to db
	for (const repo of repos) {
		await analyzeRepo({ repo, cleanup, user });
	}

	// Parse user commits and summarize languages
	await updateUserLanguageCount({ userId });

	pool.end();
	const t2 = Date.now();
	console.log(`Finished in  ${t2 - t1}ms`);
}
