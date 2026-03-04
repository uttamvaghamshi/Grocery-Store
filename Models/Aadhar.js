import mongoose from "mongoose";

const aadharSchema = new mongoose.Schema({
    rider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "riders",
        unique:true
    },
    aadhar_number: {
        type:String,
        required:true,
        unique:true
    },
    aadhar_image: {
        required: true,
        type: String
    },
    verification_status: {
        type: String,
        enum: ["pending","verified","rejected"],
        default: "pending"
    }
})

export default mongoose.model("rider_aadhar",aadharSchema);

