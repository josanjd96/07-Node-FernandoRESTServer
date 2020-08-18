

const express = require('express');

let { verificaToken } = require('../middlewares/authorization');

let app = express();
let Producto = require('../models/productos');


// HTTP Routes ------------------------------------------------------------------------

app.get('/productos', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number( desde );

    let limite = req.query.limite || 5;
    limite = Number( limite );

    Producto.find({ disponible: true })
        .skip( desde )
        .limit( limite )
        .populate('usuario', 'name email')
        .populate('categoria', 'descripcion')
        .exec( ( err, productos ) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos: productos,
                    cuantosDisponibles: conteo
                });
            })

        });

});

app.get( '/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById( id )
        .populate('categoria', 'descripcion')
        .populate('usuario', 'name email')
        .exec(( err, productoDB ) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            return res.json({
                ok: false,
                err,
                message: 'No se ha encontrado producto para este id'
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    });
// populate: usuario categoria
// paginado

});

app.get('/productos/buscar/:termino', verificaToken, ( req, res ) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i' );

    Producto.find({ nombre: regex })
        .populate( 'categoria', 'nombre' )
        .exec( ( err, productos ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        })

    });

});

app.post( '/productos',verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.user._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        img: body.img

    });

    producto.save( ( err, productoDB ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            producto: productoDB
        });

    });

});

app.put( '/productos/:id',verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate( id, body, { new: true, runValidators: true, context: 'query' }, ( err, productoDB ) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(200).json({
            ok: true,
            producto: productoDB
        });

    });

});

app.delete( '/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let cambioDisponibilidad = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambioDisponibilidad, { new: true, runValidators: true }, (err, productoDeleted ) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !productoDeleted ) {
            return res.status(400).json({
                ok: false,
                err : {
                    message: 'Product not deleted'
                }
            });
        }

        res.status(200).json({
            ok: true,
            producto: productoDeleted
        });

    });

    // cambiar disponible a false, entonces a la hora de traer productos esta la opcion de solo los dosponibles

});










module.exports = app;