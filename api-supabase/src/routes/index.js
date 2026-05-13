const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const categoryRoutes = require('./categories');
const productRoutes = require('./products');
const clientRoutes = require('./clients');
const orderRoutes = require('./orders');
const reportRoutes = require('./reports');

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/clients', clientRoutes);
router.use('/orders', orderRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
