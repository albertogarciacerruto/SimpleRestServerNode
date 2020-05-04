//PUERTO
process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//VENCIMIENTO TOKEN
//60 segundos
//60 min
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//SEED AUTENTICATION
process.env.SEED = process.env.SEED || 'secret';

//BASE DE DATOS
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
    //MONGO_URI="mongodb://cafe-user:cafe123456@ds013340.mlab.com:13340/cafe"
}
process.env.URLDB = urlDB;

//GOOGLE CLIENT ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '278947070172-fo6fhrrknbmaqo7pbgt9i7ohl85ma8oq.apps.googleusercontent.com';