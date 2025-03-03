import { v4 as uuidv4 } from 'uuid';
import { pool } from './connect.js';

export async function uploadRepo({ gitHistory, repoId }) {
	for (const commit of gitHistory) {
		const client = await pool.connect();
		await insertCommit({ client, commit, repoId });
		client.release();
	}
}

async function insertCommit({ client, commit, repoId }) {
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
			repoId,
			commit.signerKey,
			commit.signer,
			commit.subject,
			commit.userId,
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
                repo_id,
                signer_key,
                signer,
                subject,	
				user_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
			ON CONFLICT (commit_hash) DO UPDATE SET 
				id = git_commits.id, 
				user_id = coalesce(git_commits.user_id, EXCLUDED.user_id)
			RETURNING id;
        `;

		const { rows } = await client.query(commitQuery, values);

		const fileQuery = `
            INSERT INTO git_files (
                id, 
                commit_id,
                additions,
                deletions,
				file_extension,
                file_name,
				language
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
			ON CONFLICT(commit_id, file_name) DO NOTHING
        `;

		await Promise.all(
			commit.files.map(async (el) => {
				const values = [
					uuidv4(),
					rows[0].id,
					el.additions,
					el.deletions,
					el.fileExtension,
					el.fileName,
					el.language,
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
