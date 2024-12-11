const express = require('express');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});


const express = require('express');
const { create } = require('express-handlebars');
const { Server } = require('socket.io');


const hbs = create({ extname: '.handlebars' });

app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', './views');

const httpServer = app.listen(8080, () => console.log('Server running on 8080'));
const io = new Server(httpServer);

const viewsRouter = require('./routes/views.router');
app.use('/', viewsRouter);