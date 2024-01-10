import * as React from 'react'
import * as ReactDOM from "react-dom/client";
import{
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

import './index.css';
import Log from "./views/Log";
import Home from "./views/Home";

const router = createBrowserRouter([
    {
        path:'/',
        element: <Log/>
    },
    {
        path:'/home',
        element: <Home/>
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);