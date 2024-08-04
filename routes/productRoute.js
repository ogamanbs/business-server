const express = require('express');
const router = express.Router();
const { create } = require('../controllers/productController');

router.get('/', (req, res, next) => {
    res.status(200).send('products');
});

router.get('/all', (req, res, next) => {

});

router.post('/', create);

module.exports = router;