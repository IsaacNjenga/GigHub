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
import UserProfile from "./components/userProfile";
import Reports from "./pages/reports/reports";
import UpdateReport from "./pages/reports/updateReport";
import CreateReport from "./pages/reports/createReport";

export const UserContext = createContext(null);

axios.defaults.baseURL = "https://gig-hub-liart.vercel.app/gighub"; // deployed version
//axios.defaults.baseURL = "http://localhost:3001/gighub"; // local version
axios.defaults.withCredentials = true;

//"dev": "nodemon index.js"

const router = createBrowserRouter([
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/", element: <Home /> },
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
  {
    path: "/reports",
    element: (
      <ProtectedRoutes>
        <Reports />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/update-report/:id",
    element: (
      <ProtectedRoutes>
        <UpdateReport />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/create-report",
    element: (
      <ProtectedRoutes>
        <CreateReport />
      </ProtectedRoutes>
    ),
  },
  { path: "/user/:id", element: <UserProfile /> },
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
        console.error("Error during verification:", err);
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
