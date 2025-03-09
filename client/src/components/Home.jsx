import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";
import { ArrowRight, Dumbbell, Salad, BarChart2, Brain, Bandage } from "lucide-react";

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cards = [
    {
      title: "Exercises",
      description: "Find perfect routines for your fitness level",
      color: "from-emerald-400 to-green-500",
      textColor: "text-emerald-950",
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      icon: <Dumbbell size={28} />,
      link: "/exercise"
    },
    {
      title: "Diet Plans",
      description: "Custom nutrition for your goals",
      color: "from-rose-400 to-pink-500",
      textColor: "text-rose-950",
      bgColor: "bg-gradient-to-br from-rose-50 to-rose-100", 
      icon: <Salad size={28} />,
      link: "/diet"
    },
    {
      title: "BMI Calculator",
      description: "Track your body mass index metrics",
      color: "from-green-500 to-lime-500",
      textColor: "text-green-950",
      bgColor: "bg-gradient-to-br from-green-50 to-lime-100",
      icon: <BarChart2 size={28} />,
      link: "/bmi"
    },
    {
      title: "AI Nutritionist",
      description: "Get personalized nutrition advice",
      color: "from-blue-400 to-cyan-500",
      textColor: "text-blue-950",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-100",
      icon: <Brain size={28} />,
      link: "/nutrition"
    },
    {
      title: "Injuries",
      description: "Prevention tips and recovery guides",
      color: "from-yellow-400 to-lime-500",
      textColor: "text-yellow-950",
      bgColor: "bg-gradient-to-br from-yellow-50 to-lime-100",
      icon: <Bandage size={28} />,
      link: "/injury"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(167, 139, 250, 0.3) 0%, transparent 60%),
                             radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(99, 102, 241, 0.3) 0%, transparent 40%),
                             radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(14, 165, 233, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)`
          }}
        />
      </div>
      
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-bl from-violet-600 to-purple-500 opacity-20 blur-3xl" 
           style={{ transform: `translateY(${scrollY * 0.3}px)` }} />
      <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 opacity-20 blur-3xl"
           style={{ transform: `translateY(${scrollY * -0.2}px)` }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-tl from-green-400 to-emerald-500 opacity-20 blur-3xl"
           style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
      
      <nav className="backdrop-blur-md bg-black/30 border-b border-white/10 p-4 px-6 md:px-10 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src={logo} className="w-12 md:w-16 lg:w-20" alt="FitVerse Logo" />
          <div className="hidden md:block h-8 w-px bg-white/20" />
          <h1 className="hidden md:block text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            FitVerse
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-white hover:text-cyan-400 transition-colors duration-300">
            Login
          </button>
          <button className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-medium py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105">
            Get Started
          </button>
        </div>
      </nav>
      
      <div className="relative z-10 px-4 pt-16 pb-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-block mb-4 px-6 py-2 bg-white/5 backdrop-blur-sm rounded-full">
            <span className="text-cyan-400 font-medium">Transform Your Fitness Journey</span>
          </div>
          
          <h1 className="font-extrabold text-white text-5xl md:text-6xl lg:text-7xl tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">FitVerse</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Your all-in-one fitness companion for a healthier lifestyle. Personalized workouts, nutrition plans, and expert guidance - all in one place.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 text-white font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20">
              Start Your Journey
            </button>
            <button className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
      
      <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-bold text-2xl md:text-3xl text-white">
            What are you up to today?
          </h2>
          <div className="mt-2 h-1 w-20 bg-gradient-to-r from-green-400 to-cyan-400 mx-auto rounded-full"></div>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {cards.map((card, index) => (
            <motion.div key={index} variants={item}>
              <Link 
                to={card.link}
                className={`${card.bgColor} rounded-2xl overflow-hidden group transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-${card.color.split(' ')[0]}/20 flex flex-col h-full`}
              >
                <div className="p-6 flex flex-col h-full">
                  <div className={`w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-gradient-to-r ${card.color} ${card.textColor} bg-opacity-10`}>
                    {card.icon}
                  </div>
                  <h3 className={`font-bold text-xl ${card.textColor}`}>{card.title}</h3>
                  <p className={`mt-2 ${card.textColor} opacity-80`}>{card.description}</p>
                  <div className="mt-auto pt-4 flex items-center font-medium">
                    <span className={`${card.textColor}`}>Explore</span>
                    <ArrowRight size={16} className={`ml-2 transition-transform duration-300 group-hover:translate-x-1 ${card.textColor}`} />
                  </div>
                </div>
                <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${card.color}`}></div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="relative z-10 px-4 py-16 bg-gradient-to-b from-black/0 via-black/50 to-black/0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto rounded-3xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10"
        >
          <div className="px-6 py-12 md:px-10 md:py-16 text-center">
            <h2 className="font-bold text-2xl md:text-3xl text-white mb-10">
              Join thousands transforming their lives with FitVerse
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">10K+</p>
                <p className="text-gray-400 mt-2">Active Users</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">500+</p>
                <p className="text-gray-400 mt-2">Workout Plans</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">300+</p>
                <p className="text-gray-400 mt-2">Diet Templates</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">95%</p>
                <p className="text-gray-400 mt-2">Success Rate</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
   
      <footer className="relative z-10 px-6 py-8 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src={logo} className="w-10 mr-3" alt="FitVerse Logo" />
            <p className="text-white/70 text-sm">© 2025 FitVerse. All rights reserved.</p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-white/70 hover:text-white transition-colors">About</a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;