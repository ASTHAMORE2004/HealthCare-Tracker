import React, { useState, useEffect, useCallback } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

const Bmi = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState("");
  const [idealWeight, setIdealWeight] = useState("");
  const [tip, setTip] = useState("");
  const [calorieNeeds, setCalorieNeeds] = useState(null);
  const [waterIntake, setWaterIntake] = useState(null);
  const [goalWeight, setGoalWeight] = useState("");
  const [timeToGoal, setTimeToGoal] = useState(null);
  const [activeTab, setActiveTab] = useState("calculator");
  const [bodyComposition, setBodyComposition] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: localStorage.getItem("userName") || "",
    goal: localStorage.getItem("userGoal") || "maintain"
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [animation, setAnimation] = useState(false);

  const tips = {
    nutrition: [
      "Drink at least 8 glasses of water daily for optimal hydration.",
      "Eat protein with every meal to help maintain muscle mass.",
      "Include colorful vegetables in your meals for essential nutrients.",
      "Consider intermittent fasting after consulting a healthcare provider."
    ],
    exercise: [
      "Incorporate both cardio and strength training for balanced fitness.",
      "Try HIIT workouts for efficient calorie burning in less time.",
      "Take at least 8,000 steps daily for cardiovascular health.",
      "Schedule rest days to allow your muscles to recover properly."
    ],
    lifestyle: [
      "Get 7-9 hours of quality sleep to support metabolism.",
      "Practice stress management techniques like meditation.",
      "Stand up and move for at least 5 minutes every hour.",
      "Track your food intake for a week to identify eating patterns."
    ]
  };

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };

  const bmiCategories = [
    { name: "Underweight", range: "< 18.5", color: "#64B5F6" },
    { name: "Normal", range: "18.5-24.9", color: "#66BB6A" },
    { name: "Overweight", range: "25-29.9", color: "#FFA726" },
    { name: "Obese", range: "≥ 30", color: "#EF5350" }
  ];

  useEffect(() => {
    const categories = Object.keys(tips);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomTip = tips[randomCategory][Math.floor(Math.random() * tips[randomCategory].length)];
    setTip(`${randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1)}: ${randomTip}`);
    document.body.className = theme;
  }, []);

  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => setAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animation]);

  const calculateBMI = useCallback(() => {
    if (weight > 0 && height > 0) {
      setAnimation(true);
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);
      generateMessage(bmiValue);
      calculateIdealWeight(height, gender);
      calculateCalories();
      calculateWaterIntake();
      estimateBodyComposition();
      if (goalWeight) {
        calculateTimeToGoal(bmiValue);
      }
    } else {
      setMessage("Please enter valid height and weight.");
    }
  }, [weight, height, age, gender, activityLevel, goalWeight, userProfile.voiceFeedback]);

  const calculateIdealWeight = (height, gender) => {
    let minWeight, maxWeight;
    if (gender === "male") {
      minWeight = (18.5 * ((height / 100) ** 2)).toFixed(1);
      maxWeight = (24.9 * ((height / 100) ** 2)).toFixed(1);
    } else {
      minWeight = (18.5 * ((height / 100) ** 2) * 0.95).toFixed(1);
      maxWeight = (24.9 * ((height / 100) ** 2) * 0.95).toFixed(1);
    }
    setIdealWeight(`${minWeight} kg - ${maxWeight} kg`);
    return { min: minWeight, max: maxWeight };
  };

  const generateMessage = (bmi) => {
    if (bmi < 18.5) {
      setMessage("Underweight - Consider a balanced diet to gain healthy weight.");
    } else if (bmi >= 18.5 && bmi < 24.9) {
      setMessage("Normal weight - Maintain your healthy lifestyle!");
    } else if (bmi >= 25 && bmi < 29.9) {
      setMessage("Overweight - Focus on balanced nutrition and regular exercise.");
    } else {
      setMessage("Obese - Consider consulting a healthcare provider for personalized advice.");
    }
  };

  const calculateCalories = () => {
    if (age > 0 && weight > 0 && height > 0) {
      let bmr;
      if (gender === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }
      const dailyCalories = Math.round(bmr * activityMultipliers[activityLevel]);
      let adjustedCalories = dailyCalories;
      if (userProfile.goal === "lose") {
        adjustedCalories = Math.round(dailyCalories * 0.8);
      } else if (userProfile.goal === "gain") {
        adjustedCalories = Math.round(dailyCalories * 1.15);
      }
      setCalorieNeeds({
        maintenance: dailyCalories,
        adjusted: adjustedCalories,
        goal: userProfile.goal
      });
    }
  };

  const calculateWaterIntake = () => {
    const baseIntake = weight * 30;
    let activityAdjustment = 0;
    if (activityLevel === "active" || activityLevel === "veryActive") {
      activityAdjustment = 500;
    } else if (activityLevel === "moderate") {
      activityAdjustment = 250;
    }
    const totalIntake = baseIntake + activityAdjustment;
    setWaterIntake({
      ml: totalIntake,
      liters: (totalIntake / 1000).toFixed(1),
      glasses: Math.round(totalIntake / 250)
    });
  };

  const estimateBodyComposition = () => {
    if (weight && height && age && gender) {
      let fatPercentage;
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      if (gender === "male") {
        fatPercentage = (1.2 * bmiValue) + (0.23 * age) - 16.2;
      } else {
        fatPercentage = (1.2 * bmiValue) + (0.23 * age) - 5.4;
      }
      fatPercentage = Math.max(5, Math.min(50, fatPercentage));
      const fatMass = (weight * (fatPercentage / 100)).toFixed(1);
      const leanMass = (weight - fatMass).toFixed(1);
      setBodyComposition({
        fatPercentage: fatPercentage.toFixed(1),
        fatMass,
        leanMass
      });
    }
  };

  const calculateTimeToGoal = (currentBmi) => {
    if (goalWeight && weight) {
      const weightDiff = Math.abs(weight - goalWeight);
      const weeksToGoal = (weightDiff / 0.75).toFixed(1);
      const monthsToGoal = (weeksToGoal / 4.33).toFixed(1);
      setTimeToGoal({
        weeks: weeksToGoal,
        months: monthsToGoal
      });
    }
  };

  const speakResult = (bmi) => {
    if (window.speechSynthesis) {
      const speech = new SpeechSynthesisUtterance(
        `Your BMI is ${bmi}, which is classified as ${bmi < 18.5 ? 'underweight' : 
          bmi < 25 ? 'normal weight' : 
          bmi < 30 ? 'overweight' : 'obese'}. 
          ${message}`
      );
      window.speechSynthesis.speak(speech);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  const saveUserProfile = () => {
    localStorage.setItem("userName", userProfile.name);
    localStorage.setItem("userGoal", userProfile.goal);
    setShowProfileModal(false);
    if (weight && height) {
      calculateCalories();
    }
  };

  const getNewTip = () => {
    const categories = Object.keys(tips);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomTip = tips[randomCategory][Math.floor(Math.random() * tips[randomCategory].length)];
    setTip(`${randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1)}: ${randomTip}`);
  };

  const resetForm = () => {
    setWeight("");
    setHeight("");
    setAge("");
    setGender("male");
    setActivityLevel("moderate");
    setGoalWeight("");
    setBmi(null);
    setMessage("");
    setIdealWeight("");
    setCalorieNeeds(null);
    setWaterIntake(null);
    setTimeToGoal(null);
    setBodyComposition(null);
    getNewTip();
    setAnimation(true);
  };

  const getBmiColor = (bmiValue) => {
    if (bmiValue < 18.5) return "#64B5F6";
    if (bmiValue < 25) return "#66BB6A";
    if (bmiValue < 30) return "#FFA726";
    return "#EF5350";
  };

  const formatChartDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getMonth()+1}/${date.getDate()}`;
  };

  const backgroundGradient = theme === "dark" 
    ? "bg-gradient-to-br from-gray-900 to-gray-800"
    : "bg-gradient-to-br from-blue-50 to-indigo-100";

  const textColor = theme === "dark" ? "text-white" : "text-gray-800";
  const mutedTextColor = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`min-h-screen ${backgroundGradient} p-4 md:p-6 transition-all duration-300`}>
      <div className={`max-w-4xl mx-auto ${textColor}`}>
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Health Compass
            </h1>
            {userProfile.name && (
              <p className={mutedTextColor}>Welcome, {userProfile.name}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowProfileModal(true)}
              className="p-2 rounded-full hover:bg-opacity-25 hover:bg-gray-500 transition-all"
              aria-label="Profile settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-opacity-25 hover:bg-gray-500 transition-all"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </header>
        <div className="flex justify-center mb-6">
          <div className={`inline-flex rounded-lg p-1 ${theme === "dark" ? "bg-gray-800" : "bg-white shadow-md"}`}>
            <button
              onClick={() => setActiveTab("calculator")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "calculator" 
                  ? theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800" 
                  : "hover:bg-opacity-25 hover:bg-gray-500"
              }`}
            >
              Calculator
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === "insights" 
                  ? theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800" 
                  : "hover:bg-opacity-25 hover:bg-gray-500"
              }`}
              disabled={!bmi}
            >
              Insights
            </button>
          </div>
        </div>
        <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl overflow-hidden transition-all duration-300`}>
          {activeTab === "calculator" && (
            <div className={`p-6 ${animation ? "animate-pulse" : ""}`}>
              <h2 className="text-2xl font-bold text-center mb-6">Body Metrics Calculator</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-1 ${mutedTextColor}`}>Weight (kg)</label>
                    <input 
                      type="number" 
                      value={weight}
                      placeholder="Enter weight" 
                      className={`w-full p-3 border rounded-xl ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      onChange={(e) => setWeight(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className={`block mb-1 ${mutedTextColor}`}>Height (cm)</label>
                    <input 
                      type="number" 
                      value={height}
                      placeholder="Enter height" 
                      className={`w-full p-3 border rounded-xl ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      onChange={(e) => setHeight(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className={`block mb-1 ${mutedTextColor}`}>Age</label>
                    <input 
                      type="number" 
                      value={age}
                      placeholder="Enter age" 
                      className={`w-full p-3 border rounded-xl ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      onChange={(e) => setAge(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-1 ${mutedTextColor}`}>Gender</label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)} 
                      className={`w-full p-3 border rounded-xl ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block mb-1 ${mutedTextColor}`}>Activity Level</label>
                    <select 
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value)} 
                      className={`w-full p-3 border rounded-xl ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                    >
                      <option value="sedentary">Sedentary (little or no exercise)</option>
                      <option value="light">Light (exercise 1-3 days/week)</option>
                      <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                      <option value="active">Active (exercise 6-7 days/week)</option>
                      <option value="veryActive">Very Active (hard exercise daily)</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block mb-1 ${mutedTextColor}`}>Goal Weight (kg, optional)</label>
                    <input 
                      type="number" 
                      value={goalWeight}
                      placeholder="Enter target weight" 
                      className={`w-full p-3 border rounded-xl ${
                        theme === "dark" 
                          ? "bg-gray-700 border-gray-600 text-white" 
                          : "bg-gray-50 border-gray-300 text-gray-900"
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      onChange={(e) => setGoalWeight(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button 
                  onClick={calculateBMI} 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:opacity-90 transition-all font-medium flex justify-center items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Calculate
                </button>
                <button 
                  onClick={resetForm} 
                  className={`flex-1 py-3 px-4 rounded-xl font-medium flex justify-center items-center ${
                    theme === "dark" 
                      ? "bg-gray-700 text-white hover:bg-gray-600" 
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  } transition-all`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset
                </button>
              </div>
              {bmi && (
                <div className={`mt-8 p-4 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-blue-50"}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`text-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
                      <h3 className={mutedTextColor}>Your BMI</h3>
                      <div className="text-4xl font-bold py-2" style={{ color: getBmiColor(bmi) }}>
                        {bmi}
                      </div>
                      <div className="font-medium text-sm">{message}</div>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
                      <h3 className={mutedTextColor}>Ideal Weight Range</h3>
                      <div className="text-2xl font-bold py-2 text-green-500">{idealWeight}</div>
                      {goalWeight && (
                        <div className="text-sm">
                          Goal: {goalWeight} kg
                          {timeToGoal && (
                            <span className="block">
                              Est. time: {timeToGoal.months} months
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={`text-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
                      <h3 className={mutedTextColor}>Body Composition (Est.)</h3>
                      {bodyComposition && (
                        <div className="py-2">
                          <div className="text-xl font-bold">
                            {bodyComposition.fatPercentage}% <span className="text-sm font-normal">Body Fat</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-sm mt-1">
                            <div>Fat: {bodyComposition.fatMass} kg</div>
                            <div>Lean: {bodyComposition.leanMass} kg</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {calorieNeeds && (
                      <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
                        <h3 className={`${mutedTextColor} text-center mb-2`}>Daily Calorie Needs</h3>
                        <div className="flex justify-center">
                          <div className="w-full max-w-xs">
                            <div className="flex justify-between mb-2">
                              <span>Base Metabolism:</span>
                              <span className="font-bold">{calorieNeeds.maintenance} cal</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span>For {userProfile.goal === "lose" ? "weight loss" : 
                                          userProfile.goal === "gain" ? "weight gain" : 
                                          "maintenance"}:</span>
                              <span className="font-bold text-blue-500">{calorieNeeds.adjusted} cal</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className={mutedTextColor}>Macronutrient split:</span>
                            </div>
                            <div className="flex mt-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                              <div className="bg-red-400 h-full" style={{width: '25%'}}></div>
                              <div className="bg-green-400 h-full" style={{width: '45%'}}></div>
                              <div className="bg-blue-400 h-full" style={{width: '30%'}}></div>
                            </div>
                            <div className="flex text-xs justify-between mt-1">
                              <span>25% Protein</span>
                              <span>45% Carbs</span>
                              <span>30% Fat</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {waterIntake && (
                      <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md`}>
                        <h3 className={`${mutedTextColor} text-center mb-2`}>Daily Water Intake</h3>
                        <div className="flex justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-500">{waterIntake.liters} L</div>
                            <div className="text-sm mt-1">({waterIntake.glasses} glasses)</div>
                            <div className="flex items-center justify-center mt-3">
                              <div className="relative h-20 w-20">
                                <svg viewBox="0 0 100 100" className="h-full w-full">
                                  <path 
                                    d="M50,5 C50,5 20,35 20,65 C20,85 35,95 50,95 C65,95 80,85 80,65 C80,35 50,5 50,5 Z" 
                                    fill="#E1F5FE" 
                                    stroke="#2196F3" 
                                    strokeWidth="2" 
                                  />
                                  <path 
                                    d="M50,95 C35,95 20,85 20,65 C20,50 30,35 40,25 L60,25 C70,35 80,50 80,65 C80,85 65,95 50,95 Z" 
                                    fill="#2196F3" 
                                  />
                                </svg>
                              </div>
                              <div className="ml-3 text-left">
                                <div>Based on:</div>
                                <ul className="text-sm list-disc list-inside">
                                  <li>Your weight</li>
                                  <li>Activity level</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className={`mt-6 p-4 rounded-xl border ${
                theme === "dark" 
                  ? "border-gray-700 bg-gray-700/50" 
                  : "border-blue-100 bg-blue-50"
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${theme === "dark" ? "text-blue-400" : "text-blue-500"} mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-medium">Health Tip</h3>
                  </div>
                  <button 
                    onClick={getNewTip}
                    className={`p-1 rounded-full ${theme === "dark" ? "hover:bg-gray-600" : "hover:bg-blue-100"} transition-all`}
                    aria-label="Get new tip"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <p className={`mt-2 ${mutedTextColor}`}>{tip}</p>
              </div>
            </div>
          )}
          {activeTab === "insights" && bmi && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-center mb-6">Your Health Insights</h2>
              <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-blue-50"} mb-6`}>
                <h3 className="text-lg font-semibold mb-3">BMI Categories</h3>
                <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div className="absolute top-0 left-0 h-full w-1/4 bg-blue-400"></div>
                  <div className="absolute top-0 left-1/4 h-full w-1/4 bg-green-400"></div>
                  <div className="absolute top-0 left-2/4 h-full w-1/4 bg-orange-400"></div>
                  <div className="absolute top-0 left-3/4 h-full w-1/4 bg-red-400"></div>
                  {bmi && (
                    <div 
                      className="absolute top-0 h-full w-1 bg-white"
                      style={{ 
                        left: `${Math.min(100, Math.max(0, (bmi/40)*100))}%`,
                        boxShadow: '0 0 4px rgba(0,0,0,0.5)'
                      }}
                    ></div>
                  )}
                </div>
                <div className="flex justify-between text-xs">
                  <div className="text-center" style={{ width: '25%' }}>
                    <div className="font-medium">Underweight</div>
                    <div className={mutedTextColor}>{'<18.5'}</div>
                  </div>
                  <div className="text-center" style={{ width: '25%' }}>
                    <div className="font-medium">Normal</div>
                    <div className={mutedTextColor}>18.5-24.9</div>
                  </div>
                  <div className="text-center" style={{ width: '25%' }}>
                    <div className="font-medium">Overweight</div>
                    <div className={mutedTextColor}>25-29.9</div>
                  </div>
                  <div className="text-center" style={{ width: '25%' }}>
                    <div className="font-medium">Obese</div>
                    <div className={mutedTextColor}>{'>30'}</div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <span className={mutedTextColor}>Your BMI:</span> 
                  <span className="font-bold ml-1" style={{ color: getBmiColor(bmi) }}>{bmi}</span>
                </div>
              </div>
              <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-blue-50"} mb-6`}>
                <h3 className="text-lg font-semibold mb-3">Health Considerations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                    <h4 className="font-medium mb-2">Based on Your BMI</h4>
                    <ul className="space-y-2">
                      {parseFloat(bmi) < 18.5 ? (
                        <>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Potential risk of nutrient deficiencies</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Weakened immune system</span>
                          </li>
                        </>
                      ) : parseFloat(bmi) < 25 ? (
                        <>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Lower risk of heart disease</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Lower risk of type 2 diabetes</span>
                          </li>
                        </>
                      ) : parseFloat(bmi) < 30 ? (
                        <>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Elevated risk of heart disease</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Moderate risk of type 2 diabetes</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>High risk of heart disease</span>
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>High risk of type 2 diabetes</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                    <h4 className="font-medium mb-2">General Recommendations</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>150 minutes of moderate exercise weekly</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>Balanced diet rich in whole foods</span>
                      </li>
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>Regular health check-ups</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-700" : "bg-blue-50"}`}>
                <h3 className="text-lg font-semibold mb-3">Your Personalized Plan</h3>
                <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"} mb-4`}>
                  <h4 className="font-medium mb-2">Current Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className={mutedTextColor}>Current BMI:</span> 
                      <span className="font-medium ml-1">{bmi}</span>
                    </div>
                    <div>
                      <span className={mutedTextColor}>Weight:</span> 
                      <span className="font-medium ml-1">{weight} kg</span>
                    </div>
                    {goalWeight && (
                      <>
                        <div>
                          <span className={mutedTextColor}>Goal Weight:</span> 
                          <span className="font-medium ml-1">{goalWeight} kg</span>
                        </div>
                        <div>
                          <span className={mutedTextColor}>Difference:</span> 
                          <span className="font-medium ml-1">{Math.abs(weight - goalWeight).toFixed(1)} kg</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                  <h4 className="font-medium mb-2">Recommended Actions</h4>
                  <div className="space-y-2">
                    {parseFloat(bmi) < 18.5 ? (
                      <>
                        <div className="flex items-start">
                          <div className="bg-blue-100 text-blue-800 h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">1</div>
                          <span>Increase daily caloric intake by 300-500 calories</span>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-blue-100 text-blue-800 h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">2</div>
                          <span>Focus on protein-rich foods and healthy fats</span>
                        </div>
                      </>
                    ) : parseFloat(bmi) < 25 ? (
                      <>
                        <div className="flex items-start">
                          <div className="bg-blue-100 text-blue-800 h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">1</div>
                          <span>Maintain current habits and balanced diet</span>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-blue-100 text-blue-800 h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">2</div>
                          <span>Regular exercise for cardiovascular health</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start">
                          <div className="bg-blue-100 text-blue-800 h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">1</div>
                          <span>Aim for a 500 calorie daily deficit for sustainable weight loss</span>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-blue-100 text-blue-800 h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">2</div>
                          <span>Combine cardiovascular exercise with strength training</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">3</div>
                      <span>Drink {waterIntake ? waterIntake.liters : "2-3"} liters of water daily</span>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">4</div>
                      <span>Track your progress weekly using this calculator</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bmi;