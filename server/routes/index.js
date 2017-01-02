import express from 'express';
import userRoutes from './user';
import authRoutes from './auth';
import tripsRoutes from './trips';
import trucksRoutes from './trucks';

const router = express.Router();	// eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount user routes at /trips
router.use('/trips', tripsRoutes);

// mount user routes at /trucks
router.use('/trucks', trucksRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

export default router;
