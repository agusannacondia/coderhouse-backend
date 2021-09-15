/**
 *
 *  Module imports
 *
 */

import express from "express";
import config from "./config/index.js";
import routes from "./api/index.js";
import mongoose from "mongoose";
import passport from "passport";
import passportFacebook from "passport-facebook";
import MongoStore from "connect-mongo";
import session from "express-session";
import Messages from "./modules/messages/controller.js";
import products from "./api/routes/products.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
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

const FacebookStrategy = passportFacebook.Strategy;

/**
 *
 *  Declarations
 *
 */

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const server = createServer(app);
const io = new Server(server);
const messages = new Messages();

/**
 *
 *  Routers
 *
 */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes());
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
app.use(express.static("public"));
passport.use(
    new FacebookStrategy(
        {
            clientID: config.facebook_client_id,
            clientSecret: config.facebook_client_secret,
            callbackURL: "/auth/facebook/callback",
            profileFields: ["id", "displayName", "email", "photos"],
            scope: ["email"],
        },
        (_accessToken, _refreshToken, profile, done) => done(null, profile)
    )
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
app.use(passport.initialize());
app.use(passport.session());
app.get("/login", (req, res) => {
    if (req.isAuthenticated()) {
        var user = req.user;
        console.log("user logueado");
        res.sendFile(__dirname + "/public/index.html");
    } else {
        console.log("user NO logueado");
        res.sendFile(__dirname + "/public/login.html");
    }
});

app.get("/username", (req, res) => {
    res.send({
        userName: req.user.displayName,
        email: req.user.emails[0].value,
        photo: req.user.photos[0].value,
    });
});

app.get("/logout", (req, res) => {
    req.logout();
    res.sendFile(__dirname + "/public/login.html");
});

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/",
        failureRedirect: "/logout",
    })
);

app.get("/datos", (req, res) => {
    if (req.isAuthenticated()) {
        res.send(req.user);
    } else {
        loggerWarn.log(
            "warn",
            "Se intento ingresar a /datos sin autenticación"
        );
        res.status(401).send("debe autenticarse primero");
    }
});

app.get("/info", (req, res) => {
    res.send({
        args: process.argv.slice(2).join(" - "),
        OSName: process.platform,
        nodeVersion: process.version,
        usageOfMemory: process.memoryUsage(),
        execPath: process.execPath,
        PID: process.pid,
        folder: process.cwd(),
        numberOfCPUs: os.cpus().length,
    });
});

io.on("connection", async (socket) => {
    const arrayMsg = await messages.getMessages();

    console.log("New connection");
    socket.emit("data", await products.getProducts());
    socket.emit("messages", await messages.getMessages());

    socket.on("newProduct", async (data) => {
        io.sockets.emit("addProduct", await productos.getProducts());
    });

    socket.on("new-message", async (data) => {
        console.log("data", data);
        const newMsg = await messages.addMessage(data);
        io.sockets.emit("messages", await messages.getMessages());
    });
});

/**
 *
 *  Run Server
 *
 */

server
    .listen(config.port, () =>
        console.log(`Servidor escuchando en http://localhost:${config.port}`)
    )
    .on("error", (err) => {
        console.log("error", err);
        process.exit(1);
    });

export default app;
