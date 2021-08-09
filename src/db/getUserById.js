import { singleQuery } from './connect.js';

export async function getUserById({ userId }) {
	const queryText = `
        SELECT 
            u.github_username,
            array_agg(ue.email) AS "userEmails"
        FROM users u
        JOIN user_emails ue ON u.id = ue.user_id
        WHERE u.id = $1
        GROUP BY u.github_username
    `;

	const { rows } = await singleQuery({ queryText, values: [userId] });
	console.log(rows);
	const [user] = rows;
	return user;
}
