import React, {useState} from 'react'
import {assets} from '../assets/assets.js'

const Login = () => {

  const [state,setState] = useState('Admin')

  return (
    
    <form className='min-h-[80vh] flex items-center justify-center'>
      <div className='flex flex-col gap-4 p-10 min-w-[400px] sm:min-w-[450px] border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-3xl font-semibold m-auto '><span className='text-[#189d01]'>{state}</span> Login</p>
        <div className='w-full'>
          <p >Email</p>
          <input className='border border-[#DADADA] rounded w-full p-3 mt-1' type="email" required placeholder='Enter Your Email' />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-[#DADADA] rounded w-full p-3 mt-1' type="password" required placeholder='Enter Your Password' />
        </div>
        <button className='bg-[#189d01] text-white w-full py-2 rounded-md text-base'>Login</button>
          {
            state === 'Admin'
            ? <p>Login as Doctor ? <span className='text-[#189d01] underline cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span></p>
            : <p>Login as Admin ? <span className='text-[#189d01] underline cursor-pointer' onClick={()=>setState('Admin')}>Click here</span></p>
          }
      </div>
    </form>
  )
}

export default Login