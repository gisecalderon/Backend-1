import {Router} from 'express'
import crypto from 'crypto'
import { __dirname } from '../path'
import {promises as fs} from 'fs';
import path from 'path';

const productRouter = Router()

const productosPath = path.resolve(__dirname, '../src/db/productos.json');

const productosData = await fs.readFilesSync(productosPath, 'utf-8');
const productos = JSON.parse(productosData);

// Consultar productos
productRouter.get('/', (req,res) => {
    const {limit} = req.query
    const products =products.slice(0, limit) 
    res.status(200).render('/templates/home',{products: productos, js: 'productos.js', css: 'productos.css'})
})

// Consultar producto via ID
productRouter.get('/:pid', (req,res) => {
    const idProducto = req.params.pid
    const producto = productos.find(prod => prod.id == idProducto)

    if(producto) {
        res.status(200).send(producto)
    } else {
        res.status(404).send({mensaje: "El producto no existe"})
    }
})

//Crear un nuevo producto
productRouter.post('/', async (req,res) => {
    const {title, description, code, price, stock, category} = req.body
    const nuevoProducto = {
        id: crypto.randomBytes(10).toString('hex'), //Me genera un id unico
        title: title,
        description: description,
        code: code,
        category: category,
        price: price,
        stock: stock,
        status: true,
        thumbnails: []
    }
    productos.push(nuevoProducto)
    await fs.writeFile(productosPath, JSON.stringify(productos))
    res.status(201).send({mensaje: `Producto creado correctamente con el id: ${nuevoProducto.id}`})
})

//Actualiza un producto dado su id y pido los datos a actualizar del cuerpo de la peticion
productRouter.put('/:pid', async (req,res) => {
    const idProducto = req.params.pid
    const {title, description, code, price, stock, category,status, thumbnails} = req.body
    const indice = productos.findIndex(prod => prod.id == idProducto)
    
    if(indice != -1) {
        productos[indice].title = title
        productos[indice].description = description
        productos[indice].code = code
        productos[indice].price = price
        productos[indice].stock = stock
        productos[indice].category = category
        productos[indice].stock = stock
        productos[indice].status = status
        productos[indice].thumbnails = thumbnails
        await fs.writeFile(productosPath, JSON.stringify(productos))
        res.status(200).send({mensaje: "Producto actualizado"})
    } else {
        res.status(404).send({mensaje: "El producto no existe"})
    }
})

//Elimina un producto dado su id
productRouter.delete('/:pid', async (req,res) => {
    const idProducto = req.params.pid
    const indice = productos.findIndex(prod => prod.id == idProducto)
    if(indice != -1) {
        productos.splice(indice, 1)
        await fs.writeFile(productosPath, JSON.stringify(productos))
        res.status(200).send({mensaje: 'Producto eliminado'})
    } else {
        res.status(404).send({mensaje: "El producto no existe"})
    }
})

export default productRouter