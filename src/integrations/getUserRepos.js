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
	// 100 most recently updated
	const { data } = await GITHUB.repos.listForUser({
		per_page: 100,
		sort: 'updated',
		type: 'all',
		username,
	});

	const repos = [];
	// @TODO upload repos to git_repos
	for (const repo of data) {
		repos.push(repo.full_name);
	}

	// Fetch user Organizations
	const { data: orgData } = await GITHUB.orgs.listForUser({
		username,
		type: 'all',
	});

	for (const org of orgData) {
		// @TODO: upload org to git_orgs
		const { data: repoData } = await GITHUB.repos.listForOrg({
			org: org.login,
		});

		for (const repo of repoData) {
			repos.push(repo.full_name);
		}
	}

	return repos;
}
