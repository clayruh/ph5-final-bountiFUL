import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// COMPONENTS //
import App from "./components/App";
import UserPanel from "./components/User";
import Login from "./components/User/Login"
import Signup from "./components/User/Signup"
import MapBox from "./components/MapBox"
import AddPinForm from "./components/AddPinForm";

// LOADERS //
// import { getPins } from './loaders'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <UserPanel />,
            },
            {
                path: '/sign-in',
                element: <UserPanel />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: 'map',
                element: <MapBox />,
            },
            {
                path: 'add-a-pin',
                element: <AddPinForm />
            }
        ]
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render( <RouterProvider router={router}/> )