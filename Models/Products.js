import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    store_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "store_admins",
        required:true
    },
    name: {
        type:String,
        required:true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type:Number,
        required:true
    },
    available_quantity: {
        type:Number,
        default: 0
    },
    amount : {
        type: String,
    },
    description : {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    }
})

productSchema.virtual("images", {
    ref: "product_images",       
    localField: "_id",           
    foreignField: "product_id"  
});

productSchema.set("toObject", { virtuals: true });
productSchema.set("toJSON", { virtuals: true });

export default mongoose.model("products",productSchema);

