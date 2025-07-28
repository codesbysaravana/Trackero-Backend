import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

import User from "../models/user.model.js";
import { JWT_SECRET } from "../config/env.js";
import { JWT_EXPIRES_IN } from "../config/env.js";

//ACID property!

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession(); //start the database transaction...Not the user 
    session.startTransaction();

    try {
        //Logic to create a new User //getting specs from user
        const { name, email, password } = req.body;
        
        //If User already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        //Hash the password for new user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });
        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }); //jwt accpets a new user in object

        await session.commitTransaction(); //complete and save in database;
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUsers[0]
            }
        })
    } catch (error) {
        await session.abortTransaction(); //if goes wrong end immediatly
        session.endSession();
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        //check if user doesnt exist
        if(!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        //check if password is wrong
        const isPasswordValid = await bcrypt.compare(password, user.password); //check new pass with old user pass

        if(!isPasswordValid) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: "User signed In successfully",
            data: {
                token,
                user
            }
        });        
    } catch(error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {}




//Perfect all for signing in ...but to actually show users ---> userController.js