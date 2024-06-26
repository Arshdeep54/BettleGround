import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import Web3 from "web3";
import bettingContract from "../../blockchain/Betting";
import { getETHPrice } from "../../blockchain/priceFeedChainlink";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

function EventPage() {
  const { state } = useLocation();
  const [isAllowed, setIsAllowed] = useState(false);
  const { user } = useUserAuth();
  const [betAmount, setBetAmount] = useState(0);
  const [oneEthToUSD, setOneEthToUsd] = useState(null);
  const [winner, setWinner] = useState(null);
  const [addMatchError, setAddMatchError] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingBet, setLoadingBet] = useState({
    loading: false,
    loadingID: null,
  });
  const [loadingDeclare, setLoadingDeclare] = useState({
    loading: false,
    loadingID: null,
  });
  const [modalMatch, setModalMatch] = useState(null);
  const [bet, setBet] = useState({
    chosenID: 0,
    team: "",
    eventID: null,
    matchID: null,
    betAmount: null,
    betAmountInUSD: null,
  });
  const [web3, setWeb3] = useState(null);
  const [matchesArray, setMatchesArray] = useState([]);
  const [betContract, setBetContract] = useState(null);
  const [matchInput, setMatchInput] = useState({
    team1: "",
    team2: "",
    matchDate: new Date().toISOString().slice(0, 10),
  });
  const [bettors, setBettors] = useState([]);

  const getMatches = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const web3 = new Web3(window.ethereum);
      const matchesFromContract = await bettingContract(web3)
        .methods.getMatches(state.id)
        .call();
      console.log(matchesFromContract);
      const uniqueMatchIDs = new Set();
      const uniqueMatches = [];

      matchesFromContract.forEach((matchFromContract) => {
        const matchID = matchFromContract["matchID"];

        // Check if match ID is unique before adding
        if (!uniqueMatchIDs.has(matchID)) {
          uniqueMatchIDs.add(matchID); // Add to Set if unique
          const newMatch = {
            matchID,
            team1: matchFromContract["side1"],
            team2: matchFromContract["side2"],
            status: matchFromContract["resultAnnounced"] ? "ended" : "onGoing",
            resultAnnounced: matchFromContract["resultAnnounced"],
            winnerID: matchFromContract["winnerID"],
            duration: matchFromContract["duration"],
          };
          uniqueMatches.push(newMatch);
        }
      });

      setMatchesArray(uniqueMatches);
      console.log(matchesArray);
      console.log(bettingContract(web3));
    } catch (error) {
      toast.error(error.message, {
        theme: "dark",
      });
    }
  };

  async function createMatch() {
    const match = {
      eventID: state.id,
      matchID: matchesArray.length + 1,
      sideA: matchInput.team1,
      sideB: matchInput.team2,
      ID1: 1,
      ID2: 2,
      duration: matchInput.matchDate.toString(),
    };
    console.log(match);
    if (typeof window.ethereum !== "undefined") {
      try {
        console.log(user);
        if (user) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3 = new Web3(window.ethereum);
          setWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          console.log(accounts);
          setLoading(true);
          const events = await betContract.methods
            .createMatch(
              match.eventID,
              match.matchID,
              match.sideA,
              match.sideB,
              match.ID1,
              match.ID2,
              match.duration
            )
            .send({ from: accounts[0] });

          console.log(events);
          await getMatches();

          setLoading(false);
        } else {
          console.log("not lggowbev ");
          throw Error("You are not logged in");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message, {
          theme: "dark",
        });
        setLoading(false);
      }
    } else {
      toast.error("Install Metamask!", {
        theme: "dark",
      });
    }
  }
  const connectWallet = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        console.log(accounts);

        setAddress(accounts[0]);
        const betCon = bettingContract(web3);
        setBetContract(betCon);

        const contractBalance = await web3.eth.getBalance(
          "0xE719712E97d3130F6441D6Be950A2a440D2CCf87"
        );
        // const bettors = await betCon.methods.getBettors(state.id, 1).call();
        // setBettors(bettors);
        // console.log(bettors);

        console.log(web3.utils.fromWei(contractBalance, "ether"));
        const oneEthToUSD = await getETHPrice();
        setOneEthToUsd(oneEthToUSD);
        const usdValue = Number(354 * oneEthToUSD).toFixed(2);
        console.log(usdValue);
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  useEffect(() => {
    if (betContract) {
      getMatches();
      console.log(address);
    }
  }, [betContract]);
  useEffect(() => {
    console.log(import.meta.env.VITE_OWNER_ADDRESS);
    if (user) {
      if (state.uid == user.uid) {
        setIsAllowed(true);
      }
    }
  }, []);
  useEffect(() => {
    console.log(bet);
  }, [bet]);

  const makeBet = async (match) => {
    console.log("making bet on ", match);
    try {
      if (match.matchID) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setLoadingBet({ loading: true, loadingID: match.matchID });
        await bettingContract(web3)
          .methods.createBet(state.id, match.matchID, bet.chosenID)
          .send({
            from: accounts[0],
            value: web3.utils.toWei(bet.betAmount.toString(), "ether"),
          })
          .on("confirmation", (confirmationNumber, receipt) => {
            console.log("Confirmation:", confirmationNumber);
            setLoadingBet({ loading: false, loadingID: null });
          });
        setBet({
          chosenID: 0,
          team: "",
          eventID: null,
          matchID: null,
          betAmount: null,
          betAmountInUSD: null,
        });
        setLoadingBet({ loading: false, loadingID: null });
      } else {
        console.log("match id is null ");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        theme: "dark",
      });
      setLoadingBet(false);
    }
  };
  const declareWinner = async (match) => {
    console.log("declaring  winner for", match);
    try {
      if (match.matchID && (winner == 1 || winner == 2)) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setLoadingDeclare({ loading: true, loadingID: match.matchID });
        const declare = await bettingContract(web3)
          .methods.declareWinnerAndDistribute(state.id, match.matchID, winner)
          .send({
            from: accounts[0],
          })
          .once("confirmation", (confirmationNumber, receipt) => {
            console.log("Confirmation:", confirmationNumber);
            setLoadingDeclare({ loading: false, loadingID: null });
            setWinner(null);
          });
        console.log(declare);
        setLoadingDeclare({ loading: false, loadingID: null });
      } else {
        console.log("match id is null ");
      }
    } catch (error) {
      toast.error(error.message, {
        theme: "dark",
      });
      setLoadingDeclare(false);
    }
  };

  return (
    <>
      <NavBar />
      <section className="mx-12 my-5">
        <div className=" w-full bg-base-100 my-3">
          <div className="">
            <h2 className="card-title text-xl my-2">{state.name}</h2>
            <h2>
              <div className="badge badge-secondary badge-outline right-100 my-2">
                {state.status}
              </div>
              <div className="card-title text-xl my-2">
                Hosted By: {state.hostedBy}
              </div>
            </h2>
            <p className="text-s break-all">{state.description}</p>
            <div className="card-actions justify-end my-4">
              <div className="badge badge-outline">{state.tags[0]}</div>
              <div className="badge badge-outline">{state.tags[1]}</div>
            </div>
          </div>
        </div>
        <div className="divider divider-accent"></div>
        <div className="flex gap-5">
          <button
            className="btn btn-primary"
            onClick={() => {
              connectWallet();
            }}
          >
            Show All Matches
          </button>
          {address == import.meta.env.VITE_OWNER_ADDRESS && (
            <button
              className="btn"
              onClick={() => {
                if (user) {
                  document.getElementById("createMatchModal").showModal();
                } else {
                  document.getElementById("NotLoggedIn").showModal();
                }
              }}
            >
              {loading ? <LoadingSpinner /> : "+ Add Match"}
            </button>
          )}
        </div>
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
                <button
                  className="btn btn-primary"
                  disabled={
                    matchInput.team1.length == 0 ||
                    matchInput.team2.length == 0 ||
                    matchInput.matchDate == null
                  }
                  onClick={() => {
                    createMatch();
                  }}
                >
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
                  <h2 className="text-4xl font-bold">You are not logged in!</h2>
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
        <div>
          {matchesArray.length > 0 && (
            <div className="card-title text-3xl my-5">Matches </div>
          )}
          <div className="mx-2">
            <ul>
              {matchesArray.map((match, index) => {
                {
                  console.log(matchesArray);
                }
                return (
                  <>
                    <li key={index}>
                      <div className="flex justify-between">
                        <div className="badge badge-primary badge-outline py-2 mx-12 ">
                          {match.status}
                        </div>
                        <div className="font-mono text-2xl right mx-12">
                          <div>{match.duration}</div>
                        </div>
                      </div>
                      <div className="my-3 flex gap-2 flex-row align-center justify-center">
                        <div className="flex flex-col w-full lg:flex-row">
                          <div
                            className={`grid w-full h-32 card text-3xl rounded-box place-items-center card-title mx-12 ${
                              match.resultAnnounced &&
                              Number(match.winnerID) == 1
                                ? "bg-accent"
                                : " bg-base-300  "
                            }`}
                          >
                            {match.team1}
                          </div>
                          <div className="divider lg:divider-horizontal">
                            VS
                          </div>
                          <div
                            className={`grid w-full h-32 card text-3xl rounded-box place-items-center card-title mx-12 ${
                              match.resultAnnounced &&
                              Number(match.winnerID) == 2
                                ? "bg-accent"
                                : " bg-base-300  "
                            }`}
                          >
                            {match.team2}
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex justify-center items-center align-center gap-2">
                        {address == import.meta.env.VITE_OWNER_ADDRESS ? (
                          <button
                            className="btn btn-wide btn-primary my-4 "
                            onClick={() => {
                              if (user) {
                                document
                                  .getElementById(
                                    `declareResultModal${match.matchID}`
                                  )
                                  .showModal();
                              } else {
                                document
                                  .getElementById("NotLoggedIn")
                                  .showModal();
                              }
                            }}
                            disabled={match.resultAnnounced}
                          >
                            {loadingDeclare.loading &&
                            loadingDeclare.loadingID == match.matchID ? (
                              <LoadingSpinner />
                            ) : match.resultAnnounced ? (
                              "Declared"
                            ) : (
                              "Declare Result"
                            )}
                          </button>
                        ) : (
                          <button
                            className="btn btn-wide btn-primary my-4 "
                            onClick={() => {
                              if (user) {
                                document
                                  .getElementById(
                                    `makeBetModal${match.matchID}`
                                  )
                                  .showModal();
                              } else {
                                document
                                  .getElementById("NotLoggedIn")
                                  .showModal();
                              }
                            }}
                            disabled={match.resultAnnounced}
                          >
                            {loadingBet.loading &&
                            loadingBet.loadingID == match.matchID ? (
                              <LoadingSpinner />
                            ) : (
                              "Bet"
                            )}
                          </button>
                        )}
                      </div>
                      <dialog
                        id={`makeBetModal${match.matchID}`}
                        className="modal"
                      >
                        <div className="modal-box">
                          <h3 className="font-bold text-lg my-2">Make bet </h3>
                          <div className="divider"></div>

                          <div className="text my-1 flex flex-col items-center w-full ">
                            Choose one
                          </div>
                          <div className="flex w-full flex-row gap-2 flex-1 justify-center my-4">
                            <div
                              className={` btn btn-outline ${
                                bet.team === match.team1
                                  ? "bg-accent text-black"
                                  : "btn-accent"
                              }`}
                              onClick={() =>
                                setBet({
                                  ...bet,
                                  chosenID: 1,
                                  team: match.team1,
                                })
                              }
                            >
                              {console.log(match)}
                              {match.team1}
                            </div>
                            <div
                              className={` btn btn-outline ${
                                bet.team === match.team2
                                  ? "bg-accent text-black"
                                  : "btn-accent "
                              }`}
                              onClick={() =>
                                setBet({
                                  ...bet,
                                  chosenID: 2,
                                  team: match.team2,
                                })
                              }
                            >
                              {match.team2}
                            </div>
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
                                  value={bet.betAmount}
                                  onChange={(e) =>
                                    setBet({
                                      ...bet,
                                      betAmount: e.target.value,
                                      betAmountInUSD:
                                        Number(e.target.value) * oneEthToUSD,
                                    })
                                  }
                                />
                                <p>eth</p>
                              </label>

                              <label className="input w-full input-bordered flex items-center gap-2">
                                <input
                                  type="text"
                                  className="w-full"
                                  value={bet.betAmountInUSD}
                                  onChange={(e) =>
                                    setBet({
                                      ...bet,
                                      betAmount:
                                        Number(e.target.value) / oneEthToUSD,
                                      betAmountInUSD: e.target.value,
                                    })
                                  }
                                />
                                USD
                              </label>
                            </div>
                          </div>
                          {(bet.betAmount < 0.01 || isNaN(bet.betAmount)) && (
                            <div className="text text-red-300">
                              Minimum bet Amount is 0.01
                            </div>
                          )}
                          <form method="dialog">
                            <div className="flex flex-row-reverse ">
                              <button
                                className="btn mx-3 btn-primary"
                                onClick={() => makeBet(match)}
                                disabled={
                                  bet.chosenID == 0 ||
                                  bet.betAmount < 0.01 ||
                                  isNaN(bet.betAmount)
                                }
                              >
                                Confirm
                              </button>
                              <button className="btn mx-3 btn-ghost">
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </dialog>
                      <dialog
                        id={`declareResultModal${match.matchID}`}
                        className="modal"
                      >
                        <div className="modal-box">
                          <h3 className="font-bold text-lg my-2">Make bet </h3>
                          <div className="divider"></div>
                          <div className="text my-1 flex flex-col items-center w-full ">
                            Choose one
                          </div>
                          <div className="flex w-full flex-row gap-2 flex-1 justify-center my-4">
                            <div
                              className={` btn btn-outline ${
                                winner == 1
                                  ? "bg-accent text-black"
                                  : "btn-accent"
                              }`}
                              onClick={() => setWinner(1)}
                            >
                              {match.team1}
                            </div>
                            <div
                              className={` btn btn-outline ${
                                winner == 2
                                  ? "bg-accent text-black"
                                  : "btn-accent "
                              }`}
                              onClick={() => setWinner(2)}
                            >
                              {match.team2}
                            </div>
                          </div>
                          <div className="divider divider-neutral"></div>
                          <p>
                            You chose{" "}
                            <span className="font-extrabold underline text-xl">
                              {winner == 1
                                ? match.team1
                                : winner == 2
                                ? match.team2
                                : "   "}
                            </span>
                          </p>
                          <form method="dialog">
                            <div className="flex flex-row-reverse ">
                              <button
                                className="btn mx-3 btn-primary"
                                onClick={() => declareWinner(match)}
                              >
                                Confirm
                              </button>
                              <button className="btn mx-3 btn-ghost">
                                Cancel
                              </button>
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
        </div>
      </section>
    </>
  );
}

export default EventPage;
