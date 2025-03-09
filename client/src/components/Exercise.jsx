import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import exercisesData from "../Data/exercise";
import { FiSearch, FiX, FiCheck, FiChevronRight, FiPlus, FiArrowRight, FiAward, FiActivity, FiCalendar } from "react-icons/fi";
import { HiOutlineFire, HiOutlineLightningBolt } from "react-icons/hi";
import { BsPersonFill, BsClock } from "react-icons/bs";

const Exercise = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [plannedWorkouts, setPlannedWorkouts] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState("");
  const [chatStep, setChatStep] = useState(1);
  const [workoutType, setWorkoutType] = useState("");
  const [workoutDuration, setWorkoutDuration] = useState("");
  const [workoutGoal, setWorkoutGoal] = useState("");
  const [hasInjuries, setHasInjuries] = useState("");
  const [otherInfo, setOtherInfo] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isHoverChallengeCard, setIsHoverChallengeCard] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [addedToast, setAddedToast] = useState(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const categories = ["All", "Strength", "Cardio", "Flexibility", "HIIT", "Yoga"];
  const challenges = [
    "Complete 50 squats today!",
    "Run for 20 minutes without stopping!",
    "Try a 10-minute yoga stretch session.",
    "Do 3 sets of push-ups to failure."
  ];
  const categoryIcons = {
    "All": <FiActivity className="text-indigo-400" />,
    "Strength": <HiOutlineLightningBolt className="text-red-400" />,
    "Cardio": <HiOutlineFire className="text-orange-400" />,
    "Flexibility": <BsPersonFill className="text-blue-400" />,
    "HIIT": <FiActivity className="text-green-400" />,
    "Yoga": <BsPersonFill className="text-purple-400" />
  };

  useEffect(() => {
    setDailyChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
    if (showChatbot && inputRef.current) {
      inputRef.current.focus();
    }
    if (chatContainerRef.current && chatStep > 1) {
      chatContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatStep, showChatbot]);

  useEffect(() => {
    if (chatStep === 6 && generatedPlan) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [chatStep, generatedPlan]);

  const handlePlanWorkout = (exercise) => {
    setPlannedWorkouts([...plannedWorkouts, exercise]);
    setAddedToast(exercise.name);
    setTimeout(() => setAddedToast(null), 2000);
  };

  const handleNext = () => {
    if (chatStep < 5) {
      setChatStep(chatStep + 1);
    } else {
      generateWorkoutPlan();
    }
  };
  const generateWorkoutPlan = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate a personalized workout plan with the following details:
      - Workout focus: ${workoutType}
      - Available time: ${workoutDuration}
      - Fitness goal: ${workoutGoal}
      - Injuries to consider: ${hasInjuries === "Yes" ? "Yes, but no specific details provided" : "None"}
      - Additional information: ${otherInfo || "None provided"}
      
      Please provide only one detailed workout plan with exercises, sets, reps, and rest periods. Include warm-up and cool-down suggestions.`;

      const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=AIzaSyCQKjoV0c1FoExeM22eCuoMXSShlSfcxDc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text || "Failed to generate workout plan.";
      setGeneratedPlan(aiText.replace(/\n/g, "<br />").replace(/\*/g, ""));
      setChatStep(6);
    } catch (error) {
      console.error("Error generating workout plan:", error);
      setGeneratedPlan("Sorry, there was an error generating your workout plan. Please try again later.");
      setChatStep(6);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNext();
    }
  };

  const Confetti = () => {
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`
            }}
            animate={{
              y: window.innerHeight,
              x: Math.random() * 200 - 100,
              rotate: Math.random() * 360
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    );
  };

  const renderChatStep = () => {
    switch (chatStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="chat-step"
          >
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">What do you want to workout today?</h3>
            <p className="text-gray-400 mb-4">For example: upper body, legs, full body, cardio, etc.</p>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={workoutType}
                onChange={(e) => setWorkoutType(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-4 pl-12 border border-gray-700 bg-gray-800/50 text-white rounded-2xl mb-4 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter workout focus..."
                style={{ boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)" }}
              />
              <HiOutlineFire className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl" />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="chat-step"
          >
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">How much time do you want to spend on your workout?</h3>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={workoutDuration}
                onChange={(e) => setWorkoutDuration(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-4 pl-12 border border-gray-700 bg-gray-800/50 text-white rounded-2xl mb-4 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="For example: 30 minutes, 1 hour..."
                style={{ boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)" }}
              />
              <BsClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl" />
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="chat-step"
          >
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">What is your fitness goal?</h3>
            <p className="text-gray-400 mb-4">For example: lose weight, build muscle, improve endurance, get fit, etc.</p>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={workoutGoal}
                onChange={(e) => setWorkoutGoal(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-4 pl-12 border border-gray-700 bg-gray-800/50 text-white rounded-2xl mb-4 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your goal..."
                style={{ boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)" }}
              />
              <FiAward className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 text-xl" />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="chat-step"
          >
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Do you have any injuries we should consider?</h3>
            <div className="flex gap-4 mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 p-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${hasInjuries === "Yes" ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30" : "bg-gray-800 border border-gray-700"}`}
                onClick={() => {
                  setHasInjuries("Yes");
                  setTimeout(() => handleNext(), 500);
                }}
              >
                <span>Yes</span>
                {hasInjuries === "Yes" && <FiCheck className="text-white" />}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 p-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${hasInjuries === "No" ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30" : "bg-gray-800 border border-gray-700"}`}
                onClick={() => {
                  setHasInjuries("No");
                  setTimeout(() => handleNext(), 500);
                }}
              >
                <span>No</span>
                {hasInjuries === "No" && <FiCheck className="text-white" />}
              </motion.button>
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="chat-step"
          >
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Any other information you'd like to share?</h3>
            <textarea
              ref={inputRef}
              value={otherInfo}
              onChange={(e) => setOtherInfo(e.target.value)}
              className="w-full p-4 border border-gray-700 bg-gray-800/50 text-white rounded-2xl mb-4 h-32 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="Any specific equipment available, experience level, preferences, etc."
              style={{ boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)" }}
            />
          </motion.div>
        );
      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="chat-step"
          >
            <motion.h3
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent text-center"
            >
              Your Personalized Workout Plan
            </motion.h3>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/80 p-6 rounded-2xl backdrop-blur-md border border-gray-800"
              style={{ boxShadow: "0 8px 32px rgba(31, 38, 135, 0.3)" }}
            >
              <div className="prose prose-invert max-w-none text-white" dangerouslySetInnerHTML={{ __html: generatedPlan }} />
            </motion.div>
            <div className="flex gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setChatStep(1);
                  setWorkoutType("");
                  setWorkoutDuration("");
                  setWorkoutGoal("");
                  setHasInjuries("");
                  setOtherInfo("");
                  setGeneratedPlan("");
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all duration-300"
              >
                <FiPlus className="text-lg" />
                Create New Plan
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowChatbot(false)}
                className="flex-1 bg-gray-800 text-white py-4 rounded-2xl hover:bg-gray-700 font-medium border border-gray-700 flex items-center justify-center gap-2 transition-all duration-300"
              >
                <FiSearch className="text-lg" />
                Browse Exercise Library
              </motion.button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const filteredExercises = exercisesData.filter((exercise) => {
    return (
      (selectedCategory === "All" || exercise.category === selectedCategory) &&
      exercise.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen">
      {showConfetti && <Confetti />}
      {addedToast && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-full flex items-center gap-2 shadow-lg z-50"
        >
          <FiCheck className="text-white" />
          <span className="font-medium">{addedToast} added to plan</span>
        </motion.div>
      )}
      <div className="max-w-5xl mx-auto p-6 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 pt-6"
        >
          <div className="relative">
            <h1 className="text-5xl font-bold mb-2 text-center bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">Exercise Hub</h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
          </div>
        </motion.div>
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setIsHoverChallengeCard(true)}
              onHoverEnd={() => setIsHoverChallengeCard(false)}
              className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-800/50 relative overflow-hidden transition-all duration-300"
              style={{ boxShadow: isHoverChallengeCard ? "0 10px 40px rgba(25, 118, 210, 0.3)" : "0 8px 32px rgba(31, 38, 135, 0.2)" }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl text-white">
                  <FiAward className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Daily Challenge</h2>
              </div>
              <p className="mt-3 text-white/90 text-lg">{dailyChallenge}</p>
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: isHoverChallengeCard ? "100%" : "0%" }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"
              />
            </motion.div>
          </motion.div>
          {!showChatbot ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowChatbot(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 px-6 rounded-2xl shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-3 text-lg font-medium"
                style={{ letterSpacing: "0.5px" }}
              >
                <div className="bg-white/20 p-2 rounded-lg">
                  <HiOutlineLightningBolt className="text-2xl" />
                </div>
                Get Your AI Workout Plan
                <FiArrowRight className="ml-2" />
              </motion.button>
              <AnimatePresence>
                {plannedWorkouts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-8"
                  >
                    <motion.div 
                      className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-800/50 overflow-hidden"
                      style={{ boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)" }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl text-white">
                          <FiCalendar className="text-xl" />
                        </div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Your Planned Workouts</h2>
                      </div>
                      <div className="space-y-3">
                        {plannedWorkouts.map((exercise, index) => (
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={index}
                            className="bg-gray-800/50 p-4 rounded-xl flex justify-between items-center border border-gray-700/50 hover:border-indigo-500/50 transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-2 rounded-lg text-blue-400 group-hover:text-indigo-400 transition-colors duration-300">
                                {categoryIcons[exercise.category]}
                              </div>
                              <span className="font-medium text-white">{exercise.name}</span>
                            </div>
                            <span className="text-gray-400 text-sm px-3 py-1 rounded-full bg-gray-700/50 group-hover:bg-indigo-900/20 transition-colors duration-300">
                              {exercise.category}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
              ref={chatContainerRef}
            >
              <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-800/50 relative overflow-hidden"
                style={{ boxShadow: "0 15px 50px rgba(31, 38, 135, 0.3)" }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl text-white">
                      <HiOutlineLightningBolt className="text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">AI Workout Planner</h2>
                  </div>
                  {chatStep < 6 && (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowChatbot(false)}
                      className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-all duration-300"
                    >
                      <FiX className="text-xl" />
                    </motion.button>
                  )}
                </div>
                {chatStep < 6 && (
                  <div className="mb-6">
                    <div className="flex w-full justify-between mb-1">
                      {[1, 2, 3, 4, 5].map((step) => (
                        <motion.div
                          key={step}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: step * 0.1 }}
                          className="flex-1 px-2"
                        >
                          <div className="flex flex-col items-center">
                            <motion.div 
                              animate={{
                                scale: chatStep === step ? [1, 1.1, 1] : 1
                              }}
                              transition={{
                                duration: 1,
                                repeat: chatStep === step ? Infinity : 0,
                                repeatType: "reverse"
                              }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                                ${chatStep === step 
                                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" 
                                  : chatStep > step 
                                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" 
                                    : "bg-gray-800 text-gray-400 border border-gray-700"}`}
                            >
                              {chatStep > step ? <FiCheck className="text-lg" /> : step}
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${(chatStep - 1) * 25}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      />
                    </div>
                  </div>
                )}
                <AnimatePresence mode="wait">
                  <div key={chatStep} className="min-h-64">
                    {renderChatStep()}
                  </div>
                </AnimatePresence>
                {chatStep < 5 && chatStep !== 4 && (
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNext}
                    disabled={
                      (chatStep === 1 && !workoutType.trim()) ||
                      (chatStep === 2 && !workoutDuration.trim()) ||
                      (chatStep === 3 && !workoutGoal.trim())
                    }
                    className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-medium shadow-lg shadow-blue-500/20 transition-all duration-300 mt-4 flex items-center justify-center gap-2 ${
                      (chatStep === 1 && !workoutType.trim()) ||
                      (chatStep === 2 && !workoutDuration.trim()) ||
                      (chatStep === 3 && !workoutGoal.trim())
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:from-blue-700 hover:to-indigo-700"
                    }`}
                  >
                    Continue <FiChevronRight className="text-lg" />
                  </motion.button>
                )}
                {chatStep === 5 && (
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={generateWorkoutPlan}
                    disabled={isGenerating}
                    className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-medium shadow-lg shadow-blue-500/20 transition-all duration-300 mt-4 flex items-center justify-center gap-2 ${
                      isGenerating ? "opacity-80 cursor-wait" : "hover:from-blue-700 hover:to-indigo-700"
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Generating Your Plan...
                      </>
                    ) : (
                      <>
                        Generate Workout Plan <FiChevronRight className="text-lg" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
          {!showChatbot && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <div className="mb-6">
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search exercises..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full p-4 pl-12 bg-gray-800/70 text-white rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 backdrop-blur-sm border border-gray-700"
                      style={{ boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)" }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mb-6">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`py-2 px-4 rounded-full flex items-center gap-2 transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                          : "bg-gray-800/70 text-gray-300 border border-gray-700"
                      }`}
                    >
                      {categoryIcons[category]}
                      {category}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {filteredExercises.length > 0 ? (
                  filteredExercises.map((exercise, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      key={exercise.id}
                      className={`bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 backdrop-blur-sm border border-gray-800/50 ${
                        expandedExercise === exercise.id ? "col-span-full" : ""
                      }`}
                      style={{ boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)" }}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-3 rounded-xl text-white ${
                              exercise.category === "Strength" ? "bg-gradient-to-br from-red-500 to-red-600" :
                              exercise.category === "Cardio" ? "bg-gradient-to-br from-orange-500 to-orange-600" :
                              exercise.category === "Flexibility" ? "bg-gradient-to-br from-blue-500 to-blue-600" :
                              exercise.category === "Yoga" ? "bg-gradient-to-br from-purple-500 to-purple-600" :
                              "bg-gradient-to-br from-green-500 to-green-600"
                            }`}>
                              {categoryIcons[exercise.category]}
                            </div>
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-all duration-300">
                              {exercise.name}
                            </h3>
                          </div>
                          <span className="text-xs px-3 py-1 rounded-full bg-gray-700/50 text-gray-300 uppercase tracking-wide">
                            {exercise.category}
                          </span>
                        </div>
                        <motion.div
                          animate={{ height: expandedExercise === exercise.id ? "auto" : "60px" }}
                          transition={{ duration: 0.3 }}
                          className="text-gray-400 overflow-hidden"
                        >
                          <p className="mb-4">{exercise.description}</p>
                          {expandedExercise === exercise.id && (
                            <div className="mt-4 space-y-3">
                              <div className="bg-gray-800/70 p-3 rounded-xl">
                                <span className="text-sm text-gray-300 font-medium">Muscles Worked:</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {exercise.musclesWorked.map((muscle, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 rounded-full bg-blue-900/30 text-blue-300 border border-blue-800/50">
                                      {muscle}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-gray-800/70 p-3 rounded-xl">
                                <span className="text-sm text-gray-300 font-medium">How to do it:</span>
                                <ol className="list-decimal list-inside mt-2 space-y-2 text-sm">
                                  {exercise.instructions.map((instruction, idx) => (
                                    <li key={idx}>{instruction}</li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          )}
                        </motion.div>
                        <div className="flex justify-between items-center mt-4">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setExpandedExercise(expandedExercise === exercise.id ? null : exercise.id)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-all duration-300"
                          >
                            {expandedExercise === exercise.id ? "Show Less" : "Show More"}
                            <motion.div
                              animate={{ rotate: expandedExercise === exercise.id ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <FiChevronRight className="text-lg" />
                            </motion.div>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePlanWorkout(exercise)}
                            className="py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/10 transition-all duration-300 flex items-center gap-1"
                          >
                            <FiPlus className="text-lg" />
                            Add to Plan
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-12 bg-gray-800/50 rounded-2xl border border-gray-700"
                  >
                    <FiSearch className="text-4xl text-gray-500 mx-auto mb-3" />
                    <h3 className="text-xl font-medium text-gray-400">No exercises found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                  </motion.div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exercise;