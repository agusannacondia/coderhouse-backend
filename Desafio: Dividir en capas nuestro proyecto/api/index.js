import { Router } from "express";
import Products from "./routes/products.js";

export default () => {
    const app = Router();
    new Products(app);

    return app;
};
