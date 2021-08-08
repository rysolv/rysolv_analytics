import express from 'express';
import { analyzeUser } from '../controllers/index.js';

const router = express.Router();
router.post('/analyze', (req, res, next) => {
	const { userId } = req.body;
	analyzeUser({ userId, cleanup: true });

	return res.sendStatus(200);
});

export default router;
