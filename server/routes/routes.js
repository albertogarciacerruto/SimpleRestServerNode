const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();
// Para Consultar
app.get('/user', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    User.find({ status: true }, 'name, email, google, img, status, role')
        .skip(desde)
        .limit(limite)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            User.count({ status: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    users: users,
                    numero: conteo
                });
            });
        });
});

//Para Crear Nuevos Uusarios
app.post('/user', function(req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, resp) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            user: resp
        });
    });
});

//PUT ES PARA ACTUALIZAR
app.put('/user/:id', function(req, res) {
    let id = req.params.id;
    //let body = req.body;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });

});
//DELETE ES PARA ELIMINAR
app.delete('/user/:iden', function(req, res) {

    let id = req.params.iden;
    /*User.findByIdAndRemove(id, (err, userDelete) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (!userDelete) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: userDelete
        });
    });*/

    let cambiarEstado = {
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
    });

});

module.exports = app;