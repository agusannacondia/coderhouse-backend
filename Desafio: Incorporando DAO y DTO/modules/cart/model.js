import mongoose from "mongoose";

const schema = mongoose.Schema({
    date: { type: Date, required: true },
    items: { type: Array },
});

const carts = mongoose.model("Carts", schema);

export default carts;
