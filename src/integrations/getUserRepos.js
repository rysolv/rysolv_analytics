import { Octokit } from '@octokit/rest';
import { createTokenAuth } from '@octokit/auth-token';

export async function getUserRepos({ username }) {
	// Connect to Octokit API
	const auth = createTokenAuth(process.env.GITHUB_TOKEN);
	const { token } = await auth();
	const GITHUB = new Octokit({
		auth: token,
	});

	// Fetch user repos
	const { data } = await GITHUB.repos.listForUser({
		username,
		per_page: 100,
		type: 'all',
	});

	// Fetch user repos
	const { data: orgData } = await GITHUB.orgs.listForUser({
		username,
		type: 'all',
	});

	console.log(orgData);
	const repos = [];
	for (const repo of data) {
		console.log(repo.full_name);
		if (!repo.fork) {
			repos.push(repo.full_name);
		}
	}

	// console.log(repos);

	return repos;
}
