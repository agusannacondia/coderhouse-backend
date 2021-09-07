import express from "express";
import config from "./config/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import passportFacebook from "passport-facebook";
import minimist from "minimist";
import nodemailer from "nodemailer";
import twilio from "twilio";

const accountSID = "AC8c225863e28a11817fd317889c64df14";
const authToken = "05a3b98238bb1c25c60e2e50b840c2f0";

const twilioClient = twilio(accountSID, authToken);

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "brooks.ziemann51@ethereal.email",
        pass: "aqa9t6WU6dh6s6PT2f",
    },
});

const mailOptions = {
    from: "brooks.ziemann51@ethereal.email",
    to: "brooks.ziemann51@ethereal.email",
    subject: "Mail de prueba desde Node.js",
    html: '<h1 style="color: blue;">Contenido de prueba</h1>',
};

const sendMail = ({ to, subject, html }) => {
    const options = {
        ...mailOptions,
        ...(to && { to }),
        ...(subject && { subject }),
        ...(html && { html }),
    };

    transporter.sendMail(options, (info, err) => {
        if (err) {
            console.log("errpr sendMail:", err);
            return err;
        }
    });
};

import compression from "compression";
import { loggerConsole, loggerError, loggerWarn } from "./loggers/winston.js";

const args = minimist(process.argv.slice(2));
const FACEBOOK_CLIENT_ID = args["FACEBOOK_CLIENT_ID"] || "535901190992405";
const FACEBOOK_CLIENT_SECRET =
    args["FACEBOOK_CLIENT_SECRET"] || "8907de96464be5de2a6cb2d4c771858b";
const PORT = args["FACEBOOK_CLIENT_ID"] || "8080";
const MODE = args["MODE"] || "fork";

process.on("exit", (code) => {
    console.log(`About to exit with code: ${code}`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

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

app.use(compression());

app.use(express.static("public"));

server
    .listen(config.port, () => {
        loggerConsole.log(
            "debug",
            `Servidor escuchando en http://localhost:${PORT}`
        );
    })
    .on("error", (err) => {
        loggerError.log("error", err);
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
        res.redirect("index.html");
    } else {
        res.redirect("login.html");
    }
});

app.get("/username", (req, res) => {
    if (req.isAuthenticated()) {
        res.send({
            userName: req.user.displayName,
            email: req.user.emails[0].value,
            photo: req.user.photos[0].value,
        });
    } else {
        res.send({ text: "There is no user logged" });
    }
});

app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("index.html");
    } else {
        res.redirect("login.html");
    }
});

app.get("/logout", (req, res) => {
    if (req.isAuthenticated()) {
        sendMail({
            subject: `New Logout in Coderhouse App - ${
                req.user.displayName
            } - ${new Date().toLocaleString()}`,
            html: "<p>We have detected a new logout from Coderhouse backend application.</p>",
        });
    }
    req.logOut();
    res.redirect("login.html");
});

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
        failureRedirect: "/logout",
    }),
    (req, res) => {
        if (req.isAuthenticated()) {
            sendMail({
                to: req.user.emails[0].value,
                subject: `New Login in Coderhouse App - ${
                    req.user.displayName
                } - ${new Date().toLocaleString()}`,
                html: `<p>We have detected a new login into Coderhouse backend application. This is your profile picture: ${req.user.photos[0].value}</p>`,
            });
            sendMail({
                subject: `New Login in Coderhouse App - ${
                    req.user.displayName
                } - ${new Date().toLocaleString()}`,
                html: "<p>We have detected a new login into Coderhouse backend application.</p>",
            });
            twilioClient.messages.create({
                body: `New Login in Coderhouse App - ${
                    req.user.displayName
                } - ${new Date().toLocaleString()}`,
                from: "+14159693164",
                to: "",
            });
        }
        res.redirect("/");
    }
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

io.on("connection", async (socket) => {
    loggerConsole.log("debug", "Usuario conectado");
});

export default app;
