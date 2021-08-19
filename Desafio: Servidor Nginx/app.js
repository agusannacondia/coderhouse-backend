import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createServer } from "http";
import os from "os";
import minimist from "minimist";
import { fork } from "child_process";

const args = minimist(process.argv.slice(2));
const PORT = args["PORT"] || "8080";
const MODE = args["MODE"] || "fork";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "*");

    next();
});

server
    .listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
    })
    .on("error", (err) => {
        console.log("Error: ", err);
        process.exit(1);
    });

app.get("/randoms", (req, res) => {
    let cant = req.query.cant || 100000000;

    const randoms = fork(__dirname + "/randoms.js", ["--CANT", cant]);
    randoms.on("message", (response) => {
        res.end(JSON.stringify(response));
    });
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

export default app;
