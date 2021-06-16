import express from 'express'
import Products from "./classes/Products.js"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
        console.log(req.body)
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
        products: listOfProducts
    })
})

app.use('/api/productos', productsRouter)

app.set("view engine", "pug")
app.set("views", "./views")
app.use('/', express.static('public'))

const server = app.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});

server.on('error', error => {
    console.log('Error:', error);
});