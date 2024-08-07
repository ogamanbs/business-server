const mongoose = require('mongoose');

const ownerSchema = mongoose.Schema({
    name:{
        type: String,
        minLength: 3,
        trim:true
    },
    email: String,
    password: String,
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        }
    ],
    image: String,
});

module.exports = mongoose.model('owner', ownerSchema);