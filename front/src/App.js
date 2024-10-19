import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home";
import Register from "./pages/Register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import NotFound from "./pages/notFound";
import ProtectedRoutes from "./components/protectedRoutes";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Logout from "./pages/logout";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/profile/profile";
import CreateProfile from "./pages/profile/createProfile";
import UpdateProfile from "./pages/profile/updateProfile";
import GigList from "./pages/gigs/gigs";
import CreateGig from "./pages/gigs/createGig";
import UpdateGig from "./pages/gigs/updateGig";
import ApplyGig from "./pages/gigs/applyGig";
import Reviews from "./pages/reviews/reviews";
import AddReview from "./pages/reviews/addReview";
import Chats from "./components/chats/chats";
import UpdateReview from "./pages/reviews/updateReview";

export const UserContext = createContext(null);

axios.defaults.baseURL = "http://localhost:3001/gighub";
axios.defaults.withCredentials = true;
//https://gig-hub-liart.vercel.app/
//http://localhost:3001/
//
//"dev": "nodemon index.js"
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <Home />
      </ProtectedRoutes>
    ),
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoutes>
        <Dashboard />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoutes>
        <Profile />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/create-profile",
    element: (
      <ProtectedRoutes>
        <CreateProfile />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/update-profile/:id",
    element: (
      <ProtectedRoutes>
        <UpdateProfile />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/gigs",
    element: (
      <ProtectedRoutes>
        <GigList />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/create-gig",
    element: (
      <ProtectedRoutes>
        <CreateGig />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/update-gig/:id",
    element: (
      <ProtectedRoutes>
        <UpdateGig />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/apply-gig/:id",
    element: (
      <ProtectedRoutes>
        <ApplyGig />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/reviews",
    element: (
      <ProtectedRoutes>
        <Reviews />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/chats",
    element: (
      <ProtectedRoutes>
        <Chats />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/add-review/:id",
    element: (
      <ProtectedRoutes>
        <AddReview />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/update-review/:id",
    element: (
      <ProtectedRoutes>
        <UpdateReview />
      </ProtectedRoutes>
    ),
  },
  { path: "/logout", element: <Logout /> },
  { path: "*", element: <NotFound /> },
]);
function App() {
  const [user, setUser] = useState();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    axios
      .get("verify", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
          setIsOnline(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <ToastContainer />
      <UserContext.Provider value={{ user, setUser, setIsOnline, isOnline }}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </>
  );
}

export default App;
