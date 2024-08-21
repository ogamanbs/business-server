const ProductModel = require('../models/product-model');
const OwnerModel = require('../models/owner-model');

module.exports.create = async (req, res, next) => {
    const { image, name, price, discount, bgcolor, panelColor, textColor, id} = req.body;
    const owner = await OwnerModel.findOne({_id:id}).populate('products');
    let flag = 0;
    for(let i = 0; i<owner.products.length; i++) {
        if(owner.products[i].name === name) {
            flag = 1;
            break;
        }
    }
    if(flag === 0) {
        const createdProduct = await ProductModel.create({
            image,
            name,
            price,
            discount,
            bgcolor,
            panelcolor: panelColor,
            textcolor: textColor,
            owner: id
        });
        if(createdProduct) {
            owner.products.push(createdProduct._id);
            await owner.save();
            res.status(200).json({message: `${name} successfully created`});
        } else {
            res.status(401).json({message: 'error creating product'});
        }
    } else {
        res.status(401).json({message: 'product already exists in your store'});
    }
}

module.exports.all = async (req, res, next) => {
        const { id } = req.body;
        const owner = await OwnerModel.findOne({_id: id});
        if(owner) {
            res.status(200).json({products: owner.products, message: 'successfully fetched'});
        } else {
            res.send(400).json({products: [], message: 'unable to get products'});
        }
}