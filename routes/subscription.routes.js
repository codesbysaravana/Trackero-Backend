import { Router } from "express";

import authorize from "../middlewares/auth.middleware.js"
import { createSubscription, getuserSubscriptions } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => res.send({ title: 'GET all subscriptions' }));

subscriptionRouter.get("/:id", (req, res) => res.send({ title: 'GET subscription details' }));

//middleware authorize cuz user needs to be before new sub
subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", (req, res) => res.send({ title: 'UPDATEl subscription' }));

subscriptionRouter.delete("/", (req, res) => res.send({ title: 'DELETE subscriptions' }));

subscriptionRouter.get("/user/:id", authorize, getuserSubscriptions);

subscriptionRouter.put("/:id/cancel", (req, res) => res.send({ title: 'CANCEL subscriptions' }));

subscriptionRouter.put("/upcoming-renewals", (req, res) => res.send({ title: 'GET UPCOMING renewals' }));

export default subscriptionRouter;