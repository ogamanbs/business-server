const bcrypt = require('bcrypt');
const ownerModel = require('../models/owner-model');
const productModel = require('../models/product-model');

module.exports.create = async (req, res, next) => {
    const {name, email, password, image} = req.body;
    const owner = await ownerModel.findOne({email});
    if(owner) {
        let username = name.charAt(0).toUpperCase() + name.slice(1);
        res.status(401).json({message: `${username} you already have an account with this email`});
    } else {
        bcrypt.genSalt(12, (err, salt) => {
            if(salt) {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if(hash) {
                        const ownerCreated = await ownerModel.create({
                            name,
                            email,
                            password: hash,
                            image
                        });
                        if(ownerCreated) {
                            res.status(200).json({message: 'successfully created owner'});
                        } else {
                            res.status(500).json({message: 'error creating owner'});
                        }
                    } else {
                        res.status(500).json({message: 'error creating owner'});
                    }
                });
            } else {
                res.status(500).json({message: 'error creating owner'});
            }
        });
    }
}

module.exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    const owner = await ownerModel.findOne({email}).populate('products');
    if(owner) {
        bcrypt.compare(password, owner.password, (err, result) => {
            if(result) {
                res.status(200).json({message: 'successfully verified owner', owner: owner});
            } else {
                res.status(401).json({message: 'owner not found'});
            }
        });
    } else {
        res.status(401).json({message: 'owner not found'});
    }
}

module.exports.getOwner = async (req, res, next) => {
    const {email} = req.body;
    const owner = await ownerModel.findOne({email: email}).populate('products');
    if(!owner) {
        res.status(401).json({message: "failed to fetch owner"});
    } else {
        res.status(200).json({owner: owner, message: "successfully fetched owner"});
    }
}