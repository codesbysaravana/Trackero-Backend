import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";


//just gets all inputs and stores in mongoDB schema
export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id, //to know which user is creating a subscription
            //giving user a unique user id
        });

        await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
            retries: 0,
        })

        res.status(201).json({ success: true, data: subscription })

    } catch (error) {
        next(error)
    }
}

//to get all user subscription
export const getuserSubscriptions = async (req, res, next) => {
    try {
        //Check if the user is the same as the one in token //Using a unique user id
        if(req.user.id != req.params.id) {
            const error = new Error("You are Not the owner of this account");
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });
        
        res.status(200).json({ success: true, data: subscriptions });

    } catch (error) {
        next(error);
    }
}