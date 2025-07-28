import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error("Please define the DB_URI environmental variable inside .env");
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`✅ Connected to MongoDB in ${NODE_ENV} mode`);
    } catch (error) {
        console.error("❌ Error connecting to database:", error);
        process.exit(1); //means failure
    }
};

export default connectToDatabase;
