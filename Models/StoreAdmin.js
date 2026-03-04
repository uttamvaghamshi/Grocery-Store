import mongoose from "mongoose";

const store_admin_schema = new mongoose.Schema({
   username: {
      type: String,
      required: true,
      unique: true
   },
   password_hash: {
      type: String,
      required: true
   },
   area: {
      type: String,
      required: true
   },
   role: {
      type: String,
      default: "store_admin"
   },
   location: {
    lat: {
      type: Number,
      required: true
    },
    long: {
      type : Number,
      required: true
    }
   }
});

export default mongoose.model("store_admins", store_admin_schema);