import Payment from "../Models/Payment.js";
import Order from '../Models/Order.js';

export const createPayment = async(req,res) => {
    try {
        const {order_id,method,transaction_id} = req.body;

        const order = await Order.findById(order_id);

        if(!order) {
            return res.status(404).json({message:"Order Not Found"});
        }

        const payment = await Payment.create({
            order_id,
            method,
            transaction_id,
            status: method === "COD" ? "pending" : "success"
        });

        res.status(201).json({
            message:"Payment Created Successfully",
            payment
        });
    }   
    catch(err) {
        return res.status(500).json({message:err.message});
    }
}

export const updatePaymentStatus = async(req,res) => {
    try {
        const {status} = req.body;

        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            {status},
            {new:true}
        );

        if(!payment) {
            return res.status(404).json({message:"Payment Not Found"});
        }
        res.status(200).json({
                message:"Payment Updated Successfully",
                payment
        });
    }
    catch(err) {
        return res.status(500).json({message:err.message});
    }


}

export const getPaymentByOrder = async(req,res) => {
    try {
        const payment = await Payment.findOne({
            order_id:req.params.orderId
        }).populate("order_id");

        if(!payment) {
            return res.status(404).json({message:"Payment Not Found"});
        }
        res.status(201).json(payment);
    }
    catch(err) {
        return res.status(500).json({message:err.message});
    }
}

export const getAllPayments = async(req,res) => {
    try {
        const payments = await Payment.find().populate("order_id").sort({created_at: -1});
        res.status(201).json(payments);
    }
    catch(err) {
        return res.status(500).json({message:err.message});
    }
}
