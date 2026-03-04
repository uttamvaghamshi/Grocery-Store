import superAdmin from '../Models/superAdmin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import StoreAdmin from '../Models/StoreAdmin.js';
import Rider from '../Models/Rider.js';
import User from '../Models/User.js';

export const registerSuperAdmin = async(req,res) => {
    try {
        const {name,email,password,phone} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);

        const admin = await superAdmin.create(
            {
                name,
                email,
                phone,
                password_hash:hashedPassword
            }
        );
        res.status(201).json({
            message:"Super Admin Registered Successfully",
            admin
        });
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const loginSuperAdmin = async(req,res) => {
    try {
        const {email,password} = req.body;
        const admin = await superAdmin.findOne({
            email
        });

        if(!admin) {
            return res.status(400).json({message:"Admin Not Founds"})
        }

        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { id: admin._id, role: "super_admin" },
            process.env.ACCESS_SECRET,
            { expiresIn: "10d" }
        );
        res.status(200).json({
            message: "Login Successful",
            token,
            admin
        });
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const getAllStoreAdmins = async(req,res) => {
    try {
        const stores = await StoreAdmin.find().sort({createdAt: -1});

        res.json(stores);
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const deleteStoreAdmins = async(req,res) => {
    try {
        await StoreAdmin.findByIdAndDelete(req.params.id);
        res.json({message:"Store Admin Deleted"});

    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}


//Get All Riders 
export const getAllRiders = async(req,res) => {
    try {
        const riders = await Rider.find().sort({createdAt: -1});
        res.json(riders);
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const getAllUsers = async(req,res) => {
    try {
        const users = await User.find().sort({createdAt: -1});

        res.json(users);
    }   
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const deleteUsers = async(req,res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({message:"User Deleted"});
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}


//Dashboard Stats 
export const getDashboardStats = async(req,res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRiders = await Rider.countDocuments();
        const totalStoreAdmins = await StoreAdmin.countDocuments();
        res.json({
            totalUsers,
            totalRiders,
            totalStoreAdmins
        });
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

