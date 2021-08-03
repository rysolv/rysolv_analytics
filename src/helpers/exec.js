import { exec as execute } from 'child_process';
import path from 'path';
import util from 'util';

const root = path.resolve('./');
const exec_promise = util.promisify(execute);

export async function exec({ cmd, dir }) {
	try {
		const { stderr, stdout } = await exec_promise(cmd, { cwd: root + dir });
		if (stderr) console.log(stderr);
		return stdout;
	} catch (error) {
		console.log(Object.keys(error));
		console.log(error.code);
		console.log(error.cmd);
	}
}
