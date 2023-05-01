const inicioDebug = require('debug')('app.inicio');//Importa el paquete debug
                                                   //el parametro indica el archivo y el entorno
                                                   //de depuracion.
const dbDebug = require('debug')('app:db');
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
                                   //(recursos estáticos)

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

const usuarios = [
    {id: 1 , nombre:'Juan'},
    {id: 2 , nombre:'Karen'},
    {id: 3 , nombre:'Diego'},
    {id: 4 , nombre:'Maria'}
];

function existeUsuario(id){
    return (usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom){
    const schema = joi.object({
        nombre: joi.string().min(3).required()
    });
    return (schema.validate({nombre:nom}));
}


//Consulta en la rita raiz del sitio
//Toda peticion va a recibir dos prameetros
//req: la informacion que recibe el servidor desde el cliente
//res: la informacion que el servidor va a responder al cliente
//Vamos a utilizar el metodo send del objeto res
app.get('/',(req,res)=>{
    res.send('Hola mundo desde Express!');
});

app.get('/api/usuarios', (req,res) =>{
    res.send(usuarios);
});

//Con los : delante del id
//Express sabe qye es un parametro a recibir en la ruta
app.get('/api/usuarios/:id', (req, res) => {
    const id = req.params.id;
    let usuario = existeUsuario(id);
    if(!usuario){
        res.status(404).send(`El usuario ${id} no se encuentra!`);//Devuelve el estado HTTP 404
        return;
        }
    res.send(usuario);
    return;
});

//Recibir varios parametros
//Se pasan dos parametros year y month
//Query string
//localhost:5000/api/usuarios/1990/2/?nombre=xxx&single=y
app.get('/api/usuarios/:year/:month', (req,res) =>{
    //En el cuerpo de req esta la propiedad
    //query, que guarda los parametros Query String
    res.send(req.query);
})


//La ruta tiene el mismo nombre que la peticion GET
//Express hace la diferencia dependiendo del tipo
//de peticion
//La peticion POST la vamos a utilizar para insertar
//un nuevo usuario en nuestro arreglo
app.post('/api/usuarios', (req,res) => {
    //El objeto request tiene la propiedad body
    //que va a venir en formato JSON
    //Creacion del schema con joi
    const {error, value} = validarUsuario(req.body.nombre);
    if(!error){
        const usuario = {
            id: usuarios.length + 1, //ID automatico del nuevo usuario
            nombre: req.body.nombre //para pedir el nombre
            };
            usuarios.push(usuario);
            res.send(usuario);
    }else{
        const message = error.details[0].message;
        res.status(400).send(message);
    }
    return;
})


//Peticion  para modificar datos existentes
//Este metodo debe recibir un parámetro
//id para saber que usuario modificar
app.put('/api/usuarios/:id',(req, res)=>{
    //Encontrar si existe el usuario a modificar
   let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no se encuentra'); //Devuelve el estado HTTP
        return;
    }
    //Validar si el dato recibido es correcto
    const {error, value} = validarUsuario(req.body.nombre);
    if(!error){
        //Actualiza el nombre
        usuario.nombre = value.nombre;
        res.send(usuario);
    }else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
    return;
})

//recibe como parametro el id del usuario
//que se va a eliminar
app.delete('/api/usuarios/:id', (req, res) =>{
    const usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no se encuentra'); //Devuelve el estado HTTP
        return;
    }
    //Encontrar el indice del usuario demtro del arreglo
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);//Elimina el usuario del indice
    res.send(usuario); //responde con el usuario eliminado
    return;
});

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