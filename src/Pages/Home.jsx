import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import { useUserAuth } from "../context/UserAuthContext";
import { NavLink } from "react-router-dom";
import star from "../assets/Star.svg"; 
import shield from "../assets/Shield.svg";

function Home() {
  const { user } = useUserAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!user); // Update isLoggedIn state based on user login status
  }, [user]);

  const features = [
    {
      id: "feature-1",
      icon: star,
      title: "Rewards",
      content:
        "You can win big rewards!",
    },
    {
      id: "feature-2",
      icon: shield,
      title: "100% Secured!",
      content:
        "The system is decentralized so your bets are safe and so are your rewards.",
    },
  ]
  const FeatureCard = ({ icon, title, content, index }) => (
    <div className={`mt-5 flex flex-row p-6 rounded-[20px]  feature-card`}>
      <div className={`w-[64px] h-[64px] rounded-full bg-dimBlue`}>
        <img src={icon} alt="star" className="w-[50%] h-[50%] object-contain" />
      </div>
      <div className="flex-1 flex flex-col ml-3">
        <h4 className=" font-semibold text-white text-[18px] leading-[23.4px] mb-1">
          {title}
        </h4>
        <p className="font-normal text-dimWhite text-[16px] leading-[24px]">
          {content}
        </p>
      </div>
    </div>
  );
  return (
    <>
      <NavBar />
      {isLoggedIn ? <>
  <div className="hero min-h-screen bg-base-200 relative">
    <div className="hero-content text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold">Welcome {user.displayName}</h1>
        <p className="py-6">Lets head over to win something!</p>
        <button className="btn btn-primary">
          <NavLink to={"/events"}>Make your bets!</NavLink>
        </button>
      </div>
    </div>
  </div>
  <div className="absolute z-10 bottom-0  left-0 right-0  flex justify-center">
    
    <div className="flex flex-col">
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} {...feature} index={index} />
      ))}
    </div>
  </div>
</>
       
      :  
      <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome user!</h1>
            <p className="py-6">Start your betting journey</p>
            <button className="btn btn-primary" ><NavLink to={"/auth/login"}>Login</NavLink></button>
          </div>
        </div>
        <div className="flex-col bg-base-200">
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} {...feature} index={index} />
      ))}
    </div>
      </div>
      }
      
    </>
  );
}

export default Home;
