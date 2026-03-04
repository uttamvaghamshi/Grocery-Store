import mongoose from "mongoose";

const riderSchema = new mongoose.Schema({
    name : {
        required: true,
        type: String
    },
    image_url : {
        required: true,
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone : {
        type: String,
        unique: true,
        required: true  
    },
    password_hash: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    selectedStores : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store"
        }
    ],
    role : {
        type: String,
        default: "rider"
    },
    is_available: {
        type: Boolean,
        default: false
    },
    wallet_balance : {
        type: Number,
        default: 0
    },
    total_earnings : {
        type: Number,
        default: 0
    }

})

export default mongoose.model("riders",riderSchema);

