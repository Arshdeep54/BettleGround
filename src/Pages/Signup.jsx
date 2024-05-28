import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import { useUserAuth } from '../context/UserAuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { user, signUp } = useUserAuth()
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    console.log("logging in ....");
    e.preventDefault();
    setError("");
    try {
      await signUp(email, password, displayName);
      navigate("/auth/login");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <>
      <NavBar />
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center self-center z-10">
          <div className="p-12 bg-white mx-auto rounded-2xl w-100">
            <div className="mb-4">
              <h3 className="font-semibold text-2xl text-gray-800">Sign Up </h3>
              <p className="text-gray-500">Create your account.</p>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 tracking-wide">
                  Username
                </label>
                <input
                  id="username"
                  type="name"
                  className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                  placeholder="Username"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 tracking-wide">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                  placeholder="mail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full content-center text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center bg-green-400 hover:bg-green-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                >
                  Sign up
                </button>
              </div>
              <p className="mt-2 text-xs text-center text-gray-700 mb-2">
                Already have an account?{" "}
                <span className=" text-blue-600 hover:underline">
                  <Link to="/auth/login">Login</Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Signup;