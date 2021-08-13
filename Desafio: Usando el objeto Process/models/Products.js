import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    title: { type: String, require: true, max: 100 },
    thumbnail: { type: String, require: true },
    price: { type: Number, require: true },
});

export const products = mongoose.model("products", ProductSchema);
