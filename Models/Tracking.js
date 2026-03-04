import mongoose from "mongoose";

const delivery_tracking_schema = new mongoose.Schema({
    order_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"orders"
    },
    rider_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"riders"
    },
    current_lat: {
        type: Number
    },
    current_lan: {
        type: Number
    },
    status: {
        type: String
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("delivery_tracking",delivery_txracking_schema);
