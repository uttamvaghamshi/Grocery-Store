import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import StoreAdmin from "../Models/StoreAdmin.js";


export const registerStoreAdmin = async (req, res) => {
  try {
    const {
      username,
      password,
      latitude,
      longitude,
      city,
      area
    } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    if ((latitude !== undefined || longitude !== undefined) && 
        (typeof latitude !== 'number' || typeof longitude !== 'number')) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude must be valid numbers if provided"
      });
    }

    const existingAdmin = await StoreAdmin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new StoreAdmin({
      username,
      password_hash: hashedPassword,
      location: latitude !== undefined && longitude !== undefined 
        ? { lat: Number(latitude), long: Number(longitude) } 
        : undefined,
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Store admin registered successfully",
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        role: newAdmin.role,
        location: newAdmin.location || null
      }
    });

  } catch (error) {
    console.error("Store admin registration error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message
    });
  }
};


export const loginStoreAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
    }

    const admin = await StoreAdmin.findOne({ username }).select('+password_hash');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username,
        role: admin.role
      },
      process.env.ACCESS_SECRET,
      { expiresIn: "10d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        location: admin.location || null,   
      }
    });

  } catch (error) {
    console.error("Store admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message
    });
  }
};

export const getAllStores = async (req, res) => {
  try {
    const stores = await StoreAdmin.find({ isActive: true });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}