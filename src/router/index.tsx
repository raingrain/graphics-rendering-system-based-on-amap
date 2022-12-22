import {createBrowserRouter} from "react-router-dom";
import {MapPage} from "../pages/MapPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MapPage />
    }
]);