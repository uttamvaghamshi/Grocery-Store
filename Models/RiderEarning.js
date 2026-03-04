import mongoose from "mongoose";

const RiderEarningScheama = new mongoose.Schema({
    rider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Rider",
        required:true
    },
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required:true
    },
    total_order_amount: {
        type: Number,
        required:true
    },
    distance_km :{
        type: Number,
        required:true
    },
    base_amount: {
        type: Number,
        required:true
    },
    per_km_rate: {
        type: Number,
        default: 7
    },
    surge_amount: {
        type: Number,
        default: 0
    },
    total_earning: {
        type: Number,
        required:true
    },
    payment_status: {
        type: String,
        enum: ["pending","paid"],
        default: "pending"
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model(" rider_earnings",RiderEarningScheama);