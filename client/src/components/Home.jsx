import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Home = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <div className="bg-black min-h-screen pb-10">
        <nav className="bg-[#000000] p-4 px-10 flex justify-between items-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-violet-400 to-cyan-600 opacity-30 blur-3xl"></div>
          <img src={logo} className="w-24 md:w-36 lg:w-40 relative z-10" alt="Logo" />
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-full border-2 border-pink-500 hover:bg-red-600 hover:scale-110 duration-500 transition relative z-10"
          >
            Logout
          </button>
        </nav>

        <div className="px-4 mt-8 text-center">
          <p className="font-bold text-white text-2xl lg:text-4xl">
            {username ? `Hello, ${username}!` : "Welcome!"}
          </p>
          <p className="font-extrabold text-white text-4xl lg:text-7xl mt-4">
            Welcome to <span className="bg-gradient-to-r from-green-600 to-cyan-500 bg-clip-text text-transparent">FitVerse</span>
          </p>
          <p className="font-semibold text-white text-lg lg:text-2xl pt-6">
            What are you up to today??
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-8 pt-12 px-4 z-20">
          
          <Link to="/exercise" className="bg-[#fefae0] w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 rounded-2xl flex justify-center items-center hover:scale-110 duration-700">
            <p className="text-[#d4a373] font-extrabold text-lg sm:text-xl lg:text-2xl">Exercises</p>
          </Link >

          <Link to="/diet" className="bg-[#ffe5ec] w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 rounded-2xl flex justify-center items-center hover:scale-110 duration-700">
            <p className="text-[#fb6f92] font-extrabold text-lg sm:text-xl lg:text-2xl">Diet Plans</p>
          </Link>

          <Link to="/bmi" className="bg-[#a3b18a] w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 rounded-2xl flex justify-center items-center hover:scale-110 duration-700">
            <p className="text-[#344e41] font-extrabold text-lg sm:text-xl lg:text-2xl">BMI Calculator</p>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-8 pt-12 px-4 z-20">
          <Link to="/nutrition" className="bg-[#a8dadc] w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 rounded-2xl flex justify-center items-center hover:scale-110 duration-700">
            <p className="text-[#1d3557] font-extrabold text-lg sm:text-xl lg:text-2xl">AI Nutritionist</p>
          </Link>

          <Link to="/injury" className="bg-[#ccff33] w-40 h-40 sm:w-48 sm:h-48 lg:w-60 lg:h-60 rounded-2xl flex justify-center items-center hover:scale-110 duration-700">
            <p className="text-[#008000] font-extrabold text-lg sm:text-xl lg:text-2xl">Injuries</p>
          </Link>

          
        </div>

        <div className="bg-gradient-to-tr z-0 hidden md:block lg:block from-purple-500 to-cyan-500 opacity-40 w-60 h-60 lg:w-80 lg:h-80 absolute inset-0 blur-3xl rounded-full mt-[80%] md:mt-[50%] md:ml-[32%] lg:mt-[30%] ml-[10%] lg:ml-[40%]">
        </div>
      </div>
    </>
  );
};

export default Home;