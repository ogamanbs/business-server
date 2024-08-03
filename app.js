const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const logger = require('morgan');

const homeRoute = require('./routes/homeRoute');
const ownerRoute = require('./routes/ownerRoute');
const productsRoute = require('./routes/productRoute');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRoute);
app.use('/owner', ownerRoute);
app.use('/products', productsRoute);

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = res.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;