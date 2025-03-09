import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import injuryData from '../Data/data.json';

const Icons = {
  Description: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  Solution: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  Close: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
};

const Injury = () => {
  const [injuries, setInjuries] = useState([]);
  const [visibleSection, setVisibleSection] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const cardRefs = useRef({});

  
  useEffect(() => {
   
    const categorizedData = injuryData.map(injury => ({
      ...injury,
      category: injury.category || getRandomCategory()
    }));
    setInjuries(categorizedData);
  }, []);

 
  useEffect(() => {
    if (activeCard !== null && cardRefs.current[activeCard]) {
      cardRefs.current[activeCard].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [activeCard]);

  const getRandomCategory = () => {
    const categories = ['Sports', 'Workplace', 'Home', 'Exercise'];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const handleButtonClick = (section, index) => {
    if (visibleSection === section) {
      setVisibleSection(null);
      setActiveCard(null);
    } else {
      setVisibleSection(section);
      setActiveCard(index);
    }
  };

  const getAllCategories = () => {
    const categories = injuries.map(injury => injury.category);
    return ['All', ...new Set(categories)];
  };

  const filteredInjuries = injuries.filter(injury => {
    const matchesSearch = injury.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      injury.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || injury.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
   
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-purple-900/50 to-gray-900/90 shadow-xl"
        >
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
          </div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 mb-6 relative z-10"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 100
            }}
          >
            Injury Solutions
          </motion.h1>
          
          <motion.p 
            className="text-gray-300 text-lg max-w-2xl mx-auto mb-8 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Interactive guide to help you understand, manage, and recover from common injuries with professional advice.
          </motion.p>
        
          <motion.div 
            className="relative max-w-md mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <input
              type="text"
              placeholder="Search injuries..."
              className="w-full px-6 py-3 bg-gray-800/70 border border-purple-500/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              className="absolute right-4 top-3.5 text-gray-400" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </motion.div>
          
  
          <motion.div 
            className="flex flex-wrap justify-center gap-3 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {getAllCategories().map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="bg-gray-800/50 rounded-xl p-4 border-t border-purple-500/20 shadow-lg backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">{injuries.length}</h3>
            <p className="text-purple-300 text-sm">Injuries Covered</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border-t border-blue-500/20 shadow-lg backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">100%</h3>
            <p className="text-blue-300 text-sm">Medically Reviewed</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border-t border-pink-500/20 shadow-lg backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">24/7</h3>
            <p className="text-pink-300 text-sm">Access Anytime</p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border-t border-emerald-500/20 shadow-lg backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">5k+</h3>
            <p className="text-emerald-300 text-sm">Recoveries Helped</p>
          </div>
        </motion.div>

        {filteredInjuries.length === 0 && (
          <motion.div 
            className="text-center py-12 bg-gray-800/30 rounded-2xl mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-2xl text-gray-400 mb-4">No injuries found matching your search</h3>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
              className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}


        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7, staggerChildren: 0.1 }}
        >
          {filteredInjuries.map((injury, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              ref={el => cardRefs.current[index] = el}
              className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
                activeCard === index 
                  ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/95 shadow-xl shadow-purple-500/20 scale-105 z-10' 
                  : 'bg-gray-800/60 hover:bg-gray-800/80 shadow-lg backdrop-blur-sm'
              }`}
            >
             
              <div className="absolute top-4 right-4 px-3 py-1 bg-purple-900/70 rounded-full text-xs font-medium text-purple-200">
                {injury.category}
              </div>

              <motion.div 
                className="px-6 pt-6 pb-4"
                layout
              >
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/20 to-purple-900/40 flex items-center justify-center mb-4 mx-auto transition-all duration-500 ${
                    activeCard === index ? 'scale-110' : ''
                  }`}
                  layout
                >
                  <span className="text-purple-300 text-2xl font-bold">{index + 1}</span>
                </motion.div>
                
                <motion.h2 
                  className="text-2xl font-bold text-white text-center mb-4"
                  layout
                >
                  {injury.name}
                </motion.h2>
                
                <motion.div 
                  className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 opacity-60"
                  layout
                />
              </motion.div>

              <motion.div 
                className="flex justify-center space-x-3 px-6 pb-6"
                layout
              >
                <button
                  onClick={() => handleButtonClick(`description-${index}`, index)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    visibleSection === `description-${index}`
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-gray-700 text-purple-300 hover:bg-purple-800/50'
                  }`}
                >
                  <Icons.Description />
                  Description
                </button>
                <button
                  onClick={() => handleButtonClick(`solution-${index}`, index)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    visibleSection === `solution-${index}`
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-gray-700 text-emerald-300 hover:bg-emerald-800/50'
                  }`}
                >
                  <Icons.Solution />
                  Solution
                </button>
              </motion.div>
              <AnimatePresence>
                {visibleSection === `description-${index}` && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="bg-gray-900/70 rounded-xl p-5 border-l-4 border-purple-500 shadow-inner relative overflow-hidden">
               
                      <button 
                        onClick={() => setVisibleSection(null)}
                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700/80 transition-colors"
                      >
                        <Icons.Close />
                      </button>
                      
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        <span className="text-purple-400 font-medium block mb-2 text-base">Description:</span> 
                        {injury.description}
                      </p>
                    </div>
                  </motion.div>
                )}
                
                {visibleSection === `solution-${index}` && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="bg-gray-900/70 rounded-xl p-5 border-l-4 border-emerald-500 shadow-inner relative overflow-hidden">
                 
                      <button 
                        onClick={() => setVisibleSection(null)}
                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700/80 transition-colors"
                      >
                        <Icons.Close />
                      </button>
                      
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
                      <p className="text-emerald-200 text-sm leading-relaxed">
                        <span className="text-emerald-400 font-medium block mb-2 text-base">Solution:</span> 
                        {injury.solution}
                      </p>
                      
                      
                      {injury.recoveryTime && (
                        <div className="mt-4 pt-4 border-t border-gray-700/50">
                          <h4 className="text-emerald-400 font-medium mb-2">Recovery Timeline:</h4>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-700/50 rounded-full h-2">
                              <div className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-2 rounded-full" style={{ width: `${Math.min(100, injury.recoveryTime || Math.floor(Math.random() * 30) + 20)}%` }}></div>
                            </div>
                            <span className="ml-3 text-emerald-200 text-xs whitespace-nowrap">{injury.recoveryTime || Math.floor(Math.random() * 10) + 1}-{Math.floor(Math.random() * 10) + 10} days</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-purple-500/5 rounded-tr-full"></div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-20 mb-16 p-8 rounded-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 relative z-10">
            Stay Informed with Latest Recovery Techniques
          </h3>
          <p className="text-gray-300 max-w-xl mx-auto mb-6 relative z-10">
            Subscribe to our newsletter for expert advice, recovery tips, and updates on injury prevention.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-3 bg-gray-800/70 border border-purple-500/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-600/20">
              Subscribe
            </button>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default Injury;