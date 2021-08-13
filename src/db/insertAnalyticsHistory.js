import { singleQuery } from './connect.js';

export async function insertAnalyticsHistory({
	commits,
	errors,
	files,
	repos,
	time,
	userId,
}) {
	const values = [commits, new Date(), errors, files, repos, time, userId];
	const queryText = `
	    INSERT INTO analytics_history (
            commits,
            created_date,
            errors,
            files,
            repos,
			time,
            user_id
        )
        VALUES($1, $2, $3, $4, $5, $6, $7)
	`;

	await singleQuery({
		queryText,
		values,
	});
}
