import express from "express";
import config from "./config/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import routes from "./api/index.js";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Messages from "./api/Messages.js";
import session from "express-session";
import MongoStore from "connect-mongo";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const messages = new Messages();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "*");

    next();
});

app.use(
    session({
        store: MongoStore.create({
            mongoUrl:
                "mongodb+srv://admin:admin@cluster0.z3m6q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: 600,
        }),
        secret: "secreto",
        resave: false,
        saveUninitialized: false,
    })
);

app.use("/api", routes());

app.set("views", "./views");
app.set("view engine", "ejs");
app.use("/", express.static("public"));

server
    .listen(config.port, () => {
        console.log(`Servidor escuchando en http://localhost:${config.port}`);
    })
    .on("error", (err) => {
        console.log("Error: ", err);
        process.exit(1);
    });

io.on("connection", async (socket) => {
    const arrayMsg = await messages.getMessages();

    socket.emit("messages", await messages.getMessages());

    socket.on("new-message", async (data) => {
        const newMsg = await messages.addMessage(data);
        io.sockets.emit("messages", await messages.getMessages());
    });
});

export default app;
