const mongoose = require('mongoose');
const config = require('config');

try {
    const connection = await mongoose.connect(`${config.get("MONGODB_URI")}`);
    console.log('connected');
} catch(err) {
    console.error(err);
}

module.exports = mongoose.connection;