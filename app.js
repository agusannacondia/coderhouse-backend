import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createServer } from "http";
import { fork } from "child_process";
import dotenv from "dotenv";

dotenv.config();

import compression from "compression";
import { loggerConsole, loggerError, loggerWarn } from "./loggers/winston.js";

process.on("exit", (code) => {
    console.log(`About to exit with code: ${code}`);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

server
    .listen(process.env.PORT || 5000, () => {
        loggerConsole.log(
            "debug",
            `Servidor escuchando en http://localhost:${process.env.PORT}`
        );
    })
    .on("error", (err) => {
        loggerError.log("error", err);
        process.exit(1);
    });

app.get("/info", (req, res) => {
    res.send(
        `Server running on ${process.env.PORT} - <b>PID ${
            process.pid
        }</b> - ${new Date().toLocaleString()}`
    );
});

app.get("/randoms", (req, res) => {
    let cant = req.query.cant || 100000000;

    const randoms = fork(__dirname + "/randoms.js", ["--CANT", cant]);
    randoms.on("message", (response) => {
        res.end(JSON.stringify(response));
    });
});

export default app;
