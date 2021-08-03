/* eslint-disable no-console, no-unused-vars */
const { Octokit } = require('@octokit/rest');
const { createTokenAuth } = require('@octokit/auth-token');

// const { connect } = require('../connect');

// Connect to DB
const env = process.argv[2];
// const { singleQuery } = connect(env);

/**
 * Describe what this script does
 */

async function sample() {
	const t1 = Date.now();

	// Connect to Octokit API
	const auth = createTokenAuth('5535c6f88b9688a4cc232d2e0aeceab5335cff44');
	const { token } = await auth();
	const GITHUB = new Octokit({
		auth: token,
	});
	const { data } = await GITHUB.rateLimit.get();
	const { rate } = data;
	const { remaining } = rate;
	console.log(`Remaining requests: ${remaining}`);

	const userData = await GITHUB.activity.listPublicEventsForUser({
		username: 'timothystiles',
		page: 100,
		per_page: 1,
	});
	console.log(userData);
	console.log(userData.length);

	// const repo = await GITHUB.repos.listForUser({
	// 	username: 'tylermaran',
	// });
	// console.log(repo);

	// const singleRepo = await GITHUB.repos.get({
	// 	owner: 'timothystiles',
	// 	repo: 'poly',
	// });
	// console.log(singleRepo);

	const t2 = Date.now();
	console.log(`Finished in  ${t2 - t1}ms`);
	process.exit();
}

sample();
