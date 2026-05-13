const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authenticateToken, productController.create);
router.put('/:id', authenticateToken, productController.update);
router.delete('/:id', authenticateToken, productController.delete);
router.patch('/:id/stock', authenticateToken, productController.updateStock);

module.exports = router;
