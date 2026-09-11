import "dotenv/config"
import connectDB from "./db/index.js";

connectDB() //using .then and .catch to work after the promise
    .then(() => {
        // catching error 
        app.on("error", (error) => {
            console.log("Error running server: ", error)
        })

        // listening in server
        app.listen(process.env.PORT || 5000), () => {
            console.log(`Server is running at: ${process.env.PORT}`)
        }
    })
    .catch((error) => {
        console.log("MONGO DB CONNECTION FAILED: ", error)
    })


/*
// This is a approach to make the connection with DB with the help of IFFE but we are doing a better and professional approach
import mongoose from "mongoose";
import { DB_NAME } from "./constants";
import express from 'express'

// initialize the express
const app = express()

// IFFE with try catch and async await to connect to DB as it can be be a failure and take some time
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        // Logging any app error
        app.on("error", (error) => {
            console.log("ERROR: ", error)
        })    

        // Listening for successfull app running
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("ERROR : ", error)
        throw error
    }
})()
*/