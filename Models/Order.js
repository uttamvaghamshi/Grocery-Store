import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"        
    },
    address_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "addresses"
    },
    rider_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "riders"
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "store_admins"
    },
    total_amount: {
        type: Number
    },
    status: {
        type: String,
        enum: ["pending","cancelled","delivered","confirmed","out_for_delivery"],
        default: "pending"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    acceptedAt: Date,
    assignedAt: Date,
    deliveredAt: Date
})

export default mongoose.model("orders",orderSchema);

