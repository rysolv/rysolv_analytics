import { getUserRepos } from '../integrations/index.js';
import { analyzeRepo } from './analyzeRepo.js';
import { pool } from '../db/index.js';

export async function analyzeUser({ username, cleanup, userId }) {
	console.log(`Analyzing ${username}`);
	const repos = await getUserRepos({ username });

	console.log(`Reviewing ${repos.length} repos`);

	for (const repo of repos) {
		await analyzeRepo({ repo, cleanup });
	}
	pool.end();
}
