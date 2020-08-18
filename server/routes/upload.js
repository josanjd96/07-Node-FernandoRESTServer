

const express    = require('express');
const fileUpload = require('express-fileupload');
const fs         = require('fs');
const path       = require('path');

const app = express();


const Usuario = require('../models/usuarios');
const Producto = require('../models/productos');


// Default options - middlewares
app.use( fileUpload({ useTempFiles: true }) );


app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo,
        id   = req.params.id

   if ( !req.files ) {
       return res.status(400).json({
           ok: false,
           err: {
               message: 'No se ha seleccionado ningún archivo'
           }
       });
   }

   let tiposValidos = [ 'productos', 'usuarios' ];
   if ( tiposValidos.indexOf( tipo ) < 0 ) {
       return res.status(400).json({
           ok: false,
           err: {
               message: 'Las tipos permitidas son ' + tiposValidos.join(',')
           }
       });
   };

   let archivo = req.files.archivo;
   let nombreArchivoCortado = archivo.name.split('.');
   let extension = nombreArchivoCortado[ nombreArchivoCortado.length - 1 ];

    // Extensiones permitidas -----------------------
    let extensionesValidas = [ 'png', 'jpg', 'gif', 'jpeg' ];

    if ( extensionesValidas.indexOf( extension ) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(','),
                ext: extension
            }
        });
    }

    // Cambiar nombre al archivo
    // 6116161jndsfkjnfa-1235.jpg
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    archivo.mv( `uploads/${ tipo }/${ nombreArchivo }` , ( err ) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Aqui, imagen cargada ------------------------------------------------------------------------

        if ( tipo === 'usuarios' ) {

            return imgUsuario(id, res, nombreArchivo);

        } else {

            return imgProducto(id, res, nombreArchivo);

        }

    });

});

const imgUsuario = ( id, res, nombreArchivo ) => {

    Usuario.findById(id, ( err, usuarioDB ) => {

        if ( err ) {
            borraArchivo( nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !usuarioDB ) {
            borraArchivo( nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            })
        }

        borraArchivo( usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( ( err, usuarioGuardado ) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })

        });

    });

};

const imgProducto = (id, res, nombreArchivo ) => {

    Producto.findById( id, ( err, productoDB ) => {
        if ( err ) {
            borraArchivo( nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !productoDB ) {
            borraArchivo( nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            })
        }

        borraArchivo( productoDB.img, 'productos' );

        productoDB.img = nombreArchivo;


        productoDB.save( ( err, productoGuardado ) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })

        });

    });

};

const borraArchivo = ( nombreImagen, tipo ) => {

    let pathImagen = path.resolve( __dirname, `../../uploads/${ tipo }/${ nombreImagen }` );

    if ( fs.existsSync( pathImagen ) ) {
        fs.unlinkSync( pathImagen );
    }

};

module.exports = app;