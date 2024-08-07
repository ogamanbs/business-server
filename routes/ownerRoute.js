const express = require('express');
const router = express.Router();
const { create, login, getOwner } = require('../controllers/ownerAuthController');

router.get('/', (req, res, next) => {
    res.status(200).send('owner');
});

router.post('/', getOwner);

router.post('/create', create);
router.post('/login', login);

module.exports = router;