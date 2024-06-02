import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { ethers } from "ethers";
import DefaultImage from "../assets/defaultprofile.png";
import { useWeb3 } from "../context/web3Contex";
import { Bounce, Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Web3 from "web3";
function NavBar() {
  const { user, logOut } = useUserAuth();
  const { provider } = useWeb3();
  const [connected, setConnected] = useState(false);
  const [currentAcc, setCurrentAcc] = useState(null);
  const [signer, setSigner] = useState(null);
  const [signerAddress, setSignerAddress] = useState(null);

  const [loading, setLoading] = useState(false);
  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        setConnected(true);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      toast.error("Please install Metamask wallet in this browser", {
        theme: "dark",
      });
    }
  }
  return (
    <>
      <div className="flex flex-col ">
        <div className="navbar bg-base-300 ">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <NavLink to={"/events"}>Events</NavLink>
                </li>
                {/* <li>
                  <NavLink to={"/about"}>About</NavLink>
                </li> */}
                <li>
                  <NavLink to={"/contact"}>Contact</NavLink>
                </li>
              </ul>
            </div>
            <NavLink className="btn btn-ghost text-xl" to={"/"}>
              <h1 className="text-3xl">
                <span className="text-secondary">Bet</span>
                <span >tleGround</span>
              </h1>
            </NavLink>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <NavLink to={"/events"}>Events</NavLink>
              </li>
              {/* <li>
                <NavLink to={"/about"}>About</NavLink>
              </li> */}
              <li>
                <NavLink to={"/contact"}>Contact</NavLink>
              </li>
            </ul>
          </div>
          <div className="flex-none navbar-end">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                {/* <NavLink to={"/notify"}>
                  <div className="indicator">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>

                    <span className="badge badge-sm indicator-item">1</span>
                  </div>
                </NavLink> */}
              </div>
            </div>
            {user ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src={user.photoURL ? user.photoURL : DefaultImage}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <p>
                      <NavLink to={"/profile"}>{user.displayName}</NavLink>
                    </p>
                  </li>
                  <li>
                    <a onClick={connectWallet}>
                      {connected ? "Connected" : "Connect Wallet"}
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() =>
                        document.getElementById("my_modal_2").showModal()
                      }
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            ) : (
              <NavLink to={"/auth/login"}>
                <button className="btn">Login</button>
              </NavLink>
            )}
          </div>
        </div>
        <div></div>
        <ToastContainer />
      </div>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">LogOut</h3>
          <p className="py-4">Are you sure you want to LogOut?</p>
          <form method="dialog">
            <div className="flex flex-row-reverse ">
              <button className="btn mx-3" onClick={logOut}>
                Confirm
              </button>
              <button className="btn mx-3">Cancel</button>
            </div>
          </form>
        </div>
      </dialog>
    </>
    // <>
    //   <div className="navbar bg-base-100">
    //     <div className="flex-1">
    //       <NavLink to={"/"}>
    //         <a className="btn btn-ghost text-xl">SatteBaazi</a>
    //       </NavLink>
    //     </div>
    //     <div className="flex-none">
    //       <div className="dropdown dropdown-end">
    //         <div
    //           tabIndex={0}
    //           role="button"
    //           className="btn btn-ghost btn-circle"
    //         >
    //           <NavLink to={"/notify"}>
    //             <div className="indicator">
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 className="h-5 w-5"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 stroke="currentColor"
    //               >
    //                 <path
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                   strokeWidth="2"
    //                   d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    //                 />
    //               </svg>

    //               <span className="badge badge-sm indicator-item">1</span>
    //             </div>
    //           </NavLink>
    //         </div>
    //       </div>
    //       {localStorage.getItem("access") ? (
    //         <div className="dropdown dropdown-end">
    //           <div
    //             tabIndex={0}
    //             role="button"
    //             className="btn btn-ghost btn-circle avatar"
    //           >
    //             <div className="w-10 rounded-full">
    //               <img
    //                 alt="Tailwind CSS Navbar component"
    //                 src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
    //               />
    //             </div>
    //           </div>
    //           <ul
    //             tabIndex={0}
    //             className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
    //           >
    //             <li>
    //               <a className="justify-between">
    //                 Profile
    //                 <span className="badge">New</span>
    //               </a>
    //             </li>
    //             <li>
    //               <a>Settings</a>
    //             </li>
    //             <li>
    //               <a>Logout</a>
    //             </li>
    //           </ul>
    //         </div>
    //       ) : (
    //         <NavLink to={'/auth/login'}>

    //             <button className="btn">Login</button>
    //         </NavLink>
    //       )}
    //     </div>
    //   </div>
    // </>
  );
}

export default NavBar;
