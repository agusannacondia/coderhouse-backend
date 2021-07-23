import express from "express";
import config from "./config/index.js";
import routes from "./api/index.js";
import mongoose from "mongoose";
import faker from "faker";

mongoose
    .connect("mongodb://localhost:27017/ecommerce", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Conexion exitosa");
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes());

app.get("/productos/vista-test", (req, res) => {
    const testProducts = [];
    for (let i = 0; i < (req.query.cant || 10); i++) {
        testProducts.push({
            title: faker.commerce.product(),
            price: faker.commerce.price(),
            thumbnail: faker.image.image(),
        });
    }
    res.render("vista", {
        hayProductos: true,
        productos: testProducts,
    });
});

app.set("views", "./views");
app.set("view engine", "ejs");
app.use("/", express.static("public"));

app.listen(config.port, () => {
    console.log(`Servidor escuchando en http://localhost:${config.port}`);
}).on("error", (err) => {
    console.log("Error: ", err);
    process.exit(1);
});

export default app;
