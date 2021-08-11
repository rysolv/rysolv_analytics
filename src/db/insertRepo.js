import { singleQuery } from './connect.js';

export async function insertRepo({ full_name, id, html_url }) {
	const queryText = `
	    INSERT INTO git_repos (github_url, github_id, repo_path)
        VALUES($1, $2, $3)
        ON CONFLICT (github_id) DO UPDATE SET id = git_repos.id
        RETURNING id  
	`;

	const { rows } = await singleQuery({
		queryText,
		values: [html_url, id, full_name],
	});
	const [oneRow] = rows;
	return oneRow;
}
