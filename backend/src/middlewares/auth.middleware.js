import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // getting accessToken from cookie or header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      throw new ApiError(401, "Unauthorized request.");
    }
  
    // decode accessToken using JWT
    const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    // find user by the decoded id
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    
    if (!user) {
      throw new ApiError(401, "Invalid access token.");
    }
  
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token.")
  }
});
