import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        required: true,
        type: String
    },
    image_url : {
        type: String
    },
    email : {
        type: String,
        unique: true,
        required: true
    },
    phone : {
        type: String,
        unique: true,
        required: true
    },
    password_hash : {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default:"user"
    },
    location: {
        lat: Number,
        long: Number
    },
    loginCount: {
        type: Number,
        default: 0
    }
})

export default mongoose.model("users",userSchema);

