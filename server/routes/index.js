const express = require('express');
const userRoutes = require('./user');
const authRoutes = require('./auth');
const tripsRoutes = require('./trips');
const trucksRoutes = require('./trucks');

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

module.exports = router;
