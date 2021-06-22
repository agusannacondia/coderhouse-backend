const express = require('express')
const { Products } = require("./classes/Products.js")
const { Messages } = require('./classes/Messages')
const handlebars = require("express-handlebars")
const PORT = 8080;

const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productsRouter = express.Router()

const products = new Products()
const messages = new Messages()

productsRouter.get('/listar', async (req, res) => {
    res.json(products.getProducts());
});

productsRouter.get('/listar/:id', async (req, res) => {
    res.json(products.getProduct(req.params.id));
});

productsRouter.post('/guardar', (req, res) => {
    try {
        products.addProduct(req.body)
        res.json({message: "Product added correctly"})
    } catch (error) {
        res.send({error: error.message})
    }
});

productsRouter.put('/actualizar/:id', (req, res) => {
    res.json(products.updateProduct({
        id: req.params.id,
        ...req.body
    }));
});

productsRouter.delete('/borrar/:id', (req, res) => {
    res.json(products.deleteProduct(req.params.id));
});

app.get('/productos/vista', (req, res) => {
    const listOfProducts = products.getProducts()
    res.render("vista", {
        hayProductos: Array.isArray(listOfProducts),
        productos: listOfProducts
    })
})

app.get('/', (req, res) => {
    const listOfProducts = products.getProducts()
    res.render("index", {
        hayProductos: Array.isArray(listOfProducts),
        productos: listOfProducts
    })
})

app.use('/api/productos', productsRouter)

app.engine("hbs", handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/"
}))

app.set("view engine", "hbs")
app.set("views", "./views")
app.use('/', express.static('public'))

io.on('connection', (socket) => {
    socket.on('post item', (data) => {
        const listOfProductsWithoutLast = products.getProducts()
        const listOfProducts = Array.isArray(listOfProductsWithoutLast) ? [...listOfProductsWithoutLast, data] : [data]
        io.sockets.emit('items', listOfProducts)
    })

    socket.on('post message', async (message) => {
        const listOfMessagesWithoutLast = await messages.getMessages()
        messages.addMessage(message)
        const listOfMessages = Array.isArray(listOfMessagesWithoutLast) ? [...listOfMessagesWithoutLast, message] : [message]
        io.sockets.emit('messages', listOfMessages)
    })
})

const server = http.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});

server.on('error', error => {
    console.log('Error:', error);
});