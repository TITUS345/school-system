import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    const mongoURI = process.env.MONGO_URL;

    if (!mongoURI) {
        console.error("Missing MONGO_URL in environment variables.");
        throw new Error("MONGO_URL is not defined!");
    }

    if (mongoose.connection.readyState >= 1) {
        console.log("Database already connected");
        return;
    }

    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error("Database Connection Error:", error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;