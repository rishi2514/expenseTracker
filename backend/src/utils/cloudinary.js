import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

// cloudinary configration found on clodinary website
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY
})

// reusable upload function which takes local path and upload to cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("File is uploaded on cloudinary", response);

        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // Remove the locally saved temp file as the upload operation got failed
        return null
    }
}

export default uploadOnCloudinary