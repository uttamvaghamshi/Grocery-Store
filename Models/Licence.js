import mongoose from "mongoose";

const licenseSchema = new mongoose.Schema({
    rider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "riders",
    },
    license_number: {
        type: String,
        required: true,
        unique: true
    },
    expiry_date: {
        type: Date,
        required: true
    },
    license_image : {
        required: true,
        type: String
    },
    verification_status: {
        type: String,
        enum: ["pending","verified","rejected"],
        default: "pending"
    }
})

export default mongoose.model("rider_driving_licence",licenseSchema);

