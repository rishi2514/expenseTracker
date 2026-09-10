# Fullstack Application Approach 
## Setup Backend

1. Initialize a new Node.js project:
   ```bash
   mkdir backend
   cd backend
   npm init -y
   ```

- While making the backend, if we are uploading images, videos or any files than we hold it temporarily in the backend and then upload it to cloud storage like AWS S3, Google Cloud Storage, or any other cloud storage service. This is done to ensure that the files are stored securely and can be accessed easily. 

- Now either we can create a src directory and put all the backend code in it or we can keep the backend code in the root directory.

2. Install nodemon as dev dependency:
   ```bash
   npm install -D nodemon
   ```

- Nodemon is a utility that will monitor for any changes in your source and automatically restart your server. Perfect for development.

3. Update the `package.json` file to include a start script for nodemon and set the type to module for import statements:
   ```json
   "type": "module",
   "scripts": {
     "dev": "nodemon index.js"
   }
   ```

4. (Optional for better development) Install Prettier for code formatting so that the code is consistent and easy to read:
   ```bash
   npm i -D prettier
   ```

- Create a `.prettierrc` file in the backend directory to configure Prettier settings as per preference:
   ```json
   {
     "singleQuote": false,
     "bracketSpacing": true,
     "tabWidth": 2,
     "semi": true,
     "trailingComma": "es5"
   }
   ```