import User from '../Models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../Utils/generateToken.js';
import dotenv from 'dotenv';
import streamUpload from '../Utils/streamUpload.js';

dotenv.config();

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, phone, role, lat, long } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let imageUrl = null;

        if (req.file && req.file.buffer) {
            try {
                const uploadResult = await streamUpload(
                    req.file.buffer, 
                    "grocery-users"        
                );
                
                imageUrl = uploadResult.secure_url;  
            } catch (uploadError) {
                console.error("Cloudinary upload failed:", uploadError);
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed",
                    error: uploadError.message
                });
            }
        }

        const user = await User.create({
            name,
            email,
            phone,
            password_hash: hashedPassword,
            role: role || "user",         
            image_url: imageUrl,
            location: lat && long ? { lat: Number(lat), long: Number(long) } : undefined,
            loginCount: 0
        });


        res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image_url: user.image_url,
                role: user.role,
                location: user.location
            }
        });
    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password, lat, long } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email }).select('+password_hash'); 

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        user.loginCount = (user.loginCount || 0) + 1;

        if (lat && long) {
            user.location = {
                lat: Number(lat),
                long: Number(long)
            };
        }

        await user.save();

        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image_url: user.image_url,
                role: user.role,
                location: user.location,
                loginCount: user.loginCount
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login" });
    }
};

export const profile = async (req, res) => {
    try {
        const user = req.user;

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image_url: user.image_url,
                role: user.role,
                location: user.location,
                loginCount: user.loginCount,
                created_at: user.created_at
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, phone, email, password, lat, long } = req.body;

        const user = await User.findById(userId).select("+password_hash");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }

        if (phone && phone !== user.phone) {
            const phoneExists = await User.findOne({ phone });
            if (phoneExists) {
                return res.status(400).json({ message: "Phone already in use" });
            }
            user.phone = phone;
        }

        if (name) user.name = name;

        if (password) {
            user.password_hash = await bcrypt.hash(password, 10);
        }

        if (lat !== undefined && long !== undefined) {
            user.location = {
                lat: Number(lat),
                long: Number(long)
            };
        }

        if (req.file && req.file.buffer) {
            try {
                const uploadResult = await streamUpload(
                    req.file.buffer,
                    "grocery-users"
                );

                user.image_url = uploadResult.secure_url;

            } catch (uploadError) {
                console.error("Cloudinary upload failed:", uploadError);
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed",
                    error: uploadError.message
                });
            }
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                image_url: user.image_url,
                role: user.role,
                location: user.location,
                loginCount: user.loginCount
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};