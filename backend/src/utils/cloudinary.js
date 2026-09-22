import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// cloudinary configration found on clodinary website
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// reusable upload function which takes local path and upload to cloudinary
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Remove the locally saved temp file as the upload operation got failed
    return null;
  }
};

// reusable delete function which takes publicId and delete from cloudinary
const deleteFromCloudinary = async (publicId) => {
  // publicId is the unique identifier for the image in cloudinary. It is obtained from the image url.
  try {
    if (!publicId) return null;
    // cloudinary.uploader.destroy is a method provided by cloudinary to delete an image
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
