import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "";
const allowedOrigins = corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    // Allow non-browser tools (Postman, curl) that may not send Origin.
    if (!origin) {
      return callback(null, true);
    }

    // For credentialed requests, never send literal '*'. Reflect request origin instead.
    if (allowedOrigins.includes("*")) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
};

// app.use() is used for all the middlewares. Cors comes with some power as well which are described in object
app.use(cors(corsOptions));

// this is a example of handling data means we can accept 16kb data in form of json
app.use(
  express.json({
    limit: "16kb",
  })
);

// urlencoded used for getting data as query param and static is used for managing the static data sucha s files
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))

// cookieParser in used to store cookie in user's brower securly and perform CRUD on cookies
app.use(cookieParser())


// We generally do config and imports of required packages at op then import our routes to use them
// Routes import
import userRouter from "./routes/user.routes.js"
import categoryRouter from "./routes/category.routes.js"
import transactionRouter from "./routes/transaction.routes.js"

// We make the routes as middleware which first accept the route name which acts as prefix and then indicate the route file we want to go to. It works like http://localhost:3000/api/v1/user/further_route_name
// Routes 
app.use("/api/v1/user", userRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/transaction", transactionRouter)

export default app;
