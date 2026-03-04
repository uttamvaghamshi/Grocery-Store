import mongoose from "mongoose";

const order_items = new mongoose.Schema({
    order_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
    },
    product_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    }
})

export default mongoose.model("order_items",order_items);

