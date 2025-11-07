import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { AdminContext } from '../context/AdminContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 Eye icons
import { DoctorContext } from '../context/DoctorContext.jsx';

const Login = () => {
  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 Toggle state

  const { setAToken, backendUrl } = useContext(AdminContext);
  const {setDToken} = useContext(DoctorContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });
        if (data.success) {
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const {data} = await axios.post(backendUrl+'/api/doctor/login',{email,password})
        if (data.success) {
          localStorage.setItem('dToken', data.token);
          setDToken(data.token);
          console.log(data.token);
          
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center justify-center">
      <div className="flex flex-col gap-4 p-10 min-w-[400px] sm:min-w-[450px] border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-3xl font-semibold m-auto">
          <span className="text-[#189d01]">{state}</span> Login
        </p>

        {/* Email */}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-3 mt-1"
            type="email"
            required
            placeholder="Enter Your Email"
          />
        </div>

        {/* Password with toggle */}
        <div className="w-full relative">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-3 mt-1 pr-10"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Enter Your Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[46px] text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Login Button */}
        <button className="bg-[#189d01] text-white w-full py-2 rounded-md text-base">Login</button>

        {/* Switch Login Type */}
        {state === 'Admin' ? (
          <p>
            Login as Doctor?{' '}
            <span className="text-[#189d01] underline cursor-pointer" onClick={() => setState('Doctor')}>
              Click here
            </span>
          </p>
        ) : (
          <p>
            Login as Admin?{' '}
            <span className="text-[#189d01] underline cursor-pointer" onClick={() => setState('Admin')}>
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
