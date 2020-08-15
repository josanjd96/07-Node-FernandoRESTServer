
require('./config/congif.js');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middlewares -----------------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

app.use( require( './routes/user' ) );


mongoose.connect(process.env.URLDB,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    (err, res) => {

        if (err) throw err;

        console.log('DB online');

    });

app.listen( process.env.PORT, () => {
    console.log( 'Listen on port: ', process.env.PORT )
})