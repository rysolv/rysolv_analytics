import inquirer from 'inquirer';

import { analyzeUser, analyzeRepo, clean } from './controllers/index.js';

async function promptInitialAction() {
	const { action } = await inquirer.prompt({
		choices: ['analyze user', 'analyze repo', 'nuke'],
		default: 'analyze user',
		message: 'What would you like to do?',
		name: 'action',
		type: 'list',
	});

	const additionalInfo = [];
	switch (action) {
		case 'analyze user':
			additionalInfo.push({
				default: 'tylermaran',
				message: 'GitHub username:',
				name: 'username',
				type: 'input',
			});
			// @TODO: upload (y/n)
			break;
		case 'analyze repo':
			additionalInfo.push({
				default: 'rysolv/rysolv',
				message: 'Path to repo (ex: rysolv/rysolv):',
				name: 'repo',
				type: 'input',
			});
			break;
		case 'nuke':
			break;
		default:
			break;
	}
	const { username, repo } = await inquirer.prompt(additionalInfo);
	return { action, username, repo };
}

export async function cli(args) {
	const { action, username, repo } = await promptInitialAction();

	// @TODO: I can definitely combine these two switch statments
	switch (action) {
		case 'analyze user':
			analyzeUser({ username });
			break;
		case 'analyze repo':
			await analyzeRepo({ repo });
			break;
		case 'nuke':
			clean();
			break;
		default:
			break;
	}
}

// Some extra logic for bypassing q&a
// ex: rysolv -u tylermaran
// ex: rysolv --nuke

// import arg from 'arg';

// function parseArgumentsIntoOptions(rawArgs) {
// 	const args = arg(
// 		{
// 			'--nuke': Boolean,
// 			'--repo': Boolean,
// 			'--user': Boolean,
// 			// abbreviations reference above
// 			'-n': '--nuke',
// 			'-r': '--repo',
// 			'-u': '--user',
// 		},
// 		{
// 			argv: rawArgs.slice(2),
// 		}
// 	);
// 	return {
// 		nuke: args['--nuke'] || false,
// 		repo: args['--repo'] || false,
// 		target: args._[0],
// 		user: args['--user'] || false,
// 	};
// }

// async function promptForMissingOptions(options) {
// const questions = [];
// if (!options.repo && !options.user) {
// 	questions.push({
// 		choices: ['user', 'repo'],
// 		default: 'User',
// 		message: 'Analyze a user or repo',
// 		name: 'target',
// 		type: 'list',
// 	});
// }

// if (options.repo && options.user) {
// 	options.repo = false;
// 	options.user = false;
// 	questions.push({
// 		choices: ['user', 'repo'],
// 		default: 'User',
// 		message: '[input error] Must select either repo or user: ',
// 		name: 'target',
// 		type: 'list',
// 	});
// }
// const answers = await inquirer.prompt(questions);
// return {
// 	...options,
// 	repo: answers.target == 'repo',
// 	user: answers.target == 'user',
// };
// }
