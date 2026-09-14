# Backend

1. Create a database for the backend. You can use any database of your choice like MongoDB, MySQL, PostgreSQL, etc. For this project, we will be using MongoDB. Here is the refrence video if anything is unclear: [MongoDB Tutorial](https://www.youtube.com/watch?v=w4z8Py-UoNk)

2. Populate the `.env` file with required environment variables.

3. Install the required dependencies by running the following command in the terminal:

   ```bash
   npm i mongoose express dotenv
   ```

   - These are only the initial dependencies. You will need to install more dependencies as you progress through the project.

4. Connect to the database using the connection string provided in the `.env` file. You can use the `mongoose` library to connect to MongoDB.

5. Cors and cookie-parser are also required for the backend as cors handle cross-origin resource sharing and cookie-parser handles cookies. Install them using the following command:

   ```bash
   npm i cors cookie-parser
   ```

6. Middleware is checking the request and response objects before they reach the route handler.

7. We have installed bcrypt and jsonwebtoken for converting passwords to hashes and generating JSON Web Tokens. They both are used for authentication purposes and mostly prsent in each application where authentication is required. Alternate pf bcrypt is to use bcryptjs. Install them using the following command:

   ```bash
   npm i bcrypt jsonwebtoken
   ```

8. We get some hooks and methods from mongoose to perform some operations on the database. We will be using them in our project. Basic example in `user.model.js` file for hasing the password and comparing it with the user input as well as generating access and refresh tokens.

9. We will use multer and cloudinary for uploading images to the cloud. Install them using the following command:

   ```bash
   npm i multer cloudinary
   ```
   - First we take the image from the user using multer and hold them in our server. Then we upload it to cloudinary so if any issue occurs, we can retry the image upload from our server. We will be using cloudinary for storing images in the cloud. 

10. After setting up all the above mentioned dependencies and configurations, we can start building the backend of our application. The setting up to the external services are very important as they will be used in the backend for various functionalities so make sure to set them up correctly at first with the proper configuration so that we won't have to do that when we start implementing the features.

11. Now we can start implementing the features of our application. We are taking first step as writting controllers for our application. Controllers are the main part of the backend as they handle the requests and responses. We are using the asyncHandler we created as utils to handle the async await and try catch for error handling.

12. After writing the controllers, we will write the routes for our application. Routes are the endpoints of our application which will be used by the frontend to communicate with the backend. We will be using express router to create the routes.\

13. After writing routes we will test them using postman. Postman is a tool which is used to test the APIs. We will be using postman desktop application as they support localhost testing.