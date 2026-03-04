import ProductImages from "../Models/ProductImages.js";
import Products from "../Models/Products.js";
import StreamUpload from "../Utils/streamUpload.js";
import cloudinary from "../Config/cloudinary.js";

export const uploadProductImage = async (req, res) => {
    try {
        const { product_id } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const product = await Products.findById(product_id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        console.log("REQ ID:", req.id);
        console.log("PRODUCT STORE ID:", product.store_id.toString());
        if (product.store_id.toString() !== req.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const result = await StreamUpload(
            req.file.buffer,
            "grocery_app/products"
        );

        const productImage = await ProductImages.create({
            product_id,
            image_url: result.secure_url,
        });

        return res.status(201).json({
            success: true,
            message: "Product image uploaded successfully",
            data: productImage,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getProductImages = async (req, res) => {
    try {
        const { product_id } = req.params;

        const images = await ProductImages.find({ product_id });

        return res.status(200).json({
            success: true,
            count: images.length,
            data: images,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
export const deleteProductImage = async (req, res) => {
    try {
        const { image_id } = req.params;

        const image = await ProductImages.findById(image_id);

        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        const product = await Products.findById(image.product_id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.store_id.toString() !== req.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Extract public_id properly
        const public_id = image.image_url
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];

        await cloudinary.uploader.destroy(public_id);

        await image.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Image deleted successfully",
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};