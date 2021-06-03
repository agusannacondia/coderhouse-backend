import express from 'express'
import fs from "fs"
import Products from "./classes/Products.js"

const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const products = new Products()

app.get('/api/productos/listar', async (req, res) => {
    res.json(products.getProducts());
});

app.get('/api/productos/listar/:id', async (req, res) => {
    res.json(products.getProduct(req.params.id));
});

app.post('/api/productos/guardar', (req, res) => {
    try {
        products.addProduct(req.body)
        res.json({message: "Product added correctly"})
    } catch (error) {
        res.send({error: error.message})
    }
});

const server = app.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});

server.on('error', error => {
    console.log('Error:', error);
});