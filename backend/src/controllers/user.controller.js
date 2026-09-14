import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// Using our asycHandler utility which automatically wrap function in async await and try catch block for better performance and error catching.
const registerUser = asyncHandler(async (req, res) => {
  /* steps for logic building */
  // get user details from frontend
  // validations - must not empty and others
  // if already existing
  // check for image - avatar - it's not required here but for practice
  // upload to cloudinary, check if it's successfully uploaded
  // create user object - create mongo entry
  // remove password and refresh token field from response
  // check for user creation
  // return response

  // req.body captures the data from the request
  const { name, userName, email, password, avatar } = req.body;

  // either we can check like this one by one but we can add check in more advance way as well ------------------
  // if (name === "") throw new ApiError(400, "Name is required")
  if ([userName, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "PLease fill the required fields.");
  }

  // email check if it contains @
  if (!email.includes("@"))
    throw new ApiError(400, "Please enter a valid email.");

  // Using User model to check if any user already holds the userName or email. We are using the or operator for checking both we can go with single search as well without even writing the or operator
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "Username or Email already exist.");
  }

  // Getting the local path of file uploaded from multer
  const avatarLocalPath = req.file?.path;

  // upload the file to cloudinary using the utility we created
  const avatarPath = await uploadOnCloudinary(avatarLocalPath);

  // create user in DB by create method and passing it the required data
  const user = await User.create({
    name: name || "",
    userName: userName.toLowerCase(),
    email,
    password,
    avatar: avatarPath?.url || "",
  });

  // checking the user is created successfully or not by finding by it's _id and if successfully created then using .select method to remove password and refresh token form it
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user.");
  }

  // sending response as pre defined structure via the ApiResponse utility
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully."));
});

export { registerUser };
