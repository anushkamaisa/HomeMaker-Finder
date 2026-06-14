const express = require('express');
const router = express.Router();
const productController = require('../controllers/homemakerController');
const auth = require('../middleware/auth');

// Get products by homemaker ID (no auth required - public endpoint)
router.get('/homemaker/:homemakerId', productController.getProductsByHomemaker);

// Protected routes - require authentication
router.post('/', auth, productController.addProduct);
router.put('/:id', auth, productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;