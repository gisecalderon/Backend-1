io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    
    socket.on('addProduct', (data) => {
      // Lógica para agregar producto
      io.emit('updateProducts', data);
    });
  
    socket.on('deleteProduct', (id) => {
      // Lógica para eliminar producto
      io.emit('updateProducts', id);
    });
  });

  router.post('/api/products', (req, res) => {
    const product = req.body; // Asegúrate de validar estos datos
    product.id = uuidv4();
    products.push(product);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    
    io.emit('updateProducts', products);
    res.status(201).json(product);
  });
  

  router.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const updatedProducts = products.filter(product => product.id !== id);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(updatedProducts, null, 2));
  
    io.emit('updateProducts', updatedProducts);
    res.status(204).send();
  });
  