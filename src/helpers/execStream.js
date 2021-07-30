import { exec } from 'child_process';
import path from 'path';

const root = path.resolve('./');

export function execStream({ cmd, dir }) {
	const stream = exec(cmd, { cwd: root + dir });
	return stream;
}
