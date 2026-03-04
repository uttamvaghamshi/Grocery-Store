import jwt, { decode } from 'jsonwebtoken';
import User from '../Models/User.js';
import Rider from '../Models/Rider.js';
import StoreAdmin from '../Models/StoreAdmin.js';
import superAdmin from '../Models/superAdmin.js';

const protect = async(req,res,next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        const decoded = jwt.verify(token,process.env.ACCESS_SECRET);

        let account;

        if (decoded.role === "user") {
            account = await User.findById(decoded.id);
        }
        if (decoded.role === "rider") {
            account = await Rider.findById(decoded.id);
        }
        if (decoded.role === "store_admin") {
            account = await StoreAdmin.findById(decoded.id);
        }
         if (decoded.role === "super_admin") {
            account = await superAdmin.findById(decoded.id);
        }

         console.log("DECODED:", decoded);

        if(!account) {
            return res.status(404).json({message:"User Not Found"});
        }

        req.user = account;
        req.role = decoded.role;
        req.id = decoded.id;

        next();
    }
    catch(err) {
        res.status(401).json({message:"Not Authorized"});
    }

}

export default protect;

