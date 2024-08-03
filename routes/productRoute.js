const express = require('express');
const router = express.Router();
const { create } = require('../controllers/productController');

router.get('/', (req, res, next) => {
    res.render('products');
});

router.get('/all', (req, res, next) => {

});

router.post('/', create);

module.exports = router;