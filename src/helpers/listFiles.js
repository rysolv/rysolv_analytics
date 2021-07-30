import fs from 'fs';
import path from 'path';

const root = path.resolve('./');

export function listFiles({ dir }) {
	return fs.readdirSync(root + dir);
}
