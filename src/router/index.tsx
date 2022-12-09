import {createBrowserRouter} from "react-router-dom";
import {Map} from "../pages/Map";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Map />
    }
    // {
    //     path: '/map',
    //     element: <Map/>
    // }
]);