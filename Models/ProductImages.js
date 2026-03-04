import mongoose from "mongoose";

const products_images = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },
    image_url: {
        type: String,
        required: true
    }
})

export default mongoose.model("product_images",products_images);