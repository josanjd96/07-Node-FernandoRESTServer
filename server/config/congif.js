


// ================================
// Port
// ================================
process.env.PORT = process.env.PORT || 3000 ;


// ================================
// Entorno
// ================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ================================
// Entorno
// ================================

let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/coffe'
} else {
    urlDB = 'mongodb+srv://strider:47fnnDAug38Je5hV@cluster0.apzof.mongodb.net/test'
}

process.env.URLDB = urlDB;