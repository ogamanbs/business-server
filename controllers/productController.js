const ProductModel = require('../models/product-model');
const OwnerModel = require('../models/owner-model');

module.exports.create = async (req, res, next) => {
    const { image, name, price, discount, bgcolor, panelColor, textColor, email} = req.body;
    const owner = await OwnerModel.findOne({email});
    if(owner) {
        const createdProduct = await ProductModel.create({
            image,
            name,
            price,
            discount,
            bgcolor,
            panelColor,
            textColor,
            owner: owner._id
        });
        if(createdProduct) {
            if(owner.products.indexOf(createdProduct._id) === -1) {
                owner.products.push(createdProduct._id);
                await owner.save();
                res.status(200).json({message: `${name} successfully created`});
            } else {
                res.status(401).json({message: '${name} already present in owner store'});
            }
        } else {
            res.status(401).json({message: 'error creating product'});
        }
    } else {
        res.status(401).json({message: 'error creating product'});
    }
}

module.exports.all = async (req, res, next) => {
        const { email } = req.body;
        const products = await ProductModel.find().populate('owner');
        const allProducts = products.filter((product) => {
            return product.owner.email === email;
        });
        res.status(200).json({products: allProducts, message: 'successfully fetched'});
}