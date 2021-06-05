import express from 'express'
import fs from "fs"
import Products from "./classes/Products.js"

const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const productsRouter = express.Router()

const products = new Products()

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

app.use('/api/productos', productsRouter)

app.use('/', express.static('public'))

const server = app.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});

server.on('error', error => {
    console.log('Error:', error);
});