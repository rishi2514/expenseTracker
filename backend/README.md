# Backend

1. Create a database for the backend. You can use any database of your choice like MongoDB, MySQL, PostgreSQL, etc. For this project, we will be using MongoDB. Here is the refrence video if anything is unclear: [MongoDB Tutorial](https://www.youtube.com/watch?v=w4z8Py-UoNk)

2. Populate the `.env` file with required environment variables.

3. Install the required dependencies by running the following command in the terminal:

   ```bash
   npm i mongoose express dotenv
   ```

   - These are only the initial dependencies. You will need to install more dependencies as you progress through the project.

4. Connect to the database using the connection string provided in the `.env` file. You can use the `mongoose` library to connect to MongoDB.