const inicioDebug = require('debug')('app.inicio');//Importa el paquete debug
                                                   //el parametro indica el archivo y el entorno
                                                   //de depuracion.
const dbDebug = require('debug')('app:db');
const usuarios = require('./routes/usuarios');
const express = require('express'); //Importa el paquete express
const app = express(); //Crea una instancia de express
const config =require('config');//Importa el modulo config
const joi = require('joi'); //Importa el paquete joi
const logger = require('./logger');
const morgan = require('morgan');

//----- Metodos a implementar -----
// app.get();//Consulta
// app.post()//Envio de datos al servidor (Insertar datos en la base)
// app.pu()//Actualizacion
// app.delete()//Eliminacion de datos

app.use(express.json()); //Le decimos a express que use este middleware

app.use(express.urlencoded({extended:true}));//Nuevo middleware
                                             //Define el uso de la libreria qs para
                                             //separar la información codificada en 
                                             //el url


app.use(express.static('public')); //Nombre de la carpeta que tendrá los archivos
                                   //(recursos estáticos

app.use('/api/usuarios', usuarios); //Middleware que importamos   
//El primer parametro es la ruta raiz asociada
//con las peticiones a los atos de usuarios
//La ruta raiz se va a concatenar como prefijo
//al inicio de todas als tutas definidas en el archivo usuarios                                

console.log(`Aplicacion: ${config.get('nombre')}`);
console.log(`BD server: ${config.get('configDB.host')}`);

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    //console.log('Morgan habilitado ...');
    //Muestra el mensaje de depuracion
    inicioDebug('Morgan está habilitado...');
}

dbDebug('Conectando con la base de datos...');


// app.use(logger); //logger ya hace referencia a la funcion log de logger.js
//                  //debido al exports

// app.use(function(req, res, next){
//     console.log('Autenticando...');
//     next();
// });

//Los tres app,use() son middleware y se llaman antes de 
//las  funciones de ruta FET, POST, PUT, DELETE
//para que estas puedan trabajar


//Consulta en la rita raiz del sitio
//Toda peticion va a recibir dos prameetros
//req: la informacion que recibe el servidor desde el cliente
//res: la informacion que el servidor va a responder al cliente
//Vamos a utilizar el metodo send del objeto res
app.get('/',(req,res)=>{
    res.send('Hola mundo desde Express!');
});

//Recibir varios parametros
//Se pasan dos parametros year y month
//Query string
//localhost:5000/api/usuarios/1990/2/?nombre=xxx&single=y
// app.get('/api/usuarios/:year/:month', (req,res) =>{
//     //En el cuerpo de req esta la propiedad
//     //query, que guarda los parametros Query String
//     res.send(req.query);
// })

app.get('/api/productos', (req,res)=>{
    res.send(['mouse','teclado','bocinas']);
});


//El modulo process, contiene informacion del sistema
//El objeto env ocntiene informacion de las varriables
//del entorno
//Si la variable no existe, que tome un valor
//fijo definifo por nosotros (3000)
const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});


//----------- Funciones middleware ----------
/*
El middleware es un bloque de codigo que se ejecuta
entre las peticiones del usuario (request) y la peticion
que llega al servidor. Es un enlace entre la peticion
del usuario y el servidor, antes de que este pueda
dar una respuesta.

Las funciones de middleware son funciones que tienen acceso
al objeto de solicitud (req), al objeto de respuesta (res)
y ala siguiente función de middleware en el ciclo de 
solicitud/respuestas de la aplicacion. La siguiente 
duncion de middleware se denota normalmente con una 
variablle denominada next.

Las funciones middleware pueden realizar las siguientes tareas:

- Ejecutar cualquier codigo.
- Realizar cambios en la solicitud y los objetos de respuesta
- Invoca la sigguiente funcion de middleware en la pila

Express es un framework de direccionamiento y uso de middleware
que permite que la aplicacion tenga funcionalidad minima propia.

Ya hemos utilizado algunos middleware como son express.json()
que transforma el dody del req a formato JSON

            ---------------------------
request   --|--> json() --> route() --|--> response
            ---------------------------

route() --> Funcion GET, POST, PUT, DELETE

Una aplicacion Express puede utilizar los siguientes tipos de middleware

- Middleware de nivel de aplicacion
- Middleware de nivel de direccionador
- Middleware de manejo de errore
- Middleware incorporado
- Middleware de terceros

*/


//----------- Recursos estaticos ----------
/*
Los recursos estaticos hacen referencia a archivos,
imagenes, documentos que se hubican en el servidor, 
vamos a usar un middleware para poder acceder a esos
recursos.


*/