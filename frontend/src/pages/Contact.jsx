import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

export const Contact = () => {

  return (
    <div>
        <div className='text-center text-2xl pt-10 text-gray-500'>
          <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
        </div>
        <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
          <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
          <div className='flex flex-col justify-center items-start gap-6'>
            <p className='font-semibold text-lg text-gray-600'>Our Office</p>
            <p className='text-gray-500'>Badegaun-14 <br /> Godavari Municipality, Lalitpur, Nepal </p>
            <p className='text-gray-500'>Tel: +977-01-5560590 <br />Swastha365.ContactUs@gmail.com</p>
            <p className='font-semibold text-lg text-gray-600'>Carreers At Swastha365</p>
            <p className='text-gray-500' >Learn More About Our Teams And Job Oppennings And Stay Connected</p>
            <button className='border border-[#189d01] px-8 py-4 text-sm hover:bg-[#189d01] hover:text-white transition-all duration-500'>Job Oppennings</button>
          </div>
        </div>
    </div>
  )
}