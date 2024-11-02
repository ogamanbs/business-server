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
                            name: name.toLowerCase(),
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
                res.status(200).json({message: 'successfully verified owner', owner: {
                    _id: owner.id,
                    name: owner.name,
                    image: owner.image,
                    contact: owner.contact,
                    email: owner.email,
                    passsword: owner.password
                }});
            } else {
                res.status(401).json({message: 'owner not found'});
            }
        });
    } else {
        res.status(401).json({message: 'owner not found'});
    }
}

module.exports.getOwner = async (req, res, next) => {
    const { id } = req.body;
    const owner = await ownerModel.findOne({_id: id});
    if(!owner) {
        res.status(401).json({message: "failed to fetch owner"});
    } else {
        res.status(200).json({owner: {
            _id: owner.id,
            name: owner.name,
            email: owner.email,
            contact: owner.contact,
            password: owner.password,
            image: owner.image
        }, message: "successfully fetched owner"});
    }
}

module.exports.updateName = async (req, res, next) => {
    const { id, name } = req.body;
    console.log(name, id);
    await ownerModel.findOneAndUpdate({_id: id}, {name: name.toLowerCase()});
    const owner = await ownerModel.findOne({_id: id});
    if(owner) {
        console.log(owner);
        res.status(200).json({message: "owner successfully name updated", owner: {
            _id: owner.id,
            name: owner.name,
            image: owner.image,
            contact: owner.contact,
            email: owner.email,
            passsword: owner.password
        }});
    } else {
        res.status(304).json({message: "failed to update owner detailes"});
    }
}

module.exports.updateEmail = async (req, res, next) => {
    const { email, id } = req.body;
    console.log(email, id);
    await ownerModel.findOneAndUpdate({_id: id}, {email: email});
    const owner = await ownerModel.findOne({_id: id});
    if(owner) {
        res.status(200).json({message: "owner successfully email updated", owner: {
            _id: owner.id,
            name: owner.name,
            image: owner.image,
            contact: owner.contact,
            email: owner.email,
            passsword: owner.password
        }});
    } else {
        res.status(304).json({message: "failed to update owner detailes"});
    }
}

module.exports.updateContact = async (req, res, next) => {
    const { id, contact } = req.body;
    await ownerModel.findOneAndUpdate({_id: id}, {contact: contact});
    const owner = await ownerModel.findOne({_id: id});
    if(owner) {
        res.status(200).json({message: "owner successfully contact updated", owner: {
            _id: owner.id,
            name: owner.name,
            image: owner.image,
            contact: owner.contact,
            email: owner.email,
            passsword: owner.password
        }});
    } else {
        res.status(304).json({message: "failed to update owner detailes"});
    }
}

module.exports.updateImage = async (req, res, next) => {
    const { image, id } = req.body;
    await ownerModel.findOneAndUpdate({_id: id}, {image: image});
    const owner = await ownerModel.findOne({_id: id});
    if(owner) {
        res.status(200).json({message: "owner successfully image updated", owner: {
            _id: owner.id,
            name: owner.name,
            image: owner.image,
            contact: owner.contact,
            email: owner.email,
            passsword: owner.password
        }});
    } else {
        res.status(304).json({message: "failed to update owner detailes"});
    }
}

module.exports.updatePassword = async (req, res, next) => {
    const {password, newPassword, id} = req.body;
    const owner = await ownerModel.findOne({_id: id});
    if(owner) {
        bcrypt.compare( password, owner.password, (err, result) => {
            if(result) {
                bcrypt.genSalt(12, (err, salt) => {
                    if(salt) {
                        bcrypt.hash(newPassword, salt, async (err, hash) => {
                            if(hash) {
                                await ownerModel.findOneAndUpdate({_id: id}, {password: hash});
                                const updatedOwner = await ownerModel.findOne({_id: id});
                                if(updatedOwner) {
                                    res.status(200).json({message: "owner password successfully updated", owner: {
                                        _id: owner.id,
                                        name: updatedOwner.name,
                                        image: updatedOwner.image,
                                        contact: updatedOwner.contact,
                                        email: updatedOwner.email,
                                        passsword: updatedOwner.password
                                    }});
                                } else {
                                    res.status(304).json({message: "failed to update owner detailes"});
                                }
                            } else {
                                res.status(500).json({message: 'error changing password'});
                            }
                        });
                    } else {
                        res.status(500).json({message: 'error changing password'});
                    }
                });
            } else {
                res.status(401).json({message: 'error changing password'});
            }
        });
    }
}

module.exports.deleteOwner = async (req, res, next) => {
    const { id } = req.body;
    const owner = await ownerModel.findOne({_id: id});
    if(owner) {
        for(let i = 0; i<owner.products.length; i++) {
            await productModel.findOneAndDelete({_id: owner.products[i].toString()});
        }
        await ownerModel.findOneAndDelete({_id: id});
        res.status(200).json({message: 'successfully deleted owner'});
    } else {
        res.status(500).json({message: 'error deleting owner'});
    }
}