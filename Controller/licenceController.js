import Licence from '../Models/Licence.js';
import cloudinary from '../Config/cloudinary.js';
import streamifier from "streamifier";
import RiderLicence from '../Models/Licence.js';
import streamUpload from '../Utils/streamUpload.js';

export const uploadLicence = async (req, res) => {
    try {
        const riderid = req.user.id;
        const { license_number, expiry_date } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "License image is required" });
        }

        const existing = await RiderLicence.findOne({ riderid });
        if (existing) {
            return res.status(400).json({ message: "License already uploaded" });
        }

        const result = await streamUpload(
            req.file.buffer,
            "rider_licence"
        );

        const newLicence = await RiderLicence.create({
            riderid,
            license_number,
            expiry_date,
            license_image: result.secure_url,
        });

        res.status(201).json({
            message: "License uploaded successfully",
            data: newLicence,
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



export const updateLicenseStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { verification_status } = req.body;

        if (!["verified", "rejected"].includes(verification_status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updated = await RiderLicence.findByIdAndUpdate(
            id,
            { verification_status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "License not found" });
        }

        res.status(200).json({
            message: "Verification updated",
            data: updated,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};