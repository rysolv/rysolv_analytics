const root = require('path').resolve('./');

const { exec: execute } = require('child_process');

export function exec({ command, dir }) {
	console.log(root + dir);
	execute(command, { cwd: root + dir }, (err, stdout, stderr) => {
		if (err) console.log(err);
		return stdout;
	});
}
