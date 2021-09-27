import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config({
    path: path.resolve(__dirname, process.env.NODE_ENV + ".env"),
});

if (envFound.error) {
    console.log(envFound.error);
    throw new Error("Couldn't find .env file");
}

export default {
    node_env: process.env.NODE_ENV || "development",
    host: process.env.HOST || "127.0.0.1",
    port: parseInt(process.env.PORT, 10) || 8080,
    url_local: process.env.URL_MONGODB_LOCAL,
    url_remote: process.env.URL_MONGODB_REMOTE,
    persistence: process.env.PERSISTENCE,
    facebook_client_id: process.env.FACEBOOK_CLIENT_ID,
    facebook_client_secret: process.env.FACEBOOK_CLIENT_SECRET,
};
