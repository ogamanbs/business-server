const express = require('express');
const router = express.Router();
const { create, login, getOwner, updateName, updateEmail, updateContact, updateImage, updatePassword, deleteOwner } = require('../controllers/ownerAuthController');

router.get('/', (req, res, next) => {
    res.send('owner');
});

router.post('/get-owner', getOwner);
router.post('/create', create);
router.post('/login', login);

router.post('/update/name', updateName);
router.post('/update/email', updateEmail);
router.post('/update/contact', updateContact);
router.post('/update/image', updateImage);
router.post('/update/password', updatePassword);

router.post('/delete', deleteOwner);

module.exports = router;