const express = require('express');
const userRoutes = require('./user_routes');

const api = express.Router();
api.use('/users', userRoutes);

const router = express.Router();
router.use('/api', api);

module.exports = router;