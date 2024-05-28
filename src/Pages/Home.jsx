import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import { useUserAuth } from "../context/UserAuthContext";
import { NavLink } from "react-router-dom";

function Home() {
  const { user } = useUserAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user); // Update isLoggedIn state based on user login status
  }, [user]);

  return (
    <>
      <NavBar />
      {isLoggedIn ? <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome {user.displayName}</h1>
            <p className="py-6">Lets head over to win something!</p>
            <button className="btn btn-primary" ><NavLink to={"/events"}>Make your bets!</NavLink></button>
          </div>
        </div>
      </div>
      :  
      <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome user!</h1>
            <p className="py-6">Start your betting journey</p>
            <button className="btn btn-primary" ><NavLink to={"/auth/login"}>Login</NavLink></button>
          </div>
        </div>
      </div>
      }
      
    </>
  );
}

export default Home;
