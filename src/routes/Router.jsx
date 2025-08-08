import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import CarPage from "../pages/CarPage.jsx";
import LocalityPage from "../pages/LocalityPage.jsx";
import UserPage from "../pages/UserPage.jsx";
import PlacePage from "../pages/PlacePage.jsx";
import ParkingPage from "../pages/ParkingPage.jsx";
import Login from "../pages/Login.jsx";

const router = createBrowserRouter([
    {
        path: "/accueil",
        element: <Home />,
    },
    {
        path: "/*",
        element: <Login/>
    },
    {
        path:"/voiture",
        element: <CarPage/>
    },
    {
        path:"/localite",
        element:<LocalityPage/>
    },
    {
        path:"/utilisateur",
        element:<UserPage/>
    },
    {
        path:"/place",
        element:<PlacePage/>
    },
    {
        path:"/parking",
        element:<ParkingPage/>
    },
    {
        path:"/login",
        element:<Login/>
    }
    
]);

export default router;