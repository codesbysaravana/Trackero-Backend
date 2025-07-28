import express from "express";
import { PORT } from "./config/env.js";

//routes imports
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

//middlewares use built-in
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(arcjetMiddleware);

//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

//for custom error hanndling
app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send("Welcome to the Subscription Tracker API!");
});

app.listen(PORT, async () => {
    console.log(`Subscription Tracker API running on Port: ${PORT}`);
    
    await connectToDatabase();
})