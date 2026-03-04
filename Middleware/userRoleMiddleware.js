export const isUser = (req, res, next) => {
    if (req.user.role !== "user") {
        return res.status(403).json({
            message: "Access Denied - User Only"
        });
    }

    next();
};

export default isUser;