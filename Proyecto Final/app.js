import config from "./config";
import express from "express";

const app = express();

app.listen(config.port).on("error", (err) => {
    console.log("Error: ", err);
    process.exit(1);
});

export default app;
