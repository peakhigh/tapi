const express = require('express');
const userRoutes = require('./users');
const authRoutes = require('./auth');
const tripsRoutes = require('./trips');
const trucksRoutes = require('./trucks');
const drivers = require('./drivers');

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

// mount drivers routes at /drivers
router.use('/drivers', drivers);

module.exports = router;
