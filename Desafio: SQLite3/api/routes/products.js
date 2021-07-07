import { Router } from "express";
import Products from "../../controllers/products.js";
import { isAdmin } from "../middlewares/verify.js";

const route = Router();
const products = new Products();

export default (app) => {
    app.use("/products", route);

    route.get("/list", async (_req, res) => {
        var response = await products.getProducts();

        return response.error
            ? res.json({ error: response.error }).status(400).send()
            : res.json(response).status(200).send();
    });

    route.get("/list/:id", async (req, res) => {
        var response;

        if (req.params.id) {
            response = await products.getProduct(req.params.id);
        }

        return response.error
            ? res.json({ error: response.error }).status(400).send()
            : res.json(response).status(200).send();
    });

    route.post("/add", isAdmin, async (req, res) => {
        const response = await products.addProduct(req.body);

        return response.error
            ? res.json({ error: response.error }).status(400).send()
            : res.json(response).status(200).send();
    });

    route.put("/update/:id", isAdmin, async (req, res) => {
        const response = await products.updateProduct({
            id: req.params.id,
            ...req.body,
        });

        return response.error
            ? res.json({ error: response.error }).status(400).send()
            : res.json(response).status(200).send();
    });

    route.delete("/delete/:id", isAdmin, async (req, res) => {
        const response = await products.deleteProduct(req.params.id);

        return response.error
            ? res.json({ error: response.error }).status(400).send()
            : res.json(response).status(200).send();
    });
};
