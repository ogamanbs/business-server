const ProductModel = require('../models/product-model');

module.exports.create = async (req, res, next) => {
    const { image, name, price, discount, bgcolor, panelColor, textColor } = req.body;
    const createdProduct = await ProductModel.create({
        image,
        name,
        price,
        discount,
        bgcolor,
        panelColor,
        textColor
    });
    if(createdProduct) {
        res.status(200).json({message: `${name} successfully created`});
    } else {
        res.status(401).json({message: 'error creating product'});
    }
}

module.exports.all = async (req, res, next) => {
    const products = require();
}