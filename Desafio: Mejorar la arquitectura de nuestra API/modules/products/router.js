import express from "express";
import Productos from "./controller.js";

export const router = express.Router();

export const productos = new Productos();

router.get("/productos/listar", async (req, res) => {
    res.json(await productos.getProducts());
});

router.get("/productos/listar/:id", async (req, res) => {
    res.json(await productos.getProducts(req.params.id));
});

router.post("/productos/guardar", async (req, res) => {
    res.json(await productos.addProduct(req.body));
});

router.put("/productos/actualizar/:id", async (req, res) => {
    const id = req.params.id;
    const updateData = { id: id, ...req.body };
    res.json(await productos.updateProduct(updateData));
});

router.delete("/productos/borrar/:id", async (req, res) => {
    const id = req.params.id;
    res.json(await productos.deleteProduct(id));
});
