export function parse_git_commit(log) {
	const hash = '&#^3@9(^123-(*&!';
	const string = log.replace(/commit/g, `${hash}commit`);
	const array = string.split(hash);
	array.shift();
	return array;
}
