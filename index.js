import express from 'express';
import {} from 'dotenv/config';

const app = express();
const port = process.env.PORT || 4000;

import userRoutes from './src/routes/index.js';

// Routes
app.get('/', (req, res) => res.status(200).send('pong'));
app.use('/user', userRoutes);

// Not found
app.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

// Error handling
app.use((error, req, res) => {
	res.status(error.status || 500).json({
		error: {
			message: error.message,
		},
	});
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});

export default app;
