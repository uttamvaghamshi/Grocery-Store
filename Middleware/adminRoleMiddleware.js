export const isSuper = (req, res, next) => {
    if (req.user.role !== "super_admin") {
        return res.status(403).json({
            message: "Access Denied - Admin Only"
        });
    }
    next();
};

export default isSuper;