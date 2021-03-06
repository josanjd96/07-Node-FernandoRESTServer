
require('./config/congif.js');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const app = express();

const bodyParser = require('body-parser');

// Middlewares -----------------------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// Habilitar la carpeta public -------------------------------------------------------------
app.use( express.static(  path.resolve( __dirname, '../public' )) );
app.use( express.static(  path.resolve( __dirname, '../uploads' )) );


// Configuración global de rutas ------------------------------------------------------
app.use( require( './routes/index' ) );

// MongooseDB ----------------------------------------------------------------------------
mongoose.connect(process.env.URLDB,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    (err, res) => {

        if (err) throw err;

        console.log('DB online');

    });

app.listen( process.env.PORT, () => {
    console.log( 'Listen on port: ', process.env.PORT )
})