import { useState } from "react";
import { assets } from "../assets/assets_frontend/assets";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);
  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to={"/"}>
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/doctors"}>
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/about"}>
          <li className="py-1">ABOUT US</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to={"/contact"}>
          <li className="py-1">CONTACT US</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 rounded-full"
              src={assets.profile_pic}
              alt=""
              srcSet=""
            />
            <img
              className="w-2.5"
              src={assets.dropdown_icon}
              alt=""
              srcset=""
            />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block ">
              <div className="min-w-56 whitespace-nowrap bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("my-profile")}
                  className="hover:text-black cursor-pointer"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("my-appointments")}
                  className="hover:text-black cursor-pointer"
                >
                  My Appointment
                </p>
                <p
                  onClick={() => setToken(false)}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create Account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />
        {/* --Mobile Menu */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out
  ${showMenu ? "bg-black/40 backdrop-blur-sm" : "pointer-events-none"}
`}
        >
          {/* Slide-in panel */}
          <div
            className={`absolute top-0 right-0 h-full w-1/2 max-w-xs bg-white shadow-lg transform transition-transform duration-300 ease-in-out
    ${showMenu ? "translate-x-0" : "translate-x-full"}
  `}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-6 border-b">
              <img className="w-28" src={assets.logo} alt="Logo" />
              <img
                className="w-6 cursor-pointer"
                onClick={() => setShowMenu(false)}
                src={assets.cross_icon}
                alt="Close"
              />
            </div>

            {/* Menu Links */}
            <ul className="flex flex-col items-start gap-3 mt-5 px-6 text-base font-medium">
              <NavLink onClick={() => setShowMenu(false)} to={"/"}>
                <p className="px-4 py-2 rounded hover:bg-gray-100 w-full">
                  Home
                </p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to={"/doctors"}>
                <p className="px-4 py-2 rounded hover:bg-gray-100 w-full">
                  ALL DOCTORS
                </p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to={"/about"}>
                <p className="px-4 py-2 rounded hover:bg-gray-100 w-full">
                  ABOUT US
                </p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to={"/contact"}>
                <p className="px-4 py-2 rounded hover:bg-gray-100 w-full">
                  CONTACT US
                </p>
              </NavLink>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
