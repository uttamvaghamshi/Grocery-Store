export const isStore = (req, res, next) => {
    if (req.user.role !== "store_admin") {
        return res.status(403).json({
            message: "Access Denied - Store Admin Only"
        });
    }

    next();
};

export default isStore;