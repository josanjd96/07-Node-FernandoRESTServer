
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');


const Usuario = require('../models/user.js');
const { verificaAdmin_Role, verificaToken } = require("../middlewares/authorization");

const app = express();

const saltRounds = 10;


// HTTP Routes ------------------------------------------------------------------------

app.get('/user', verificaToken, function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number( desde );

    let limite = req.query.limite || 5;
    limite = Number( limite );

    Usuario.find( { state: true }, ['name', 'email', 'role', 'state', 'google', 'img' ] )
        .skip( desde )
        .limit( limite )
        .exec( ( err, users) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ state: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    users: users,
                    cuantos: conteo
                });
            })
        });


});

app.post('/user', [ verificaToken, verificaAdmin_Role ], function (req, res) {

    let body = req.body;

    let user = new Usuario({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync( body.password, saltRounds),
        role: body.role,
    });

    user.save( ( err, userDB ) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            user: userDB
        });

    });

});

app.put('/user/:id', [ verificaToken, verificaAdmin_Role ], function (req, res) {

    let id = req.params.id;
    let body = _.pick( req.body, [ 'name', 'email', 'img', 'role', 'state' ] );

    Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err, userDB ) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            user: userDB
        });

    })

});

app.delete('/user/:id', [ verificaToken, verificaAdmin_Role ], function (req, res) {

    let id = req.params.id;

    // Usuario.findByIdAndDelete(id, (err, userDeleted ) => {
    // Muchas formas de hacerlo.

    let cambiaEstado = {
        state: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, userDeleted ) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !userDeleted ) {
            return res.status(400).json({
                ok: false,
                err : {
                    message: 'User not found'
                }
            });
        }

        res.status(200).json({
            ok: true,
            user: userDeleted
        });

    } );


});

module. exports = app;
