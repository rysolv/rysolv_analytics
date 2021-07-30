import { exec, listFiles } from '../helpers';
import { parseGitLog, parseGitCommit } from '../parsers';

/**
 * @analyzeRepo
 * - Pull down targer repo
 * - Pull git log
 * - Parse each commit in git log
 * 
 * Example return: 
 * [{
		commit: 'a8890f6e17871dda1896c919d6f46be23ee1a93c',
		author: 'Anna Pojawis <annapojawis@gmail.com>',
		date: 'Sat Jul 24 16:01:29 2021 -0400',
		message: 'Create CompanyRecruitment container and adjust styling on the CompanyRecruitment component',
		filesChanged: [
			{
				additions: '9',
				deletions: '9',
				filename: 'app/components/CompanyRecruitment/styledComponents.js'
			},
		]
	},]
*/

export async function analyzeRepo({ repo }) {
	/**
	 * change up the logic here
	 * Move the exec calls out of this function and into the helpers.
	 * The parsers won't be pure parsers anymore. Sine they are dependent on the format.
	 * So makes sense to group them with the exec call
	 * Make fetch repo a helper
	 *
	 * fetch repo
	 * parse git log
	 * parse git commits
	 * return data
	 */

	const repoName = repo.split('/')[1];

	if (!listFiles({ dir: '/git' }).includes(repoName)) {
		console.log(`Fetching ${repo}...`);
		await exec({
			cmd: `git clone https://github.com/${repo}.git`,
			dir: '/git',
		});
	} else {
		console.log('Pulling latest changes');
		await exec({
			cmd: `git pull`,
			dir: `/git/${repoName}`,
		});
	}

	// Fetch Git Log from repo and parse into array
	const commitArray = await parseGitLog(repoName);

	console.log(commitArray);
	console.log(`Reviewing ${commitArray.length} commits in ${repo}`);

	// const gitHistory = await Promise.all(
	// 	logArray.map(async (el) => {
	// 		const raw = await exec({
	// 			cmd: `git show ${el.commit} --numstat`,
	// 			dir: `/git/${repoName}`,
	// 		});
	// 		try {
	// 			const commits = parseGitCommit({ raw, commit: el });
	// 			// If condition to catch failing commits
	// 			// Part of the multi-line commit error
	// 			if (commits) {
	// 				return { ...el, filesChanged: commits };
	// 			}
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	})
	// );

	// // Bad code. Shouldn't need this filer
	// // But needed to move past this issue
	// const newHistory = gitHistory.filter((el) => el != undefined);

	// console.log(`Reviewed ${newHistory.length} commits. `);
	// if (newHistory.length < logArray.length) {
	// 	console.log(
	// 		`${logArray.length - newHistory.length} lost in translation`
	// 	);
	// }
	// console.log(newHistory);
	// return newHistory;
}
