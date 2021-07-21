import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();

if (envFound.error) {
    throw new Error("Couldn't find .env file");
}

export default {
    port: parseInt(process.env.PORT, 10),
    url_local: process.env.URL_MONGODB_LOCAL,
    url_remote: process.env.URL_MONGODB_REMOTE,
    persistence: process.env.PERSISTENCE,
};
