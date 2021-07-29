import arg from 'arg';
import inquirer from 'inquirer';
import router from './router';

function parseArgumentsIntoOptions(rawArgs) {
	const args = arg(
		{
			'--nuke': Boolean,
			'--repo': Boolean,
			'--user': Boolean,
			// abbreviations reference above
			'-n': '--nuke',
			'-r': '--repo',
			'-u': '--user',
		},
		{
			argv: rawArgs.slice(2),
		}
	);
	return {
		nuke: args['--nuke'] || false,
		repo: args['--repo'] || false,
		target: args._[0],
		user: args['--user'] || false,
	};
}

async function promptInitialAction() {
	const answer = await inquirer.prompt({
		choices: ['analyze user', 'analyze repo', 'nuke'],
		default: 'analyze user',
		message: 'What would you kike to do?',
		name: 'action',
		type: 'list',
	});

	return answer.action;
}

async function promptForMissingOptions(options) {
	const questions = [];
	if (!options.repo && !options.user) {
		questions.push({
			choices: ['user', 'repo'],
			default: 'User',
			message: 'Analyze a user or repo',
			name: 'target',
			type: 'list',
		});
	}

	if (options.repo && options.user) {
		options.repo = false;
		options.user = false;
		questions.push({
			choices: ['user', 'repo'],
			default: 'User',
			message: '[input error] Must select either repo or user: ',
			name: 'target',
			type: 'list',
		});
	}

	const answers = await inquirer.prompt(questions);
	return {
		...options,
		repo: answers.target == 'repo',
		user: answers.target == 'user',
	};
}

export async function cli(args) {
	let options = parseArgumentsIntoOptions(args);
	const result = await promptInitialAction();
	console.log(result);
	// options = await promptForMissingOptions(options);

	await router(options);
}
