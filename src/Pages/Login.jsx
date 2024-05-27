import React from 'react'
import NavBar from '../components/NavBar'
import {useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert} from "react-bootstrap";
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await logIn(email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e: any) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate('/home');
    } catch (err) {
      console.log((err as Error).message);
    }
  };
  return (
  <>
  <NavBar/>
  <form onSubmit={handleSubmit}></form>
  <div class="flex justify-center self-center  z-10">
        <div class="p-12 bg-white mx-auto rounded-2xl w-100 ">
            <div class="mb-4">
              <h3 class="font-semibold text-2xl text-gray-800">Sign In </h3>
              <p class="text-gray-500">Please sign in to your account.</p>
            </div>
            <div class="space-y-5">
                        <div class="space-y-2">
                              <label class="text-sm font-medium text-gray-700 tracking-wide">Email</label>
              <input class=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400" type="" placeholder="mail@gmail.com"onChange={(e) => setEmail(e.target.value)}/>
              </div>
                          <div class="space-y-2">
              <label class="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                Password
              </label>
              <input class="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400" type="" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)}/>
            </div>
              <div class="flex items-center justify-between">
             
            </div>
            <div>
              <button type="submit" class="w-full flex justify-center bg-green-400  hover:bg-green-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500">
                Sign in
              </button>
              </form>
              <p class="text-gray-500 flex justify-center py-2">OR</p>
              <button type="submit" class="w-full flex justify-center bg-green-400  hover:bg-green-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500" onClick={handleGoogleSignIn}>
                Sign Up with Google
              </button>
            </div>
            </div>
            
            
        </div>
      </div>
  </>  )
}

export default Login