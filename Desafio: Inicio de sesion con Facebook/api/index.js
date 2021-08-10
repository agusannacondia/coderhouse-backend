import { Router } from "express";
import cart from "./routes/cart.js";
import products from "./routes/products.js";
import auth from "./routes/auth.js";

export default () => {
    const app = Router();
    cart(app);
    products(app);
    auth(app);

    return app;
};
