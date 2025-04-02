const express = require('express');
const router = express.Router();

const projectRoutes = require('./projectsRoutes');
const calculateRoutes = require('./calculateRoutes');
const userRoutes = require('./userRoutes');

router.use('/projects', projectRoutes);
router.use('/calculate', calculateRoutes);
router.use('/users', userRoutes);

module.exports = router;
