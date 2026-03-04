import Order from '../Models/Order.js';
import RiderEarning from '../Models/RiderEarning.js';

export const createRiderEarning = async(req,res) => {
    try {
        const {order_id,distance_km} = req.body;

        const order = await Order.findById(order_id);

        if(!order) {
            return res.status(404).json({message:"Order Not Found"});
        }
        if(!order.rider_id) {
            return res.status(400).json({message:"Rider Not Assigned to this order"});
        }
        if(order.status !== "delivered") {
            return res.status(400).json({message:"Now The Order is Not Delivered Yet"});
        }

        const base_amount = 30;
        const per_km_rate = 7;
        const surge_amount = 0;

        const total_earning = base_amount + (distance_km * per_km_rate) + surge_amount;

        const earning = await RiderEarning.create({
            rider_id: order.rider_id,
            order_id:order._id,
            total_order_amount: order.total_amount,
            distance_km,
            base_amount,
            per_km_rate,
            surge_amount,
            total_earning
        }); 

        res.status(200).json({
            message:"Rider Earning Created Successfully",
            earning
        });
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}