const express = require('express');
const joi = require('joi');
const ruta = express.Router();

const usuarios = [
    {id: 1 , nombre:'Juan'},
    {id: 2 , nombre:'Karen'},
    {id: 3 , nombre:'Diego'},
    {id: 4 , nombre:'Maria'}
];

ruta.get('/', (req,res) =>{
    res.send(usuarios);
});


//Con los : delante del id
//Express sabe qye es un parametro a recibir en la ruta
ruta.get('/:id', (req, res) => {
    const id = req.params.id;
    let usuario = existeUsuario(id);
    if(!usuario){
        res.status(404).send(`El usuario ${id} no se encuentra!`);//Devuelve el estado HTTP 404
        return;
        }
    res.send(usuario);
    return;
});

//La ruta tiene el mismo nombre que la peticion GET
//Express hace la diferencia dependiendo del tipo
//de peticion
//La peticion POST la vamos a utilizar para insertar
//un nuevo usuario en nuestro arreglo
ruta.post('/', (req,res) => {
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
ruta.put('/:id',(req, res)=>{
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
ruta.delete('/:id', (req, res) =>{
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

function existeUsuario(id){
    return (usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nom){
    const schema = joi.object({
        nombre: joi.string().min(3).required()
    });
    return (schema.validate({nombre:nom}));
}

module.exports = ruta; //Se exposta el objeto ruta