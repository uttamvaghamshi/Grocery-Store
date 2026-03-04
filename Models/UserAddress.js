import mongoose from "mongoose";

const user_address_schema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    house : {
        type: String
    },
    street: {
        type: String
    },
    area: {
        type: String
    },
    city: {
        type: String
    },
    pincode: {
        type: String
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    }  
})
export default mongoose.model("addresses",user_address_schema);