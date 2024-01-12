import * as React from 'react'
import * as ReactDOM from "react-dom/client";
import{
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

import './index.css';
import Log from "./views/Log";
import Home from "./views/Home";
import Profil from './views/Profil';

const router = createBrowserRouter([
    {
        path:'/',
        element: <Log/>
    },
    {
        path:'/home',
        element: <Home/>
    },
    {
        path:'/profil',
        element: <Profil/>
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

export default router;