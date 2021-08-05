import { getUserRepos } from '../integrations';
import { analyzeRepo } from './analyzeRepo';
import { pool } from '../db';

export async function analyzeUser({ username }) {
	console.log(`Analyzing ${username}`);
	const repos = await getUserRepos({ username });

	console.log(`Reviewing ${repos.length} repos`);

	for (const repo of repos) {
		await analyzeRepo({ repo });
	}
	pool.end();
}
