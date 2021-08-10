import express from "express";
import config from "./config/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import routes from "./api/index.js";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import Messages from "./api/Messages.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import passportFacebook from "passport-facebook";

const FACEBOOK_CLIENT_ID = "535901190992405";
const FACEBOOK_CLIENT_SECRET = "8907de96464be5de2a6cb2d4c771858b";

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

const FacebookStrategy = passportFacebook.Strategy;

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
app.use(express.static("public"));

server
    .listen(config.port, () => {
        console.log(`Servidor escuchando en http://localhost:${config.port}`);
    })
    .on("error", (err) => {
        console.log("Error: ", err);
        process.exit(1);
    });

passport.use(
    new FacebookStrategy(
        {
            clientID: FACEBOOK_CLIENT_ID,
            clientSecret: FACEBOOK_CLIENT_SECRET,
            callbackURL: "/auth/facebook/callback",
            profileFields: ["id", "displayName", "email", "photos"],
            scope: ["email"],
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(JSON.stringify(profile, null, 3));
            let userProfile = profile;
            return done(null, userProfile);
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

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
        res.status(401).send("debe autenticarse primero");
    }
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
