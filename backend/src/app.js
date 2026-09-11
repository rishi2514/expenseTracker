import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// app.use() is used for all the middlewares. Cors comes with some power as well which are described in object
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

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

export default app;
