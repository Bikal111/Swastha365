import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-[#189d01] rounded-lg px-6 md:px-10 lg:px-20">
      
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className="text-3xl md:text-4xl lg:text-white font-semibold leading-tight md:leading-tight lg:leading-tight"> 
          Find Your Doctor. <br /> Fix Your Day. <br /> Health is just a Click Away!
        </p>

      
        <div className="flex items-center gap-3 text-white text-sm font-light">
          <img className="w-28" src={assets.group_profiles} alt="" />
          <p>
            Easily browse top-rated doctors and book your appointment—fast, <br className="hidden sm:block" />
            simple, and stress-free.
          </p>
        </div>

        <div className="mt-4">
          <a
            href="#speciality"
            className="flex items-center gap-2 bg-white px-4 py-3 rounded-full text-gray-600 text-sm hover:scale-105 transition-all duration-300"
          >
            Book Appointment 
            <img className="w-3" src={assets.arrow_icon} alt="arrow" />
          </a>
        </div>
      </div>

    
      <div className="md:w-1/2 relative">
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-lg"
          src={assets.header_img}
          alt="Doctors"
        />
      </div>
    </div>
  );
};

export default Header;