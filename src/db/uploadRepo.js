import { pool } from './connect';
import { v4 as uuidv4 } from 'uuid';

export async function uploadRepo({ gitHistory, repo }) {
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		const commitId = uuidv4();

		const values = [
			commitId,
			gitHistory.authorEmail,
			gitHistory.authorName,
			gitHistory.body,
			gitHistory.commitDate,
			gitHistory.commitHash,
			gitHistory.committerEmail,
			gitHistory.committerName,
			new Date(),
			repo,
			gitHistory.signerKey,
			gitHistory.signer,
			gitHistory.subject,
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
        `;

		await client.query(commitQuery, values);

		const fileQuery = `
            INSERT INTO git_files (
                id, 
                commit_id,
                additions,
                deletions,
                file_name
            ) VALUES ($1, $2, $3, $4, $5)
        `;

		await Promise.all(
			gitHistory.files.map(async (el) => {
				const values = [
					uuidv4(),
					commitId,
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
		console.log('Upload Error');
		console.log(gitHistory);
		console.log(error);
	} finally {
		return client.release();
	}
}
