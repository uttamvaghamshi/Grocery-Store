import RiderAadhar from '../Models/Aadhar.js';
import Rider from '../Models/Rider.js';
import cloudinary from '../Config/cloudinary.js';
import dotenv from 'dotenv';
import streamUpload from '../Utils/streamUpload.js';

dotenv.config();

export const uploadAadhar = async (req, res) => {
    try {
        const { rider_id } = req.params;
        const { aadhar_number } = req.body;

        const rider = await Rider.findById(rider_id);
        if (!rider) {
            return res.status(404).json({ message: "Rider not found" });
        }

        const existing = await RiderAadhar.findOne({ rider_id });
        if (existing) {
            return res.status(400).json({ message: "Aadhar already uploaded" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Aadhar image is required" });
        }

        const result = await streamUpload(
            req.file.buffer,
            "rider_aadhar"
        );

        const newAadhar = await RiderAadhar.create({
            rider_id,
            aadhar_number,
            aadhar_image: result.secure_url
        });

        res.status(201).json({
            message: "Aadhar uploaded successfully",
            data: newAadhar
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getRiderAadhar = async(req,res) => {
    try {
        const {rider_id} = req.params;

        const aa = await RiderAadhar.findOne({rider_id}).populate("rider_id","name email phone");

        if(!aa) {
            return res.status(404).json({message:"Aadhar not found for this rider"});
        }
        res.status(200).json(aa);
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }

}

//Admin Side The Change The Status

export const updateStatus = async(req,res) => {
    try {
        const {id} =  req.params;
        const {verification_status} = req.body;

        if(!["verified","rejected"].includes(verification_status)) {
            return res.status(400).json({message:"Invalid verification status"});
        }
        
        const updated = await RiderAadhar.findByIdAndUpdate(
            id,
            {verification_status},
            {new : true}
        )

        if (!updated) {
            return res.status(404).json({message:"Aadhar record not found"});
        }
        res.status(200).json({
            message:"Verification Status Updated"
        })
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}