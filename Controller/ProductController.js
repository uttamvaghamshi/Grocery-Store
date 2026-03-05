import Product from '../Models/Products.js';
import findNearestStore from '../Utils/distance.js';
import User from '../Models/User.js';

export const addProduct = async(req,res) => {
    try {
        const {name,category, description, price,amount,available_quantity} = req.body;

        const product = await Product.create({
            store_id: req.user.id,
            name,
            category,
            description,
            price,
            amount,    //Discount
            available_quantity
        });

        res.status(201).json({
        message: "Product Added Successfully",
        product
        });
    }
    catch(err) {
        res.status(500).json({message:"Failed to add product", error: err.message});
    }
}

export const getNearestStoreProducts = async(req,res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user.location) {
            return res.status(400).json({ message: 'User location not set' });
        }
        const nearestStore = await findNearestStore(user.location.lat, user.location.long);

        if(!nearestStore) {
            return res.status(404).json({message:"No Store Found Nearby"});
        }
        const products = await Product.find({store_id:nearestStore._id});
        res.json(products);
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const getNearestStoreProductsSingle = async(req,res) => {
    try {
        const user = await User.findById(req.user.id);
        const {productId} = req.params;
        if (!user.location) {
            return res.status(400).json({ message: 'User location not set' });
        }
        const nearestStore = await findNearestStore(user.location.lat, user.location.long);

        if(!nearestStore) {
            return res.status(404).json({message:"No Store Found Nearby"});
        }
        const products = await Product.find({store_id:nearestStore._id,_id:productId});
        res.json(products);
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const getNearestStoreProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const user = await User.findById(req.user.id);

    if (!user || !user.location) {
      return res.status(400).json({ message: "User location not set" });
    }

    const nearestStore = await findNearestStore(
      user.location.lat,
      user.location.long
    );

    if (!nearestStore) {
      return res.status(404).json({ message: "No Store Found Nearby" });
    }

    const products = await Product.find({
      store_id: nearestStore._id,
      category: categoryName
    })
      .populate("images")  
      .lean();

    res.status(200).json({
      store: nearestStore.storeName,
      category: categoryName,
      totalProducts: products.length,
      products
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyStoreProducts = async (req, res) => {
  try {
    const products = await Product.find({ store_id: req.user.id })
      .populate("images");

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getSingleProduct = async(req,res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if(!product) {
            return res.status(404).json({message:"Product Not Found"});
        }
        res.status(200).json(product);
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}

export const deleteProduct = async(req,res) => {
    try {
        const product = await Product.findById(req.params.id);

        if(!product) {
            return res.status(404).json({message:"Product Not Found"});
        }

        if(product.store_id.toString() !== req.user.id) {
            return res.status(403).json({message:"Unauthorized"});
        }
        await product.deleteOne();

        res.status(200).json({message:"Product Deleted Successfully"});
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
}

export const updateProduct = async(req,res) => {
    try {
        const product = await Product.findById(req.params.id);

        if(!product) {
            return res.status(404).json({message:"Product Not Found"});
        }

        if(product.store_id.toString() !== req.user.id) {
            return res.status(403).json({message:"Not Authorized"});
        }

        Object.assign(product,req.body);

        await product.save();

        res.status(200).json({message:"Product Updated Successfully"});
    }
    catch(err) {
        res.status(500).json({message:err.message});
    }
}


export const getLikedProducts = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user || !user.location) {
      return res.status(400).json({ message: "User location not set" });
    }

    const nearestStore = await findNearestStore(
      user.location.lat,
      user.location.long
    );

    if (!nearestStore) {
      return res.status(404).json({ message: "No Store Found Nearby" });
    }

    const products = await Product.find({
      store_id: nearestStore._id,
    })
    .sort({likes: -1})
    .limit(5)
    .populate("images");

    res.status(200).json({
      store: nearestStore.storeName,
      totalProducts: products.length,
      products
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addLikedProducts = async(req,res) => {
    try {
      const userId = req.user.id;
      const {productId} = req.params;

      const user = await User.findById(userId);
      const product = await Product.findById(productId);
      if(!product) {
        return res.status(404).json({message:"Product Not Found"});
      }
      if(user.liked_products.includes(productId)) {
        return res.status(400).json({message:"Product Already Liked"});
      }
      user.liked_products.push(productId);
      await user.save();
      product.likes += 1;
      await product.save();
    }
    catch(err) {
        res.status(500).json({ message: err.message });
    }
}

