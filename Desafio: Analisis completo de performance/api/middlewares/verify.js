export const isAdmin = (req, res, next) => {
    if (req.body.user?.isAdmin) {
        next();
    } else {
        res.status(403)
            .json({
                error: "You don't have permission to complete this action",
            })
            .send();
    }
};
