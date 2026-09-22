// There we also making the utility for same made below but with diffrent approach
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error))
    }
}

export default asyncHandler

 
// We make a generalised wrapper function so that we won't have to write async await everytime instead we use this utility.

/*
    const asyncHandler = () => {}
    const asyncHandler = (func) => {() => {}}
    const asyncHandler = (func) => async () => {}
*/

// We make a function and another async function inside it wrapped everything in async await and try catch. Defined error code and send message and called the sunction recieved in param. If confusion see above example.

/*
const asyncHandler = (func) => async (req, res, next) => {
    try {
        await func(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            sucess: false,
            message: error.message
        })
    }
}
*/