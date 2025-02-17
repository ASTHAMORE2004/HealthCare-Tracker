import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"

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

      <div className="bg-black">
        <nav className="bg-[#000000] p-4 px-10 flex justify-between  items-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-violet-400 to-cyan-600 opacity-30 blur-3xl"></div>
          <img src={logo} className="w-24 md:w-36 lg:w-40 " />
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-full border-2 border-pink-500  hover:bg-red-600 hover:scale-110 duration-500 transition relative z-10"
          >
            Logout
          </button>
        </nav>




        <div >

          <p className="font-bold text-white lg:text-4xl text-center ">
            {username ? `Hello, ${username}!` : "Welcome!"}
          </p>
          <p className="font-extrabold text-white lg:text-7xl text-center" >Welcome to <span className="bg-gradient-to-r from-green-600 to-cyan-500 bg-clip-text text-transparent">FitVerse</span></p>
          <p className="font-seibold text-white lg:text-2xl pt-6 text-center">What are you up to today??</p>
        </div>

        <div className="flex items-center justify-center gap-16 pt-12">
          <div className="bg-[#fefae0] w-60 h-60 rounded-2xl flex justify-center items-center hover:scale-110 duration-700">
<p className="text-[#d4a373] font-extrabold text-2xl">Exercises </p>
          </div>

          <div className="bg-[#ffe5ec] w-60 h-60 rounded-2xl flex justify-center items-center hover:scale-110 duration-700">
<p className="text-[#fb6f92] font-extrabold text-2xl">Diet Plans</p>
          </div>

          <div className="bg-[#a3b18a] w-60 h-60 rounded-2xl flex justify-center items-center hover:scale-110 duration-700">
<p className="text-[#344e41] font-extrabold text-2xl">BMI Calculator</p>
          </div>
        </div>



        <div className="flex items-center justify-center gap-16 pt-12">
          <div className="bg-[#a8dadc] w-60 h-60 rounded-2xl flex justify-center items-center hover:scale-110 duration-700">
<p className="text-[#1d3557] font-extrabold text-2xl">AI Nutritionist </p>
          </div>

          <div className="bg-[#ccff33] w-60 h-60 rounded-2xl flex justify-center items-center hover:scale-110 duration-700">
<p className="text-[#008000] font-extrabold text-2xl">Injuries</p>
          </div>

          <div className="bg-[#ffea00] w-60 h-60 rounded-2xl flex justify-center items-center hover:scale-110 duration-700">
<p className="text-[#ff9500] font-extrabold text-2xl">Hehe</p>
          </div>
        </div>




<div className="bg-gradient-to-tr from-purple-500 to-cyan-500 opacity-40 w-80 h-80 absolute inset-0 blur-3xl rounded-full mt-[30%] ml-[40%]">
</div>





      </div>

    </>
  );
};

export default Home;
