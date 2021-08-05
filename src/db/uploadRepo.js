import { pool } from './connect';
import { v4 as uuidv4 } from 'uuid';

export async function uploadRepo({ gitHistory, repo }) {
	for (const commit of gitHistory) {
		const client = await pool.connect();
		await insertCommit({ client, commit, repo });
		client.release();
	}
}

async function insertCommit({ client, commit, repo }) {
	try {
		await client.query('BEGIN');
		const commitId = uuidv4();

		const values = [
			commitId,
			commit.authorEmail,
			commit.authorName,
			commit.body,
			commit.commitDate,
			commit.commitHash,
			commit.committerEmail,
			commit.committerName,
			new Date(),
			repo,
			commit.signerKey,
			commit.signer,
			commit.subject,
		];

		const commitQuery = `
            INSERT INTO git_commits (
                id, 
                author_email,
                author_name,
                body,
                commit_date,
                commit_hash,
                committer_email,
                committer_name,
                created_date,
                repo_path,
                signer_key,
                signer,
                subject
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
			ON CONFLICT (commit_hash) DO UPDATE SET id = git_commits.id 
			RETURNING id;
        `;

		const { rows } = await client.query(commitQuery, values);

		const fileQuery = `
            INSERT INTO git_files (
                id, 
                commit_id,
                additions,
                deletions,
                file_name
            ) VALUES ($1, $2, $3, $4, $5)
			ON CONFLICT(commit_id, file_name) DO NOTHING
        `;

		await Promise.all(
			commit.files.map(async (el) => {
				const values = [
					uuidv4(),
					rows[0].id,
					el.additions,
					el.deletions,
					el.fileName,
				];
				await client.query(fileQuery, values);
			})
		);

		await client.query('COMMIT');
	} catch (error) {
		await client.query('ROLLBACK');
		console.log('Insert Error');
		console.log(commit);
		console.log(error);
	}
}
