import DeliverTracking from '../Models/Tracking.js';
import Order from '../Models/Order.js';

export const startTracking = async(req,res) => {
    try {
        const {order_id,rider_id} = req.body;

        const existing = await DeliverTracking.findOne({order_id});

        if(existing) {
            return res.status(400).json({message:"Tracking already exists for this order"});
        }
        const tracking = await DeliverTracking.create({
            order_id,
            rider_id,
            status:"assigned"
        });
        res.status(201).json({message:"Tracking Started"});

    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const updateLocation = async(req,res) => {
    try {
        const rider_id = req.user.id;
        const {order_id,current_lat,current_lan} = req.body;

        const tracking = await DeliverTracking.findOneAndUpdate(
            {order_id,rider_id},
            {
                current_lan,
                current_lat,
                updated_at : Date.now()
            },
            {new:true}
        );

        if(!tracking) {
            return res.status(404).json({message:"Tracking not found"});
        }
        res.status(200).json({
            message:"Location Updated Successfully"
        });

    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const updateDelveryStatus = async(req,res) => {
    try {
        const {order_id}= req.params;
        const {status} = req.body;

        const tracking = await DeliverTracking.findOneAndUpdate(
            {order_id},
            {status},
            {new:true}
        );

        if(!tracking) {
            return res.status(404).json({message:"Tracking not found"});
        }

        res.status(200).json({
            message:"Delivery Status Updated",
        });

    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const getTrackingDetails = async(req,res) => {
    try {
        const {order_id} = req.params;

        const tracking = await DeliverTracking.findOne({order_id}).populate("rider_id","name phone");

        if(!tracking) {
            return res.status(404).json({message:"Tracking Not Founds"});
        }
        res.status(200).json(tracking);

    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const getRiderActiveTracking = async(req,res) => {
    try {
        const rider_id  = req.user.id;
        const tracking = await DeliverTracking.find({rider_id,status:{$ne:"delivered"}});

        res.status(200).json(tracking);
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}
