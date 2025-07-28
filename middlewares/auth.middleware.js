//runs before getting records of user

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

//How this authorize middle ware works
// someone making a request get user details --> authorize middleware --> get user bearer token -->  verifies token checks with existing user ---> finally send if all equal and authorize

const authorize = async (req, res, next) => {
    try {
        let token;

        //getting the password token
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(' ')[1];
        }
        //if not return no
        if(!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if(!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;

        next(); //forward to the next part of the authorize
    } catch (error) {
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
}

export default authorize;