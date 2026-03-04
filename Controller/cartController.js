import Cart from '../Models/Cart.js';
import Product from '../Models/Products.js';

export const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const userId = req.user.id;

        if (!product_id) {
            return res.status(400).json({ message: "Product ID required" });
        }

        const product = await Product.findById(product_id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user_id: userId });

        if (!cart) {
            cart = new Cart({
                user_id: userId,
                storeId: product.store_id,
                items: [{
                    product_id,
                    quantity: quantity || 1
                }]
            });
        } 
        
        else {

            if (cart.storeId.toString() !== product.store_id.toString()) {
                return res.status(400).json({
                    message: "You can only add products from one store at a time"
                });
            }

            const itemIndex = cart.items.findIndex(
                item => item.product_id.toString() === product_id
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity || 1;
            } else {
                cart.items.push({
                    product_id,
                    quantity: quantity || 1
                });
            }
        }

        await cart.save();

        return res.status(200).json({
            message: "Product added successfully"
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const clearCart = async(req,res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOneAndDelete(userId);

        res.status(200).json({message:"Cart Cleared Successfully"});
    }   
    catch(err) {
        res.status(500).json({message: err.message});
    }
}

export const getMyCart = async(req,res) => {
    try {
        const cart = await Cart.findOne({
            user_id:req.user.id
        }).populate("items.product_id");

        if(!cart) {
            return res.status(200).json({message:"Cart Is Empty"})
        }

        res.status(200).json(cart);
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
}

export const removeCartItem = async(req,res) => {
    try {
        const {product_id} = req.body;

        const cart = await Cart.findOne({user_id:req.user.id});

        if(!cart) {
            return res.status(404).json({message: "Cart Not Found"});
        }
        cart.items =  cart.items.filter(
            item => item.product_id.toString() !== product_id
        )

        await cart.save();

        res.status(200).json({message:"Item Removed From The Carts"});
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
}

export const updateCartItem = async(req,res) => {
    try {
        const {product_id,quantity} = req.body;

        const cart = await Cart.findOne({user_id:req.user.id});

        if(!cart) {
            return res.status(404).json({message: "Cart Not Found"});
        }
        const item = cart.items.find(
            item => item.product_id.toString() === product_id
        )

        if(!item) {
            return res.status(404).json({message: "Item Not Found In The Cart"});
        }
        item.quantity = quantity;

        await cart.save();

        res.status(200).json({message:"Cart Updated"});
    }   
    catch(err) {
        res.status(500).json({message: err.message});
    }
}