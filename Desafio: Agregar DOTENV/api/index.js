import { Router } from "express";
import { router as productsRouter } from "../modules/products/router.js";
import Users from "./routes/user.js";

export default () => {
    const app = Router();
    app.use(productsRouter);
    Users(app);

    return app;
};
