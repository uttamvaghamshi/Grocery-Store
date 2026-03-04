export const isRider = (req, res, next) => {
    if (req.user.role !== "rider") {
        return res.status(403).json({
            message: "Access Denied - Rider Only"
        });
    }

    next();
};

export default isRider;