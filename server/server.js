
require('./config/congif.js');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Middlewares -----------------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json


// HTTP ------------------------------------------------------------------------
app.get('/user', function (req, res) {
    res.json('get User');
});

app.post('/user', function (req, res) {

    let body = req.body;

    if ( body.name === undefined ) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    } else {
        res.json({
            persona: body
        });
    }

});

app.put('/user/:id', function (req, res) {

    let id = req.params.id

    res.json({
        id
    })
});

app.delete('/user', function (req, res) {
    res.json('delete User')
});



app.listen( process.env.PORT, () => {
    console.log( 'Listen on port: ', process.env.PORT )
})