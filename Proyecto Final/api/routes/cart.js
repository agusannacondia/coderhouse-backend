import { Router } from "express";

const route = Router();

export default (app) => {
    app.use("/cart", route);

    route.get("/list/:id", (req, res, next) => {
        const id = req.params.id;
        try {
            return res.status(200).end();
        } catch (e) {
            throw new Error(e);
        }
    });

    route.post("/add/:id", (req, res, next) => {
        const id = req.params.id;
        try {
            return res.status(200).end();
        } catch (e) {
            throw new Error(e);
        }
    });

    route.delete("/delete/:id", (req, res, next) => {
        const id = req.params.id;
        try {
            return res.status(200).end();
        } catch (e) {
            throw new Error(e);
        }
    });
};
