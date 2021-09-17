import { Router } from "express";
import Products from "./routes/products.js";
import Users from "./routes/user.js";

export default () => {
    const app = Router();
    new Products(app);
    Users(app);

    return app;
};
