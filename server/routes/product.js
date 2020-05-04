const express = require('express');
let { verifyToken } = require('../middlewares/authentication');
let app = express();
let Product = require('../models/product');

//BUSCADOR POR MATCH
app.get('/product/search/:match', verifyToken, function(req, res) {

    let match = req.params.match;
    let regex = new RegExp(match, 'i');
    Product.find({ name: regex })
        .populate('category', 'name')
        .exec((err, productDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: 'Producto no existe'
                });
            }

            res.json({
                ok: true,
                products: productDB
            })

        })
});
//TODOS LOS PRODUCTOS
app.get('/product', verifyToken, function(req, res) {

    Product.find({ available: true })
        .sort('name')
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            Product.count((err, conteo) => {
                res.json({
                    ok: true,
                    products: products,
                    numero: conteo
                });
            });
        });
});

//CONSULTAR UN SOLO PRODUCTO 
app.get('/product/:id', verifyToken, function(req, res) {
    let id = req.params.id;
    let body = req.body;
    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, productDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: 'Producto no existe'
                });
            }
            res.json({
                ok: true,
                product: productDB
            });
        });

});

//CREAR NUEVO PRODUCTO
app.post('/product', verifyToken, function(req, res) {
    let body = req.body;
    let product = new Product({
        name: body.name,
        amount: body.amount,
        description: body.description,
        available: true,
        category: body.category,
        user: req.user._id
    });

    product.save((err, resp) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!resp) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.status(201).json({
            ok: true,
            product: resp
        });
    });
});

//ACTUALIZAR UN PRODUCTO
app.put('/product/:id', verifyToken, function(req, res) {
    let id = req.params.id;
    let body = req.body;
    let dataProduct = {
        name: body.name,
        amount: body.amount,
        description: body.description,
        category: body.category,
        user: req.user._id
    };

    Product.findByIdAndUpdate(id, dataProduct, { new: true, runValidators: true }, (err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            product: productDB
        });
    });

});
//ELIMINAR UN PRODUCTO
app.delete('/product/:iden', verifyToken, function(req, res) {
    let id = req.params.iden;
    let cambiarEstado = {
        available: false
    };

    Product.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, productDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            product: productDelete
        });
    });

});


module.exports = app;