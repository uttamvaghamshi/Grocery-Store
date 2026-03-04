import mongoose from "mongoose";

const superAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password_hash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "super_admin"
    },
    status: {
        type: Boolean,
        default: true
    }
},{timestamps:true});

export default mongoose.model("super_admins",superAdminSchema);

