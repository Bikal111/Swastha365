import React from 'react'
import { assets } from '../assets/assets_frontend/assets'

export const About = () => {
  return (
    <div>
        <div className='text-center text-2xl pt-10 text-gray-500'>
          <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
        </div>

        <div className='my-10 flex flex-col md:flex-row gap-10 px-6 md:px-16'>
          <img className='w-full md:max-w-[350px] h-60' src={assets.about_image} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
            <b className='text-gray-800 text-base'>Welcome to Swastha365 — Your Everyday Health Companion!</b>
            <p>At Swastha365, we’re on a mission to make healthcare smarter, faster, and friendlier. We get it — booking appointments, managing health records, and finding the right doctor can feel overwhelming. That’s where we come in!</p>
            <p>Whether you're juggling a busy schedule or just want healthcare at your fingertips, Swastha365 makes it all simple and stress-free. We’re your go-to platform for a healthier, happier you — 365 days a year.</p>
            <b className='text-gray-800 text-base'>What Makes Us Different?</b>
            <p>We’re not just a health tech company — we’re a wellness movement. Swastha365 blends the latest technology with a human touch, giving you top-tier service that feels personal. From your first check-up to regular follow-ups, we’re right by your side with smart tools, friendly support, and a whole lot of care.</p>
            <b className='text-gray-800 text-base'>Our Vision</b>
            <p>At Swastha365, we dream of a world where accessing healthcare is as easy as ordering a coffee. Our goal? To build a seamless bridge between you and your healthcare providers, so you always get the right care — anytime, anywhere. No hassle. No wait. Just health made easy.</p>
          </div>
        </div>
        <div className='text-xl my-4'>
          <p>WHY TO <span className='text-gray-700 font-semibold'>CHOOSE US</span> </p>
        </div>

        <div className='flex flex-col md:flex-row mb-20 '>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#189d01] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>Efficiency:</b>
            <p>Easy Appointment Scheduling That Matches Your Busy Lifestyle</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#189d01] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>Convenience:</b>
            <p>Access To All Kind Of Health Care Professionals</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-[#189d01] hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>Personalization:</b>
            <p>Tailored Recommendations And Reminders To Help You Stay On Top Of Your Health</p>
          </div>
        </div>
    </div>
  )
}