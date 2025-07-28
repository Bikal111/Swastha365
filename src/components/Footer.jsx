import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

const Footer = () => {
  return (
    <div className='mb:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
           
            <div>
                <img className='mb-5 w-40'  src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>At Swastha365, your health never waits. We bring you expert care, fast bookings, and wellness support all year round. It's like having a hospital in your pocket—smart, simple, and always there when you need it.`</p>
            </div>
            
            <div>
                <p className='text-xl font-medium mb-5 '>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            
            <div>
                <p className='text-xl font-medium mb-5' >GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+977-01-5560590</li>
                    <li>swastha365.contactus@gmail.com</li>
                </ul>
            </div>
        </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center '>Copyright 2025@ Swastha365 - All Right Reserverd</p>
        </div>
    </div>
  )
}

export default Footer