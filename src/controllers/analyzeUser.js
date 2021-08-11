import { getUserRepos } from '../integrations/index.js';
import { analyzeRepo } from './analyzeRepo.js';
import {
	getUserById,
	insertRepo,
	updateUserLanguageCount,
} from '../db/index.js';

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
	console.log(`Analyzing ${user.username} \nReviewing ${repos.length} repos`);

	// Parse each repo and save to db
	for (const { full_name, id, html_url } of repos) {
		const { id: repoId } = await insertRepo({ full_name, id, html_url });
		await analyzeRepo({ cleanup, repo: full_name, repoId, user });
	}

	// Parse user commits and summarize languages
	await updateUserLanguageCount({ userId });

	const t2 = Date.now();
	console.log(`Finished in  ${t2 - t1}ms`);
}
