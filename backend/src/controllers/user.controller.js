import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

// A helper function to generate access and refresh token so that won't need to write it again and again
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens.");
  }
};

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
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  /* Steps for logic building */
  // get user details from frontend
  // check for validation empty fields or invalid mail format
  // find the user in DB
  // check for the password matches
  // provide access and refresh token
  // send tokens in cookies

  // taking data from the api request
  const { userName, email, password } = req.body;

  // validating for username or email
  if (!(userName || email)) {
    throw new ApiError(400, "Username or email is required.");
  }

  // finding user by username or email
  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User doesn't exist.");
  }

  // using the password checker to check for passwrod is correct or not the isPasswordCorrect method is written in userSchema and available through user
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials.");
  }

  // generating and destructuring access and refresh token by helper function
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // options for cookies for making them secure
  const options = {
    httpOnly: true,
    secure: true,
  };

  // removing the password and refreshToken from fetched user. Not making another db call
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // setting cookies directly and sending data
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully."
      )
    );
});

// added auth middleware which has the access of user and passed it in req so using that user._id to find the user and clear cookies and set refreshToken to undefined
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: null },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return (
    res
      .status(200)
      // .clearCookie(accessToken, options)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully."))
  );
});

const refreshToken = asyncHandler(async (req, res) => {
  // get the refresh token either from cookie or payload
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request.");
  }

  // decode the refreh token to get the user id
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // find the user in DB
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token.");
    }

    // compare the refresh token from user and db
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used.");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    // generate new tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    // save and return the new tokens
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully."
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid token");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  // get name and useName from the request
  const { name, userName } = req.body;

  if (!(name || email)) {
    throw new ApiError(401, "Atleast one field is required.");
  }

  // if both fields are present then update both fields in DB
  if (name && userName) {
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { name, userName },
      },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "User updated successfully."));
  }

  // if only name is present then update only name in DB
  if (name) {
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { name },
      },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "User updated successfully."));
  }

  // if only userName is present then update only userName in DB
  if (userName) {
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { userName },
      },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "User updated successfully."));
  }
});

const updateUserProfilePicture = asyncHandler(async (req, res) => {
  // get the local path of the uploaded file from multer middleware
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Profile picture is missing.");
  }

  // upload the file to cloudinary using the utility we created
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(500, "Error while uploading profile picture.");
  }

  // update the user in DB with the new avatar url and return the updated user without password
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  // if the user already has an avatar then delete the old avatar from cloudinary using the utility we created passing the publicId by splitting the url and getting the last part of it which is the publicId
  if (req.user?.avatar) {
    const publicId = req.user.avatar.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile picture uploaded successfully."));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // taking user id from the auth middleware as it's protected route
  const user = await User.findById(req.user?._id);

  // check if teh existing password in db and password from dtaa same using helper isPasswordCorrect function written while making user schema
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  // set user password to newPassword and update in Db
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully."));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(404, "No user found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully."));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  updatePassword,
  getCurrentUser,
  updateUser,
  updateUserProfilePicture,
};
