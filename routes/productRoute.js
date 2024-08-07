const express = require('express');
const router = express.Router();
const { create, all } = require('../controllers/productController');

router.get('/', (req, res, next) => {
    res.status(200).send('products');
});

router.get('/all', all);

router.post('/create', create);

module.exports = router;