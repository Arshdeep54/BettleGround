import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useLocation, useParams } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

function EventPage() {
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

  async function createMatch() {
    if (typeof window.ethereum !== "undefined") {
        try {
            setMatchInput({
                ...matchInput,
                // Add necessary properties for match creation, e.g., uid, status, etc.
            });
            console.log(matchInput);

            // Request user to connect accounts (Metamask will prompt)
            await window.ethereum.request({ method: "eth_requestAccounts" });

            // Get the connected accounts
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts();

            // Create a contract instance
            const contract = new web3.eth.Contract(
                ABI.abi,
                import.meta.env.VITE_CONTRACT_ADDRESS
            );

            // Call the createMatch function in your smart contract
            const result = await contract.methods
                .createMatch(
                    // Pass necessary parameters for creating a match
                    matchInput.team1,
                    matchInput.team2,
                    matchInput.matchDate
                )
                .send({ from: accounts[0] });

            console.log(result);

            // Optionally, update UI or fetch matches again after creation
            // getMatches();
        } catch (error) {
            console.log(error);
            toast.error("Connect to Mainnet!", {
                theme: "dark",
            });
        }
    } else {
        toast.error("Install Metamask!", {
            theme: "dark",
        });
    }
}

  return (
    <>
      <NavBar />
      {/*  TODO
      <div>
        Event {eventID},<br />
        Display all events detail and matchs<br/>
        Show add match button only to owner of the event 
      </div> */}
      <section className="mx-12 my-5">
        <div className=" w-full bg-base-100 my-3">
          <div className="">
            <h2 className="card-title text-xl my-2">
              {state.name}
            </h2>
            <h2>
              <div className="badge badge-secondary badge-outline right-100 my-2">{state.status}</div>
              <div className="card-title text-xl my-2">Hosted By: {state.hostedBy}</div>
            </h2>
            <p className="text-s">{state.description}</p>
            <div className="card-actions justify-end my-4">
              <div className="badge badge-outline">{state.tags[0]}</div>
              <div className="badge badge-outline">{state.tags[1]}</div>
            </div>
          </div>
        </div>
        <div className="divider divider-accent"></div>
        <div>
          <div className="card-title text-xl my-5">Matches </div>
          <div className="mx-2">
  <button
    className="btn"
    onClick={() => {
      if (user) {
        createMatch();
        document.getElementById("createMatchModal").showModal();
      } else {
        document.getElementById("NotLoggedIn").showModal();
      }
    }}
  >
    + Add Match
  </button>
  <dialog id="createMatchModal" className="modal">
    <div className="modal-box w-11/12 max-w-5xl">
      <form method="dialog">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <h3 className="font-bold text-lg">Add New Match</h3>
      <div className="divider divider-accent"></div>
      <form>
        <div>
          <label className="text-xl">Team 1:</label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs my-3 mx-3"
            value={matchInput.team1}
            onChange={(e) =>
              setMatchInput({
                ...matchInput,
                team1: e.target.value,
              })
            }
            placeholder="Enter Team 1 name"
          ></input>
        </div>
        <div>
          <label className="text-xl">Team 2:</label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs my-3 mx-3"
            value={matchInput.team2}
            onChange={(e) =>
              setMatchInput({
                ...matchInput,
                team2: e.target.value,
              })
            }
            placeholder="Enter Team 2 name"
          ></input>
        </div>
        <div>
          <label className="text-xl">Match Date:</label>
          <input
            type="date"
            className="input outline-none focus:outline-none my-3 mx-3"
            value={matchInput.matchDate}
            onChange={(e) =>
              setMatchInput({
                ...matchInput,
                matchDate: e.target.value,
              })
            }
          ></input>
        </div>
      </form>

      <div className="modal-action">
        <form method="dialog">
          <button className="btn btn-primary" onClick={createMatch}>
            Create
          </button>
        </form>
      </div>
    </div>
  </dialog>
  <dialog id="NotLoggedIn" className="modal">
    <div className="modal-box w-11/12 max-w-5xl">
      <form method="dialog">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <h3 className="font-bold text-lg">Sorry ! </h3>
      <div className="hero">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold">
              You are not logged in!
            </h2>
            <p className="py-6">Start your betting journey</p>
            <form method="dialog">
              <NavLink to={"/auth/login"}>
                <button className="btn btn-primary">Login</button>
              </NavLink>
            </form>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</div>
          <ul>
            {state.matches.map((match, index) => {
              return (
                <>
                  <li key={index}>
                    <div className="flex justify-between">
                      <div className="badge badge-primary badge-outline py-2 ">{match.status}</div>
                      <span className="countdown font-mono text-2xl right">
                        <span style={{ "--value": 10 }}></span>:
                        <span style={{ "--value": 24 }}></span>:
                        <span style={{ "--value": 51 }}></span>
                      </span>
                    </div>
                    <div className="my-3 flex gap-2 flex-row align-center justify-center">
                      <div className="flex flex-col w-full lg:flex-row">
                        <div className="grid w-full h-32 card bg-base-300 rounded-box place-items-center card-title mx-12">
                          {match.outcomeA.text}
                        </div>
                        <div className="divider lg:divider-horizontal">VS</div>
                        <div className="grid w-full h-32 card bg-base-300 rounded-box place-items-center card-title mx-12">
                          {match.outcomeB.text}
                        </div>
                      </div>

                    </div>
                    <div className="w-full flex flex-col items-center">
                      <button
                        className="btn btn-wide btn-primary my-4 "
                        onClick={() =>
                          document.getElementById("my_modal_4").showModal()
                        }
                      >
                        Bet
                      </button>
                    </div>
                    <dialog id="my_modal_4" className="modal">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg my-2">Make bet </h3>
                        <div className="divider"></div>
                        {/* <div className="text my-2 flex flex-col items-center w-full">
                            {" "}
                            You are making the bet on {
                              match.outcomeA.text
                            } {" "} Vs {match.outcomeB.text}
                          </div> */}
                        <div className="text my-1 flex flex-col items-center w-full ">Choose one</div>
                        <div className="flex w-full flex-row gap-2 flex-1 justify-center my-4">
                          <div className="btn btn-outline btn-accent">{match.outcomeA.text}</div>
                          <div className="btn btn-outline btn-accent">{match.outcomeB.text}</div>
                        </div>
                        <div className="divider divider-neutral"></div>
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
                              className="btn mx-3 btn-primary"
                              onClick={() => makeBet(match)}
                            >
                              Confirm
                            </button>
                            <button className="btn mx-3 btn-ghost">Cancel</button>
                          </div>
                        </form>
                      </div>
                    </dialog>
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

export default EventPage;
