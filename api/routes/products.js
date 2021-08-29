import { Router } from "express";
import { isAdmin } from "../middlewares/verify.js";
import { products } from "../../models/Products.js";

const route = Router();

export default (app) => {
    app.use("/products", route);

    route.get("/list", async (_req, res) => {
        var response = await products.find();

        return response.error
            ? res.json({ error: response.error }).status(400).send()
            : res.json(response).status(200).send();
    });

    route.get("/list/:id", async (req, res) => {
        var response;

        if (req.params.id) {
            response = await products.findById(req.params.id);
        }

        return response.error
            ? res.json({ error: response.error }).status(400).send()
            : res.json(response).status(200).send();
    });

    route.post("/add", isAdmin, async (req, res) => {
        const response = await products.create(req.body);

        return response.error
            ? res.json({ error: response.error }).status(400).send()
            : res.json(response).status(200).send();
    });

    route.put("/update/:id", isAdmin, async (req, res) => {
        const response = await products.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    ...req.body,
                },
            }
        );

        return response.error
            ? res.json({ error: response.error }).status(400).send()
            : res.json(response).status(200).send();
    });

    route.delete("/delete/:id", isAdmin, async (req, res) => {
        const response = await products.deleteOne({ _id: req.params.id });

        return response.error
            ? res.json({ error: response.error }).status(400).send()
            : res.json(response).status(200).send();
    });
};
