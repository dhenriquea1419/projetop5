const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/', authenticateToken, clientController.getAll);
router.get('/:id', authenticateToken, clientController.getById);
router.post('/', authenticateToken, clientController.create);
router.put('/:id', authenticateToken, clientController.update);
router.delete('/:id', authenticateToken, clientController.delete);

module.exports = router;
