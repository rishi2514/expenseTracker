import asyncHandler from "../utils/asyncHandler.js"

// Using our asycHandler utility which automatically wrap function in async await and try catch block for better performance and error catching.
const registerUser = asyncHandler( async (req, res) => {
    res.status(200).json({
        message : "everything working"
    })
} )

export {registerUser}