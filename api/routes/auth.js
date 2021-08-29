import { Router } from "express";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const route = Router();

const auth = (req, res, next) => {
    if (req.session && req.session.userName) {
        return next();
    } else {
        return res.sendFile(resolve(`${__dirname}/../../public/login.html`));
    }
};

export default (app) => {
    app.use("/auth", route);

    route.get("/login", auth, (req, res) => {
        req.session.cookie.maxAge = 60000;
        res.sendFile(`${__dirname}/../../public/index.html`);
    });

    route.post("/login", (req, res) => {
        req.session.userName = req.body.userName || "";
        res.send({ userName: req.body.userName });
    });

    route.get("/username", (req, res) => {
        res.send({ userName: req.session.userName });
    });

    route.get("/logout", (req, res) => {
        if (req.session) {
            req.session.destroy((err) => {
                if (!err) res.send("Logout ok!");
                else res.send({ status: "Logout ERROR", body: err });
            });
        } else {
            res.sendStatus(200);
        }
    });
};
