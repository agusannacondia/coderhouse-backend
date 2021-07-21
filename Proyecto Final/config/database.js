import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const mysql = {
    client: "mysql",
    connection: {
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "ecommerce",
    },
};

export const sqlite3 = {
    client: "sqlite3",
    connection: {
        filename: __dirname + "/../db/messages.sqlite",
    },
    useNullAsDefault: true,
};
