import { Router } from "express";
import cart from "./routes/cart";
import products from "./routes/products";

export default () => {
  const app = Router();
  cart(app);
  products(app);

  return app;
};
