import Rider from '../Models/Rider.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Order from '../Models/Order.js';
import streamUpload from '../Utils/streamUpload.js';
import Wallet from '../Models/Wallet.js';


export const registerRider = async (req, res) => {
    try {
        const { name, email, phone, password ,selectedStores,dob} = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const result = await streamUpload(
            req.file.buffer,
            "riders_profile"
        );

        const hashedPassword = await bcrypt.hash(password, 10);

        const rider = await Rider.create({
            name,
            email,
            phone,
            image_url: result.secure_url,
            password_hash: hashedPassword,
            dob,
            selectedStores
        });

        res.status(201).json({
            message: "Rider Registered Successfully",
            rider
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginRider = async(req,res) => {
    try {
        const {email,password} = req.body;

        const rider = await Rider.findOne({email});

        if(!rider) {
            res.status(400).json({message:"Invalid Credentials"});
        }
        const isMatch = await bcrypt.compare(password,rider.password_hash);
        if(!isMatch) {
            res.status(400).json({message:"Invalid Credentials"});
        }
        const token = jwt.sign(
            {
                id: rider._id,
                role: rider.role,
            },
            process.env.ACCESS_SECRET,
            {
                expiresIn:"10d"
            }
        )
        return res.status(200).json({
            message:"Login Successful",
            token,
            rider
        })
        
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const getAllRiders = async(req,res) => {
    try {
        const riders = await Rider.find().select("-password");
        res.status(200).json(riders);
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const getSingleRider = async(req,res) => {
    try {
        const rider = await Rider.findById(req.params.id).select("-password_hash");

        if(!rider) {
            return res.status(404).json({message:"Rider not found"});
        }
        res.status(200).json(rider);
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const updateRider = async(req,res) => {
    try {
        const updates = req.body;
        const rider = await Rider.findByIdAndUpdate(
            req.params.id,
            updates,
            {new:true}
        ).select("-password_hash");

        if(!rider) {
            return res.status(404).json({message:"Rider Not Founds"});
        }
        res.status(200).json({
            message:"Rider Updated ",
            rider
        });
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const deleteRider = async(req,res) => {
    try {
        const rider = await Rider.findByIdAndDelete(
            req.params.id
        );
        if(!rider) {
            return res.status(404).json({message:"Rider Not Found"});
        }
        res.status(200).json({
            message:"Rider Deleted Successfully"
        })

    }
    catch(err) {
        res.status(500).json({message:err.message});
    } 
}

export const updateKycStatus = async(req,res) => {
    try {
        const {kyc_status} = req.body;

        if(!["approved","rejected"].includes(kyc_status)) {
            return res.status(400).json({message:"Invalid KYC Status"});
        }
        const rider = await Rider.findByIdAndUpdate(
            req.params.id,
            {kyc_status},
            {new:true}
        )

        if(!rider) {
            return res.status(404).json({message:"Rider Not Found"});
        }
        res.status(200).json({
            message:"KYC Status Updated",
            rider
        })

    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

//Toggles 
export const toggleAvailabilty = async(req,res) => {
    try {
        const rider = await Rider.findById(req.params.id);
        if(!rider) {
            return res.status(404).json({message:"Rider Not Found"});
        } 
        if(rider.kyc_status !== "approved") {
            return res.status(400).json({message:"Rider KYC Not Approved"});
        }
        
        rider.is_available = !is_available;
        await rider.save();

        res.status(200).json({
            message:"Availabilty Updated",
            is_available:rider.is_available
        });
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}


export const getPendingOrders = async(req,res) => {
    try {
        const orders = await Order.find({
        status: "pending",  
        rider_id: null        
        })
        .populate("user_id", "name phone")
        .populate("address_id")
        .select("total_amount status created_at");
        res.json({
            message:"Pending Orders Fetched",
            count: orders.length,
            orders
        });
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const acceptOrder = async (req, res) => {
    try {
        const rider_id = req.user.id;
        const { orderId } = req.params;

        const order = await Order.findOneAndUpdate(
            {
                _id: orderId,
                status: "confirmed",  
                rider_id: null        
            },
            {
                status: "out_for_delivery",
                rider_id: rider_id
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not available or already accepted"
            });
        }

        res.status(200).json({
            success: true,
            message: "Order accepted successfully",
            order
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getMyActiveOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            rider: req.user.id,
            status: { $in: ["accepted", "picked", "out_for_delivery"] }
        })
        .populate("user", "name phone")
        .populate("items.product");

        res.json(orders);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = [
            "picked",
            "out_for_delivery",
            "delivered"
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const order = await Order.findOneAndUpdate(
            {
                _id: req.params.orderId,
                rider: req.user.id
            },
            { status },
            { new: true }
        );

        if (!order)
            return res.status(404).json({ message: "Order not found" });

        res.json({
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getRiderWallet = async (req, res) => {
    try {
        const rider = await Rider.findById(req.user.id);

        res.status(200).json({
            wallet_balance: rider.wallet_balance,
            total_earnings: rider.total_earnings
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getWalletHistory = async (req, res) => {
    try {
        const transactions = await Wallet.find({ rider_id: req.user.id })
            .populate("order_id");

        res.status(200).json(transactions);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


export const riderProfile = async(req,res) => {
    try {
        const {rider_id} = req.user.id;

        const profile = await Rider.findOne({rider_id});
        if(!profile) {
            return res.status(404).json({message:"Rider Not Found"});
        }
        res.status(200).json({
            status: true,
            message:"Rider Profile Fetched",
            profile
        });
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

