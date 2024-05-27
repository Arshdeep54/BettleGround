import React from "react";
import { useNavigate } from "react-router-dom";

function Card({name,description,status,tags}) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="card w-full bg-base-100 shadow-xl cursor-pointer"
        onClick={() => navigate("/events/234")}
      >
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
            alt="Shoes"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {name}
            <div className="badge badge-secondary">{status}</div>
          </h2>
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
