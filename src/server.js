import express from 'express'
import { create } from 'express-handlebars';
import { Server } from 'socket.io';
import { path } from 'path';
import { __dirname } from './path.js'
import productRouter from './routes/productos.routes.js';
import cartRouter from './routes/carritos.routes.js';
import multerRouter from './routes/imagenes.routes.js';

const app = express();
const hbs = create()
const PORT = 8080

const server = app.listen(PORT, () => {
    console.log("Server on port", PORT)
})
const io = new Server(server)
app.use(express.json())
app.use(express.urlencoded({extended:true})) 
app.engine('handlebars',hbs.engine)
app.set('view engine', 'handlebars')

app.use('/static', express.static(__dirname + '/public'))
app.use('views', path.join(__dirname, 'views'))
console.log(__dirname);

app.use('/api/productos', productRouter)
app.use('/api/carts', cartRouter)
app.use('/upload', multerRouter)
const productos =[
    {nombre: "Remera S", marca: "GSC", precio: 16800, stock: 4, status: true},
    {nombre: "Remera T", marca: "NMV", precio: 20400, stock: 2, status: true},
    {nombre: "Remera J", marca: "MAPF", precio: 35000, stock: 9, status: false}
]
app.get('/', (req,res) => {
    res.render('productos',{productos})
})

io.on('connection',(socket) =>{
    console.log('Usuario conectado: ', socket.id);

    socket.on('mensaje', (data) =>{
        console.log('Mensaje recibido: ', data);
        socket.emit('respuesta', 'Mensaje recibido correctamente: ', data)
    })

    socket.on('disconnect', () => {
        console.log('Usuario desconectado: ', socket.id);
    })
})