import knex from "knex";
import { sqlite3 } from "../config/database.js";

const myKnex = knex(sqlite3);

class Messages {
    constructor() {
        try {
            myKnex.schema.hasTable("messages").then((exists) => {
                if (!exists) {
                    return myKnex.schema.createTable("messages", (table) => {
                        table.increments("id");
                        table.string("email");
                        table.string("text");
                        table
                            .timestamp("date", { useTz: true })
                            .notNullable()
                            .defaultTo(myKnex.fn.now());
                    });
                }
            });
        } catch (_error) {
            return { error: "Error trying to create table" };
        }
    }

    async getMessages() {
        return await myKnex.from("messages").select();
    }

    async addMessage(message) {
        return await myKnex("messages").insert(message);
    }
}

export default Messages;
