import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import { Router } from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { users } from "../../modules/users/model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const route = Router();

export default (app) => {
    const LocalStrategy = passportLocal.Strategy;

    passport.use(
        "login",
        new LocalStrategy(
            {
                passReqToCallback: true,
            },
            (_req, username, password, done) => {
                users.findOne({ username }, (err, user) => {
                    if (err) return done(err);
                    if (!user) {
                        return done(
                            null,
                            false,
                            console.log("message", "User Not found.")
                        );
                    }
                    if (!isValidPassword(user, password)) {
                        return done(
                            null,
                            false,
                            console.log("message", "Invalid Password")
                        );
                    }
                    return done(null, user);
                });
            }
        )
    );
    const isValidPassword = (user, password) =>
        bcrypt.compareSync(password, user.password);

    passport.use(
        "signup",
        new LocalStrategy(
            {
                passReqToCallback: true,
            },
            (req, username, password, done) => {
                users.findOne({ username }, (err, user) => {
                    if (err) return done(err);

                    if (user) {
                        return done(
                            null,
                            false,
                            console.log("message", "User Already Exists")
                        );
                    } else {
                        const newUser = new users();
                        newUser = {
                            username,
                            password: createHash(password),
                            email: req.body.email,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                        };

                        newUser.save((err) => {
                            if (err) throw err;
                            return done(null, newUser);
                        });
                    }
                });
            }
        )
    );
    const createHash = (password) =>
        bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        users.findById(id, function (err, user) {
            done(err, user);
        });
    });
    app.use(passport.initialize());
    app.use(passport.session());
    route.get("/login", (req, res) => {
        if (req.isAuthenticated()) {
            res.sendFile(path.resolve(__dirname + "/public/index.html"));
        } else {
            res.sendFile(path.resolve(__dirname + "/public/login.html"));
        }
    });

    route.post(
        "/login",
        passport.authenticate("login", { failureRedirect: "/faillogin" }),
        (req, res) => {
            res.redirect("/login");
        }
    );

    route.get("/faillogin", (req, res) => {
        res.sendFile(path.resolve(__dirname + "/public/faillogin.html"));
    });

    route.get("/registrar", (req, res) => {
        res.sendFile(path.resolve(__dirname + "/public/register.html"));
    });

    route.post(
        "/registrar",
        passport.authenticate("signup", { failureRedirect: "/failregister" }),
        (req, res) => {
            res.sendFile(path.resolve(__dirname + "/public/login.html"));
        }
    );

    route.get("/failregister", (req, res) => {
        res.sendFile(path.resolve(__dirname + "/public/failregister.html"));
    });

    route.get("/username", (req, res) => {
        res.send({ userName: req.user.username });
    });

    route.get("/logout", (req, res) => {
        req.logout();
        res.sendFile(path.resolve(__dirname + "/public/login.html"));
    });

    app.use(route);
};
