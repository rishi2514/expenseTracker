import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

// connectDB function with async await and try catch
const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`MongoDB connected DB host: ${connection.connection.port}`)
    } catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1)
    }
}

export default connectDB