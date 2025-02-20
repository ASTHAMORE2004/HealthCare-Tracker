import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./components/Home"; // Import Home Page
import Bmi from "./components/Bmi";
import Dietplans from "./components/Dietplans";
import Injury from "./components/Injury";
import Exercise from "./components/Exercise";
import Nutrition from "./components/Nutrition";

function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/home"} />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
        <Route path="/bmi" element={<Bmi/>} />
        <Route path="/diet" element={<Dietplans/>} />
        <Route path="/injury" element={<Injury/>} />
        <Route path="/exercise" element={<Exercise/>} />
        <Route path="/nutrition" element={<Nutrition/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
