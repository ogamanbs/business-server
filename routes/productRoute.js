const express = require('express');
const router = express.Router();
const { create, getProducts } = require('../controllers/productController');

router.get('/', (req, res, next) => {
    res.status(200).send('products');
});

router.post('/create', create);
router.post('/get-products', getProducts);

module.exports = router;