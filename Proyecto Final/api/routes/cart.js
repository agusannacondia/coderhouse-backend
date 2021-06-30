import { Router } from "express";
import Cart from "../../controllers/cart.js";

const route = Router();
const cart = new Cart();

export default (app) => {
    app.use("/cart", route);

    route.get("/items/:id", async (req, res) => {
        var response;

        if (req.params.id) {
            response = await cart.getCart(req.params.id);
        }

        return response.error
            ? res.json({ error: response.error }).status(400).send()
            : res.json(response).status(200).send();
    });

    route.post("/add/:id", async (req, res) => {
        var response;
        const idCart = req.body.idCart;
        const idItem = req.params.id;

        if (idItem) {
            response = await cart.addItem(idItem, idCart);
        }

        return response.error
            ? res.json({ error: response.error }).status(400).send()
            : res.json(response).status(200).send();
    });

    route.delete("/delete/:id", async (req, res) => {
        var response;

        if (req.params.id) {
            response = await cart.deleteItem(req.params.id);
        }

        return response.error
            ? res.json({ error: response.error }).status(400).send()
            : res.json(response).status(200).send();
    });
};
