import mongoose from "mongoose";

const cartschema = new mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true
    },
    items: [
    {
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        required: true
      }
    }
  ],
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "store_admins"
  }
})

export default mongoose.model("cart",cartschema);

