const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.id_token;
    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        });
    });
    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (userDB) {
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de autenticarse normalmente'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                return res.json({
                    ok: true,
                    user: userDB,
                    token: token
                });
            }
        } else {
            //Si usuario no existe
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';

            user.save((err, userDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: err
                    });
                }

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });

                return res.json({
                    ok: true,
                    user: userDB,
                    token: token
                });
            });
        }
    });
});

module.exports = app;