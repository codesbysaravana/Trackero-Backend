import User from "../models/user.model.js";

//Getting all Users
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
}

//Getting user by Id without password
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if(!user) {
            const error = new Error("User not Found");
            error.statusCode = 404;
            throw error;
        }
        
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
}