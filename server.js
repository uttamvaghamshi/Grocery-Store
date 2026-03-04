import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './Config/db.js';
import morgan from "morgan";
import helmet from "helmet";
import userRoutes from './Routes/userRoutes.js';
import productRoute from './Routes/productRoutes.js';
import adminRoute from './Routes/adminRoutes.js';
import cartRoute from './Routes/cartRoutes.js';
import addressRoute from './Routes/addressRoutes.js';
import productImageRoute from './Routes/productImageRoutes.js';
import orderRoutes from './Routes/orderRoutes.js';
import riderRoutes from './Routes/riderRoutes.js';
import superAdmin from './Routes/superAdminRoutes.js';
import licenceRoutes from './Routes/licenceRoutes.js';
import aadharRoutes from './Routes/aadharRoutes.js';

dotenv.config();
connectDb();
const app = express();

//Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Routes Defined
app.use('/auth',userRoutes);
app.use('/products',productRoute);
app.use('/store-admin',adminRoute);
app.use('/cart',cartRoute);
app.use('/address',addressRoute);
app.use('/product-image',productImageRoute);
app.use('/orders',orderRoutes);
app.use('/riders',riderRoutes);
app.use('/super-admin',superAdmin);
app.use('/licence',licenceRoutes);
app.use('/aadhar',aadharRoutes);

if(process.env.NODE_ENV === "devlopment") {
    app.use(morgan("dev"));
}


//Routes Mains 
app.get('/',(req,res) => {
    res.json({message:"Android Grocery Api Is Running"});
});


//404 Apis 
app.use((req,res) => {
    res.status(404).json({message:"Api Not Found "})
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Running On The Port Is ${PORT}`);
    
})
