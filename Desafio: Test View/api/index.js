import { Router } from "express";
import cart from "./routes/cart.js";
import products from "./routes/products.js";

export default () => {
    const app = Router();
    cart(app);
    products(app);

    return app;
};
