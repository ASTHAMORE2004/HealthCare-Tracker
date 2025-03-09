import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Bmi from "./components/Bmi";
import Dietplans from "./components/Dietplans";
import Injury from "./components/Injury";
import Exercise from "./components/Exercise";
import Nutrition from "./components/Nutrition";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />  {/* Added default route */}
        <Route path="/home" element={<Home />} />
        <Route path="/bmi" element={<Bmi />} />
        <Route path="/diet" element={<Dietplans />} />
        <Route path="/injury" element={<Injury />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/nutrition" element={<Nutrition />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
