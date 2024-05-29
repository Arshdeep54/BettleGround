import React from "react";
import { useNavigate } from "react-router-dom";

function Card({id,name,uid,hostedBy,description,status,tags,matches}) {
  
  const navigate = useNavigate();
  return (
    <>
      <div
        className="card w-full bg-neutral text-neutral-content shadow-xl cursor-pointer"
        onClick={() => navigate(`/event/${btoa(id)}`,{state:{id,name,uid,hostedBy,description,status,tags,matches}})}
      >
        {/* <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
        </figure> */}
        <div className="card-body class">
          <div className="card-title">
            <h1 className="flex-auto w-75">{name}</h1>
            <div className="badge badge-secondary "><h1>{status}</h1></div>
            <div className="text-xs"><h1>Hosted By: {hostedBy}</h1></div>
          </div>
          <div className="divider"></div>
          <p>
            {description}
          </p>
          <div className="card-actions justify-end">
            <div className="badge badge-outline">{tags[0]}</div>
            <div className="badge badge-outline">{tags[1]}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Card;
