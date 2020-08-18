

const express = require('express');
// const _ = require('underscore');

let Categoria = require('../models/categoria');
let { verificaAdmin_Role, verificaToken } = require('../middlewares/authorization');

let app = express();

// HTTP Routes ------------------------------------------------------------------------

app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('description')
        .populate( 'usuario' , 'name email' )
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        })
});

app.get('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findById( id, ( err, categoria ) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !categoria ) {
            return res.json({
                ok: false,
                err,
                message: 'No se ha encontrado categoria para este id'
            })
        }

        res.json({
            ok: true,
            categoria: categoria
        })

    });

});

app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.user._id
    });

    categoria.save( ( err, categoriaDB ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });

    });

})

app.put('/categoria/:id', [ verificaToken, verificaAdmin_Role ], (req, res) => {

    let id = req.params.id;
    let body = req.body;
    // let body = _.pick( req.body, [ 'descripcion' ] ); Para si hubieran muchas opciones

    Categoria.findByIdAndUpdate( id, body, { new: true, runValidators: true, context: 'query' }, ( err, categoriaDB ) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

app.delete('/categoria/:id', [ verificaToken, verificaAdmin_Role ], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove( id, ( err, categoriaDeleted ) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDeleted ) {
            return res.status(400).json({
                ok: false,
                err : {
                    message: 'Categoria not found'
                }
            });
        }

        res.status(200).json({
            ok: true,
            user: categoriaDeleted
        });

    });

});



module.exports = app;