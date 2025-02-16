import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <nav className="bg-blue-500 p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">My App</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-blue-200 shadow-lg rounded-lg h-44 w-52 flex items-center justify-center">
          <p className="text-lg font-semibold">
            {username ? `Welcome, ${username}!` : "Welcome!"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
