/**
 *
 *  Module imports
 *
 */

import express from "express";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import Messages from "./modules/messages/controller.js";
import Products from "./modules/products/controller.js";
import config from "./config/index.js";
import routes from "./api/index.js";
import { createServer } from "http";
import { Server } from "socket.io";

/**
 *
 *  Configuration
 *
 */

mongoose
    .connect(config.url_remote, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database already connected"))
    .catch((err) => console.log(err));

/**
 *
 *  Declarations
 *
 */

const app = express();
const server = createServer(app);
const io = new Server(server);
const messages = new Messages();
const products = new Products();

/**
 *
 *  Routers
 *
 */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes());
app.use(express.static("public"));
app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: config.url_remote,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: 600,
        }),
        secret: "secreto",
        resave: false,
        saveUninitialized: false,
    })
);

io.on("connection", async (socket) => {
    await messages.getMessages();

    socket.emit("data", await products.getProducts());
    socket.emit("messages", await messages.getMessages());

    socket.on("newProduct", async (_data) => {
        io.sockets.emit("addProduct", await productos.getProducts());
    });

    socket.on("new-message", async (data) => {
        await messages.addMessage(data);
        io.sockets.emit("messages", await messages.getMessages());
    });
});

/**
 *
 *  Run Server
 *
 */

app.listen(config.port, () =>
    console.log(`Servidor escuchando en http://localhost:${config.port}`)
).on("error", (err) => {
    console.log("error", err);
    process.exit(1);
});

export default app;
