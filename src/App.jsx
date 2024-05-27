import {
  BrowserRouter,
  Link,
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import ProtectedRoute from "./Pages/ProtectedRoutes";
import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./Pages/Home";
import UserProfile from "./Pages/UserProfile";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import Notify from "./Pages/Notify";
import Event from "./Pages/Event";

function App() {
  return (
    <>
      <UserAuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/notify" element={<Notify />} />
            <Route path="/events/:eventID" element={<Event />} />
            <Route path="/auth/profile" element={<UserProfile />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </BrowserRouter>{" "}
      </UserAuthContextProvider>
     
    </>
  );
}

export default App;
