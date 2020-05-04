const express = require('express');
let { verifyToken } = require('../middlewares/authentication');
let app = express();
let Category = require('../models/category');
let User = require('../models/user');

// Para Consultar
app.get('/category', verifyToken, function(req, res) {

    Category.find({})
        .sort('name')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            Category.count((err, conteo) => {
                res.json({
                    ok: true,
                    categories: categories,
                    numero: conteo
                });
            });
        });
});

//Consutar una sola categoria 
app.get('/category/:id', verifyToken, function(req, res) {
    let id = req.params.id;
    //let body = req.body;
    let body = req.body;

    Category.findById(id, body, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: 'Categoria no existe'
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });

});

//Para Crear Nuevos Uusarios
app.post('/category', verifyToken, function(req, res) {
    let body = req.body;
    let category = new Category({
        name: body.name,
        user: req.user._id
    });

    category.save((err, resp) => {
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

        res.json({
            ok: true,
            category: resp
        });
    });
});

//PUT ES PARA ACTUALIZAR
app.put('/category/:id', verifyToken, function(req, res) {
    let id = req.params.id;
    let body = req.body;
    let nameCategory = {
        name: body.name
    };

    Category.findByIdAndUpdate(id, nameCategory, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });

});
//DELETE ES PARA ELIMINAR
app.delete('/category/:iden', verifyToken, function(req, res) {

    let id = req.params.iden;
    Category.findByIdAndRemove(id, (err, categoryDelete) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!categoryDelete) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoria no existe'
                }
            });
        }
        if (!categoryDelete) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada exitosamente'
        });
    });

    /*let cambiarEstado = {
        status: false
    };

    User.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, userDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            user: userDelete
        });
    });*/

});

module.exports = app;