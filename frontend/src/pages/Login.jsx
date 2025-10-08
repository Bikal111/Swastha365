import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let response;

      if (state === "Sign Up") {
        response = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
      } else {
        response = await axios.post(`${backendUrl}/api/user/login`, { email, password });
      }

      const data = response.data;

      if (data.success && data.token) {
        // Save token in context and localStorage
        setToken(data.token);
        localStorage.setItem("token", data.token);

        toast.success(`${state} successful`);
        navigate("/"); // redirect to home
      } else {
        // Clear old token if present
        setToken(null);
        localStorage.removeItem("token");
        toast.error(data.message || "Login/Sign Up failed");
      }
    } catch (error) {
      console.error("Login error:", error.response || error);
      toast.error(error.response?.data?.message || error.message || "Login failed");
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  // Redirect if token already exists
  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">{state === "Sign Up" ? "Create Account" : "Login"}</p>
        <p>Please {state === "Sign Up" ? "Sign Up" : "Login"} for booking appointments smoothly</p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              type="text"
              placeholder="Please Enter Your Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            placeholder="Please Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            autoComplete="username"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Please Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-zinc-300 rounded w-full p-2 mt-1 pr-16"
              autoComplete="current-password"
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

        <button type="submit" className="bg-[#189d01] text-white w-full py-2 rounded-md text-base">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <p>
          {state === "Sign Up" ? "Already have an Account?" : "Create a New Account?"}{" "}
          <span
            onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
            className="text-[#189d01] underline cursor-pointer"
          >
            {state === "Sign Up" ? "Login Here" : "Click Here"}
          </span>
        </p>
      </div>
    </form>
  );
};
