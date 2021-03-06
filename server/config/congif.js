


// ================================
// Port
// ================================
process.env.PORT = process.env.PORT || 3000 ;


// ================================
// Entorno
// ================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================
// Venciminto del Token
// ================================
// 60 segundo
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '74h' ;

// ================================
// SEED de autenticación
// ================================
// este-es-el-seed-desarrollo
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

// ================================
// Entorno
// ================================

let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/coffe'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ================================
// Google Client ID
// ================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '404527348397-v7sqgjh9e1m6bkd17depe9btd32prgmb.apps.googleusercontent.com';