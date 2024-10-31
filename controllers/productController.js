const ProductModel = require('../models/product-model');
const OwnerModel = require('../models/owner-model');

module.exports.create = async (req, res, next) => {
    try {
        const { images, name, price, discount, description, units, features, userId } = req.body;
        console.log(images.length);
        const owner = await OwnerModel.findOne({_id:userId}).populate('products');
        let flag = 0;
        for(let i = 0; i<owner.products.length; i++) {
            if(owner.products[i].name === name) {
                flag = 1;
                break;
            }
        }
        if(flag === 0) {
            const createdProduct = await ProductModel.create({
                images,
                name,
                price,
                discount,
                units,
                description,
                features,
                owner: userId
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
    } catch(err) {
        res.status(401).json({message: 'error creating product'});
    }
}