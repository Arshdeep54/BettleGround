import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useLocation, useParams } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

function Event() {
  const { eventID } = useParams();
  const { state } = useLocation();
  const [isAllowed, setIsAllowed] = useState(false);
  const { user } = useUserAuth();
  const [betAmount, setBetAmount] = useState(0);
  useEffect(() => {
    if (user) {
      if (state.uid == user.uid) {
        setIsAllowed(true);
      }
    }
  }, []);
  const makeBet = (match) => {
    console.log("making bet on ", match);
  };
  return (
    <>
      <NavBar />
      {/*  TODO
      <div>
        Event {eventID},<br />
        Display all events detail and matchs<br/>
        Show add match button only to owner of the event 
      </div> */}
      <section className="mx-5 my-5">
        <div className=" w-full bg-base-100 my-3">
          <div className="">
            <h2 className="title">
              {state.name}
              <div className="badge badge-secondary">{state.status}</div>
              <div className="text">Hosted By: {state.hostedBy}</div>
            </h2>
            <p>{state.description}</p>
            <div className="card-actions justify-end">
              <div className="badge badge-outline">{state.tags[0]}</div>
              <div className="badge badge-outline">{state.tags[1]}</div>
            </div>
          </div>
        </div>
        <div>
          <div>Matches </div>
          <ul>
            {state.matches.map((match, index) => {
              return (
                <>
                  <li key={index}>
                    <div className="badge">{match.status}</div>
                    <div className="my-3 flex gap-2 flex-row align-center justify-center">
                      <div className="flex flex-col w-full lg:flex-row">
                        <div className="grid w-full h-32 card bg-base-300 rounded-box place-items-center">
                          {match.outcomeA.text}
                        </div>
                        <div className="divider lg:divider-horizontal">VS</div>
                        <div className="grid w-full h-32 card bg-base-300 rounded-box place-items-center">
                          {match.outcomeB.text}
                        </div>
                      </div>
                      <button
                        className="btn"
                        onClick={() =>
                          document.getElementById("my_modal_4").showModal()
                        }
                      >
                        Bet
                      </button>
                      <dialog id="my_modal_4" className="modal">
                        <div className="modal-box">
                          <h3 className="font-bold text-lg">Make bet </h3>
                          <div className="text">
                            {" "}
                            You are making the bet on {
                              match.outcomeA.text
                            } Vs {match.outcomeB.text}
                          </div>
                            <div className="text ">Choose one</div>
                          <div className="flex w-full flex-row gap-2">
                            <div className="btn">{match.outcomeA.text}</div>
                            <div className="btn">{match.outcomeB.text}</div>
                          </div>
                          <div className="my-3 flex flex-col gap-2">
                            <div className="mx-2" htmlFor="bet-amount">
                              Enter the bet amount
                            </div>
                            <div className="flex w-full flex-row gap-10">
                              <label className="input w-full input-bordered flex items-center gap-2">
                                <input
                                  type="text"
                                  className="w-full"
                                  value={betAmount}
                                  onChange={(e) => setBetAmount(e.target.value)}
                                />
                                <p>eth</p>
                              </label>

                              <label className="input w-full input-bordered flex items-center gap-2">
                                <input
                                  type="text"
                                  className="w-full"
                                  value={betAmount}
                                  onChange={(e) => setBetAmount(e.target.value)}
                                />
                                <select className="select select-sm w-full max-w-xs">
                                  <option disabled selected>
                                    USD
                                  </option>
                                  <option>INR</option>
                                  <option>Marge</option>
                                  <option>Bart</option>
                                  <option>Lisa</option>
                                  <option>Maggie</option>
                                </select>
                              </label>
                            </div>
                          </div>
                          <form method="dialog">
                            <div className="flex flex-row-reverse ">
                              <button
                                className="btn mx-3"
                                onClick={() => makeBet(match)}
                              >
                                Confirm
                              </button>
                              <button className="btn mx-3">Cancel</button>
                            </div>
                          </form>
                        </div>
                      </dialog>
                    </div>
                    <div className="divider" />
                  </li>
                </>
              );
            })}
          </ul>
        </div>
        {isAllowed && (
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
            </dialog>
          </div>
        )}
      </section>
    </>
  );
}

export default Event;
