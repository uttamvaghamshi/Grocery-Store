import Address from '../Models/UserAddress.js';

export const addAddress = async(req,res) => {
    try {
        const userId = req.user.id;

        const {house,street,area,city,pincode,latitude,longitude} = req.body;

        if(!house || !street || !area || !city || !pincode || !latitude || !longitude) {
            return res.status(400).json({message: "All fields are required"});
        }

        const address = await Address.create({
            user_id: userId,
            house,
            street,
            area,
            city,
            pincode,
            latitude,
            longitude
        });

        res.status(201).json({message:"Address Added Successfully"});
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
}

export const getMyAddress = async(req,res) => {
    try {
        const userId = req.user.id;

        const address = await Address.find({user_id:userId});

        res.status(200).json(address);
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
}

export const updateAddress = async(req,res) => {
    try {
        const {addressId} = req.params;
        const userId = req.params.id;

        const addrees = await Address.findOne({
            _id:addressId,
            user_id: userId
        });

        if (!addrees) {
            return res.status(404).json({message:"Address Not Founds"});
        }

        Object.assign(addrees,req.body);

        res.json({
            message:"Address Updated Successfully"
        })
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const deleteAddress = async(req,res) => {
    try {
        const {addressId} = req.params;
        const userId = req.user.id;

        const address = await Address.findOneAndDelete({
            _id:addressId,
            user_id: userId
        });

        if(!address) {
            return res.status(404).json({message:"Address Not Found"});
        }
        res.json({
            message:"Address Deleted Succeessffully"
        });
    }
    catch(err) {
        res.status(500).json({message:err.messsage});
    }

}