import express from 'express';
import { analyzeUser } from '../controllers';

const router = express.Router();
router.post('/analyze', (req, res, next) => {
	console.log(req.body);
	// analyzeUser({ userId: '12345', cleanup: true });

	return res.send(200);
});

export default router;
