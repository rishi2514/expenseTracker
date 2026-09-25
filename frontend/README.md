# Frontend

1. We are using Vite React for the frontend. SO we start with installing necessary dependencies and basic configuration for the frontend.

```bash
    npm i -D prettier
    npm i tailwindcss @tailwindcss/vite
```

2. Configure the `prettier` settings and `prettierignore` file in the frontend directory as per preference.

3. Than we need to make some changes in the `vite.config.js` file. We need to import tailwindcss and add it to the plugins array. The final `vite.config.js` file will look like this:

```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite' 

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

4. Now just import the tailwind to the main css file. The final `index.css` file will look like this:

```css
@import "tailwindcss";
```

5. Install react-router-dom for routing in the frontend. For installing react-router-dom, we can use the following command:

```bash
npm i react-router-dom
```

6. The basics for using react-router-dom are as follows:
    - First we need to wrap our application with `BrowserRouter` component in the `main.jsx` file. The final `main.jsx` file will look like this:

```javascript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

7. Now we can use the `Routes` and `Route` components in our `App.jsx` file to define the routes for our application. The final `App.jsx` file will look like this:

```javascript
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"

function App() {

  return (
   <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
   </Routes>
  )
}

export default App
```

8. We're using `react-icons` for icons in the frontend. For installing react-icons, we can use the following command:

```bash
npm i react-icons
```

9. We're using `axios` for making API calls in the frontend. For installing axios, we can use the following command:

```bash
npm i axios
```