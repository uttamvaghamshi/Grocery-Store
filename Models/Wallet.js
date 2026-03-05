import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    rider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "riders"
    },

    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders"
    },

    amount: Number,

    type: {
        type: String,
        default: "credit"
    }

}, { timestamps: true });

export default mongoose.model("wallet_transactions", walletSchema);