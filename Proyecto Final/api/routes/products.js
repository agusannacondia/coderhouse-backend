import { Router } from "express";
import { Products } from "../classes/products";

const route = Router();

export default (app) => {
    app.use("/products", route);

    route.get("/list/:id", (req, res) => {
        try {
            return req.params.id
                ? res.json(products.getProduct(req.params.id))
                : res.json(products.getProducts());
        } catch (e) {
            return res.json({ error: "This is an error" }).status(400).end();
        }
    });

    route.post("/add", (req, res) => {
        try {
            products.addProduct(req.body);
            return res.json({ message: "Product added correctly" });
        } catch (e) {
            throw new Error(e);
        }
    });

    route.put("/update/:id", (req, res) => {
        const id = req.params.id;
        try {
            return res.status(200).end();
        } catch (e) {
            throw new Error(e);
        }
    });

    route.delete("/delete/:id", (req, res) => {
        const id = req.params.id;
        try {
            return res.status(200).end();
        } catch (e) {
            throw new Error(e);
        }
    });
};

const { Products } = require("./classes/Products.js");

const productsRouter = express.Router();

const products = new Products();

productsRouter.get("/listar", async (req, res) => {
    res.json(products.getProducts());
});

productsRouter.get("/listar/:id", async (req, res) => {
    res.json(products.getProduct(req.params.id));
});

productsRouter.post("/guardar", (req, res) => {
    try {
        products.addProduct(req.body);
        res.json({ message: "Product added correctly" });
    } catch (error) {
        res.send({ error: error.message });
    }
});

productsRouter.put("/actualizar/:id", (req, res) => {
    res.json(
        products.updateProduct({
            id: req.params.id,
            ...req.body,
        })
    );
});

productsRouter.delete("/borrar/:id", (req, res) => {
    res.json(products.deleteProduct(req.params.id));
});
