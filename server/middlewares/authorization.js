

const jwt = require('jsonwebtoken');


// ---------------------------------------------
// Verificar Token
// ---------------------------------------------

let verificaToken = ( req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.user = decoded.user;
        next();

    });

};


// ---------------------------------------------
// Verificar AdminRole
// ---------------------------------------------

let verificaAdmin_Role = ( req, res, next) => {

    let usuario = req.user

    if ( usuario.role === "ADMIN_ROLE" ) {

        next();

    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

};


module.exports =  {
    verificaToken,
    verificaAdmin_Role
};