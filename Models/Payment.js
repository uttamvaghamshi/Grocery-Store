import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"orders"
    },
    method: {
        type:String,
        enum: ["UPI","CARD","COD"],
    },
    transaction_id: {
        type:String
    },
    status: {
        type:String,
        enum: ["pending","success","failed"],
        default: "pending"
    },
    paid_at: {
        type:Date,
        default: Date.now
    }
})

export default mongoose.model("payments",paymentSchema);

