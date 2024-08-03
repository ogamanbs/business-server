const express = require('express');
const router = express.Router();
const { create, login } = require('../controllers/ownerAuthController');

router.get('/', (req, res, next) => {
    res.render('owner');
});

router.post('/create', create);
router.post('/login', login);

module.exports = router;