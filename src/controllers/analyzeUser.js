import fetch from 'node-fetch';
import { getUserRepos } from '../integrations/index.js';
import { analyzeRepo } from './analyzeRepo.js';
import {
	getUserById,
	insertAnalyticsHistory,
	insertRepo,
	updateUserLanguageCount,
} from '../db/index.js';

const production = process.env.NODE_ENV === 'production';
const api = production ? process.env.API : process.env.API_LOCAL;

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

	const history = {
		commits: 0,
		errors: [],
		files: 0,
		repos: repos.length,
		userId,
	};

	// Parse each repo and save to db
	for (const { full_name, id, html_url } of repos) {
		try {
			// Add repos to git_repos
			const { id: repoId } = await insertRepo({
				full_name,
				id,
				html_url,
			});

			// Parse git commits for repo
			const commits = await analyzeRepo({
				cleanup,
				history,
				repo: full_name,
				repoId,
				user,
			});

			// Log number of commit/file additions
			history.commits += commits.length;
			commits.map((commit) => {
				history.files += commit.files.length;
			});
		} catch (error) {
			console.log(error);
			history.errors.push(error);
		}
	}

	// Parse user commits and summarize languages
	await updateUserLanguageCount({ userId });

	const t2 = Date.now();

	// Log results to analytics history table
	history.time = t2 - t1;
	await insertAnalyticsHistory(history);
	console.log(history);

	if (userId) {
		console.log('Making api request');

		// Call API to update user profile
		const query = `
			mutation {
				updateUserProfile(userId: "${userId}") {
					__typename
					... on Success {
						message
					}
					... on Error {
						message
					}
				}
			}
		`;

		const requestOptions = {
			body: JSON.stringify({ query }),
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
		};
		const url = api;
		fetch(url, requestOptions);
	}

	console.log('Done');
}
