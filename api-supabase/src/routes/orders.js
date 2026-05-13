const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/', authenticateToken, orderController.getAll);
router.get('/:id', authenticateToken, orderController.getById);
router.post('/', authenticateToken, orderController.create);
router.patch('/:id/status', authenticateToken, orderController.updateStatus);
router.delete('/:id', authenticateToken, orderController.delete);

module.exports = router;
