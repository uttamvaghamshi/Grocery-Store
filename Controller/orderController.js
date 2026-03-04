import Order from '../Models/Order.js';
import OrderItem from '../Models/OrderItems.js';
import Cart from '../Models/Cart.js';
import Rider from '../Models/Rider.js';
import Wallet from '../Models/Wallet.js';

export const placeOrder = async(req,res) => {
    try {
        const user_id = req.user.id;
        const {address_id} = req.body;

        const cart = await Cart.findOne({user_id}).populate("items.product_id");

        if(!cart || cart.items.length === 0) {
            return res.status(400).json({message:"Cart Is Empty"});
        }
        let total = 0;
        cart.items.forEach(item => {
            total+= item.product_id.price * item.quantity
        });

        const order = await Order.create({
            user_id,
            address_id,
            storeId:cart.storeId,
            total_amount:total
        });

        for (let item of cart.items) {
            await OrderItem.create({
                order_id:order._id,
                product_id:item.product_id._id,
                quantity: item.quantity,
                price: item.product_id.price
            });
        }

        cart.items = [];
        await cart.save();

        res.status(201).json({
            message:"Order Placed Successfully",
            order
        });


    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const getUserOrders = async(req,res) => {
    try {
        const user_id = req.user.id;

        const orders = await Order.find({user_id}).sort({created_at: -1});

        res.status(200).json(orders);

    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const getSingleOrder = async(req,res) => {
    try {
        const {id} = req.params;

        const order = await Order.findById(id).populate("user_id","name email").populate("address_id").populate("rider_id","name phone");

        const items = await OrderItem.find({order_id:id}).populate("product_id");

        res.status(200).json({order,items});
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const cancelOrder = async(req,res) => {
    try {
        const {id} = req.params;

        const order = await Order.findById(id);

        if(!order) {
            return res.status(404).json({message:"Order Not Found"});
        }
        if(order.status !== "pending") {
            return res.status(400).json({message:"Cannot Cancel The Order"});
        }

        order.status = "cancelled";
        await order.save();

        res.status(200).json({message:"Order Cancelled"});
    }
    catch(err) {
        res.status(500).json({message:err.message});            
    }
}

// export const confirmOrder = async(req,res) => {
//     try {
//         const {id} = req.params;

//         const order = await Order.findByIdAndUpdate(
//             id,
//             {status:"confirmed"},
//             {new:true}
//         )
//         res.status(200).json(order);
//     }
//     catch(err) {
//         res.status(500).json({message:err.message});
//     }
// }

//Assign The Riderr

// export const assignRider = async(req,res) => {
//     try {
//         const {id} = req.params;
//         const {rider_id} = req.body;

//         const order = await Order.findByIdAndUpdate(
//             id,
//             {rider_id,status:"out_for_delivery"},
//             {new:true}
//         );
//         if(!order) {
//             return res.status(404).json({message:"Order Not Found"});
//         }
//         res.status(200).json(order);



//     }
//     catch(err) {
//         res.status(500).json({message:err.message});
//     }
// }

// export const updateOrderStatus = async(req,res) => {
//     try {
//         const {id} = req.params;
//         const {status} = req.body;

//         const order = await Order.findByIdAndUpdate(
//             id,
//             {status},
//             {new:true}
//         );

//         res.status(200).json(order);
//     }
//     catch(err) {
//         res.status(500).json({message:err.message});
//     }
// }


export const getStoreOrders = async (req, res) => {
    try {

        const storeId = req.user.id;

        const orders = await Order.find({ storeId })
            .populate("user_id", "name email");

        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {

                const items = await OrderItem.find({
                    order_id: order._id
                }).populate("product_id", "name price");

                return {
                    ...order.toObject(),
                    items
                };
            })
        );

        return res.status(200).json({
            success: true,
            orders: ordersWithItems
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const acceptOrder = async(req,res) => {
    try {
        const storeAdminId = req.user.id;
        const {orderId} = req.params;

        const order = await Order.findOne({_id: orderId,storeId:storeAdminId});

        console.log(order);
        

        if(!order) {
            return res.status(404).json({message:"Order Not Found"});
        }
        if(order.status !== "pending") {
            return res.status(400).json({message:"Cannot Accept The Order"});
        }
        order.status = "confirmed";
        order.acceptedAt = new Date();
        await order.save();

        res.status(200).json({message:"Order Updated Successfully",order});
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

//Assign Rider By The Admins 
export const AssignRider = async(req,res) => {
    try {
        const storeAdminId = req.user.id;
        const {orderId} = req.params;
        const {rider_id} = req.body;

        const order = await Order.findOne({_id:orderId,storeId:storeAdminId});

        if(!order) {
            return res.status(404).json({message:"Order Not Found"});
        }
        if(order.status !== "confirmed") {
            return res.status(400).json({ success: false, message: "Order must be Confirmed first" });
        }

        const rider = await Rider.findById(rider_id);

        if(!rider) {
            return res.status(404).json({message:"Rider Not Found"});
        }
        if(!rider.is_available) {
            return res.status(400).json({message:"Rider Not Available"});
        }
        order.rider_id = rider_id;
        order.status = "out_for_delivery";
        order.assignedAt = new Date();
        await order.save();

        rider.is_available = false;
        rider.currentOrderId = order._id;
        await rider.save();

        res.status(200).json({
            success: true,
            message: "Rider assigned successfully",
            order
        });

    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const completeDelivery = async (req, res) => {
    try {
        const riderId = req.user.id;
        const { orderId } = req.params;

        const order = await Order.findOne({ _id: orderId, rider_id: riderId });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found or not assigned to you" });
        }

        if (order.status !== "out_for_delivery") {
            return res.status(400).json({ success: false, message: "Order is not out for delivery" });
        }

        const commision = order.total_amount * 0.1;

        order.status = "delivered";
        order.deliveredAt = new Date();
        await order.save();

        const rider = await Rider.findById(riderId);
        rider.is_available = true;
        rider.currentOrderId = null;
        rider.wallet_balance += commision;
        rider.total_earnings += commision;
        await rider.save();

        await Wallet.create({
            rider_id: rider._id,
            order_id: order._id,
            amount: riderCommission,
            type: "credit"
        });

        res.status(200).json({
            success: true,
            message: "Delivery completed successfully. Rider is now available.",
            order
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};