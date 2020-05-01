const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', (req, res) => {

    let body = req.body;
    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Credenciales incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Credenciales incorrectos'
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        }); //60 segundos * 60 min = 1 Hora * 24 * 30 igual a un mes 30 dias

        res.json({
            ok: true,
            user: userDB,
            token: token
        })
    });
})

module.exports = app;