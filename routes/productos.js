const express = require('express');
const joi = require('joi');
const ruta = express.Router();

const productos = [
    {id: 1 , nombre:'Raton inalambrico'},
    {id: 2 , nombre:'Teclado mecanico'},
    {id: 3 , nombre:'Monitor 24'},
    {id: 4 , nombre:'Cable HDMI 6ft'}
];

ruta.get('/', (req,res) =>{
    res.send(productos);
});


//Con los : delante del id
//Express sabe qye es un parametro a recibir en la ruta
ruta.get('/:id', (req, res) => {
    const id = req.params.id;
    let producto = existeProducto(id);
    if(!producto){
        res.status(404).send(`El producto ${id} no se encuentra!`);//Devuelve el estado HTTP 404
        return;
        }
    res.send(producto);
    return;
});

function existeProducto(id){
    return (productos.find(p => p.id === parseInt(id)));
}

ruta.post('/', (req,res) => {
    //El objeto request tiene la propiedad body
    //que va a venir en formato JSON
    //Creacion del schema con joi
    const {error, value} = validarProducto(req.body.nombre);
    if(!error){
        const producto = {
            id: productos.length + 1, //ID automatico del nuevo usuario
            nombre: req.body.nombre //para pedir el nombre
            };
            productos.push(producto);
            res.send(producto);
    }else{
        const message = error.details[0].message;
        res.status(400).send(message);
    }
    return;
})

function validarProducto(nom){
    const schema = joi.object({
        nombre: joi.string().min(3).required()
    });
    return (schema.validate({nombre:nom}));
}

ruta.put('/:id',(req, res)=>{
    //Encontrar si existe el usuario a modificar
   let producto = existeProducto(req.params.id);
    if(!producto){
        res.status(404).send('El producto no se encuentra'); //Devuelve el estado HTTP
        return;
    }
    //Validar si el dato recibido es correcto
    const {error, value} = validarProducto(req.body.nombre);
    if(!error){
        //Actualiza el nombre
        producto.nombre = value.nombre;
        res.send(producto);
    }else{
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
    return;
})

//recibe como parametro el id del usuario
//que se va a eliminar
ruta.delete('/:id', (req, res) =>{
    const producto = existeProducto(req.params.id);
    if(!producto){
        res.status(404).send('El producto no se encuentra'); //Devuelve el estado HTTP
        return;
    }
    //Encontrar el indice del usuario demtro del arreglo
    const index = productos.indexOf(producto);
    productos.splice(index, 1);//Elimina el usuario del indice
    res.send(producto); //responde con el usuario eliminado
    return;
});

module.exports = ruta;