import { execStream } from '../helpers/index.js';

// @TODO I can just replace this with git log --numstat and not need to loop through everything
export async function parseGitLog(repoName) {
	// Any random key
	const hash = '&#^3@9(^123-(*&!';
	const endHash = '19p238asd9pc(&Y#@';
	const array = [];

	// Pull formatted git logs
	const stream = execStream({
		cmd: `git log --no-merges --pretty=format:"%cN${hash}%ce${hash}%aN${hash}%ae${hash}%H${hash}%aI${hash}%s${hash}%b${hash}%GS${hash}%GK${endHash}"`,
		dir: `/git/${repoName}`,
	});

	// Format commits and append to array
	stream.stdout.on('data', (data) => {
		// Split each chunk at end of commit line
		const commitArray = data.split(endHash);
		for (let i = 0; i < commitArray.length; i++) {
			if (commitArray[i] !== '') {
				// Split at hash and trim each value
				const values = commitArray[i]
					.split(hash)
					.map((el) => el.trim());

				if (values.length === 10) {
					array.push({
						authorEmail: values[3],
						authorName: values[2],
						body: values[7],
						commitDate: values[5],
						commitHash: values[4],
						committerEmail: values[1],
						committerName: values[0],
						signer: values[8],
						signerKey: values[9],
						subject: values[6],
					});
				}
			}
		}
	});

	// Resolv when stream closes
	return new Promise((resolve, reject) => {
		stream.on('close', () => {
			resolve(array);
		});
		stream.stderr.on('data', (data) => {
			console.log('stderr: ' + data.toString());
		});
		stream.on('error', (error) => {
			console.log(error);
			reject();
		});
	});
}
