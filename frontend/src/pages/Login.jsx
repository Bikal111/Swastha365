import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from 'axios'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const  {backendUrl,token,setToken} = useContext(AppContext)
  const navigate = useNavigate()

  const [state, setState] = useState("Sign Up");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Sign Up') {
        const {data} = await axios.post(backendUrl +'/api/user/register',{name,password,email})
        if (data.success) {
          localStorage.setItem('token',data.token)
          setToken(data.token)
        }else{
          toast.error(data.message)
        }
      }else{
        const {data} = await axios.post(backendUrl +'/api/user/login',{password,email})
          if (data.success) {
            localStorage.setItem('token',data.token)
            setToken(data.token)
          }else{
            toast.error(data.message)
          }
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  useEffect (()=>{
    if (token) {
      navigate('/')
    }
  })

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "Sign Up" : "Login"} For Booking
          Appointments Smoothly
        </p>

        {/* Full Name field (only for Sign Up) */}
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              placeholder="Please Enter Your Full Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        {/* Email field */}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            placeholder="Please Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        {/* Password field with toggle */}
        <div className="w-full">
          <p>Password</p>
          <div className="relative">
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1 pr-16"
              type={showPassword ? "text" : "password"}
              placeholder="Please Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#189d01] font-medium"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Submit button */}
        <button type="submit" className="bg-[#189d01] text-white w-full py-2 rounded-md text-base">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {/* Toggle between Sign Up & Login */}
        {state === "Sign Up" ? (
          <p>
            Already have an Account?{" "}
            <span
              onClick={() => setState("Login")}
              className="text-[#189d01] underline cursor-pointer"
            >
              Login Here
            </span>
          </p>
        ) : (
          <p>
            Create a New Account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="text-[#189d01] underline cursor-pointer"
            >
              Click Here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};
