import { singleQuery } from './connect.js';

export async function updateUserLanguageCount({ userId }) {
	const queryText = `
        WITH language_sum AS (
            SELECT 
                gf.language, 
                SUM(gf.additions * gf.weight), 
                gc.user_id 
            FROM git_commits gc
            JOIN git_files gf ON gf.commit_id = gc.id
            WHERE gc.user_id = $1
            AND language IS NOT null
            GROUP BY gf.language, gc.user_id
        ) 
        INSERT INTO git_languages (user_id, language, line_count)
        SELECT 
            ls.user_id, 
            ls.language, 
            ls.sum 
        FROM language_sum ls
        ON CONFLICT(user_id, language) DO UPDATE 
        SET line_count = EXCLUDED.line_count
    `;

	const { rows } = await singleQuery({ queryText, values: [userId] });
	const [user] = rows;
	return user;
}
