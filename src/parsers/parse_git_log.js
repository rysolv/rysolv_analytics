const { exec } = require('child_process');

export async function git_log(dir) {
	exec('git log --no-merges --decorate=no', { cwd: dir }, (err, stdout) => {
		console.log(stdout);
		const string = stdout.replace(/commit/g, `${hash}commit`);
		const array = string.split(hash);
		array.shift();
		console.log(array);

		if (err) {
			console.log(err);
		}
	});
}

export function parse_git_log(log) {
	const hash = '&#^3@9(^123-(*&!';
	const string = log.replace(/commit/g, `${hash}commit`);
	const array = string.split(hash);
	array.shift();
	return array;
}
