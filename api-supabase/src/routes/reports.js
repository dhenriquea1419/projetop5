const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/sales', authenticateToken, reportController.getSalesReport);
router.get('/products', authenticateToken, reportController.getProductSalesReport);
router.get('/inventory', authenticateToken, reportController.getInventoryReport);
router.get('/clients', authenticateToken, reportController.getClientReport);

module.exports = router;
