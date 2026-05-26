const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authenticateToken } = require('../middlewares/auth');

const useMock = process.env.USE_MOCK_DB === 'true';
const auth = useMock ? ((req, res, next) => next()) : authenticateToken;

router.get('/', auth, clientController.getAll);
router.get('/:id', auth, clientController.getById);
router.post('/', auth, clientController.create);
router.put('/:id', auth, clientController.update);
router.delete('/:id', auth, clientController.delete);

module.exports = router;
