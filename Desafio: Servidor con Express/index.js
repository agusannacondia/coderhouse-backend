import express from 'express'
import fs from "fs"

const app = express();

const PORT = 8080;

const visitas = {
    items: 0,
    item: 0
}

app.get('/items', async (req, res) => {
    visitas.items++;
    const productos = await fs.promises.readFile("./storage/productos.txt", "utf-8", (err) => {throw err})
    res.json(JSON.parse(productos));
});

app.get('/item-random', async (req, res) => {
    visitas.item++;
    const productos = await fs.promises.readFile("./storage/productos.txt", (err) => {throw err})
    const arrayProductos = JSON.parse(productos)
    const randomNumber = Math.floor(Math.random() * arrayProductos.length);
    res.json(arrayProductos[randomNumber]);
});

app.get('/visitas', (req, res) => {
    res.json({ visitas: {
        items: visitas.items,
        item: visitas.item
    } });
});

const server = app.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});

server.on('error', error => {
    console.log('Error:', error);
});