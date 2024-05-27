import React from "react";
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";

function Event() {
  const { eventID } = useParams();
  return (
    <>
      <NavBar />
      <div>
        Event {eventID},<br />
        Display all events detail and matchs<br/>
        Show add match button only to owner of the event 
      </div>
      <div className="mx-2">
        <button
          className="btn"
          onClick={() => document.getElementById("my_modal_4").showModal()}
        >
          + Add Match 
        </button>
        <dialog id="my_modal_4" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Hello!</h3>
            <div className="flex flex-col w-full lg:flex-row">
              <div className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center">
                take input class A
              </div>
              <div className="divider lg:divider-horizontal">VS</div>
              <div className="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center">
                take input class B
              </div>
            </div>
            <div className="my-2 flex flex-row justify-center">
              <form method="dialog">
                <button
                  className="btn"
                  onClick={() => {
                    console.log("add the match and close ");
                  }}
                >
                  Add Match
                </button>
              </form>
            </div>
          </div>
        </dialog>{" "}
      </div>
    </>
  );
}

export default Event;
