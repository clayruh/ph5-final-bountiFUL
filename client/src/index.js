import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// COMPONENTS //
import App from "./components/App";
import UserPanel from "./components/User";

// LOADERS //
// import { getPlants } from './loaders'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <UserPanel />,
            },
            // {
            //     path: 'map',
            //     element: <GoogleMaps />,
            //     loader: getPlants
            // }
        ]
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render( <RouterProvider router={router}/> )