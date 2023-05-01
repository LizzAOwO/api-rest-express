function log(req, res, next){
    console.log('Login...');
    next(); //Le indica a express que llame la siguiente funcion middleware
            //o la peticion correspondiente
            //si no lo indicamos, Express se queda dentro de esta función
}
module.exports = log;