import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, RefreshCw } from "lucide-react";
import mealData from "../Data/diet";

const Dietplans = () => {
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const mealTypes = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];

  const filteredMeals = mealData.filter(
    (meal) =>
      (selectedType === "All" || meal.type === selectedType) &&
      meal.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchAISuggestions();
    const savedFavorites = localStorage.getItem("mealFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const fetchAISuggestions = async () => {
    setLoading(true);
    setIsRefreshing(true);
    setError(null);
    
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCQKjoV0c1FoExeM22eCuoMXSShlSfcxDc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: "Suggest 3 healthy meals focusing on balanced diets with high protein and low carbs. Format your response as follows for each meal: 1. Meal title, followed by 2. A list of ingredients and details, one per line. Keep responses concise and clear."
                  }
                ]
              }
            ]
          })
        }
      );
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
        throw new Error("Invalid response format from API");
      }
      
      const aiText = data.candidates[0].content.parts[0].text;
      console.log("Raw AI response:", aiText); 
      const mealSections = aiText.split(/(?:Meal \d+:|^\d+\.|^\*\s)/m)
        .filter(section => section.trim().length > 0);
      
      if (mealSections.length === 0) {
        
        const fallbackSuggestions = [{
          title: "AI Suggested Meal",
          ingredients: aiText.split('\n').filter(line => line.trim()),
          id: Math.random().toString(36).substr(2, 9)
        }];
        
        setAiSuggestions(fallbackSuggestions);
      } else {
        const formattedSuggestions = mealSections.map(section => {
          const lines = section.split('\n').filter(line => line.trim().length > 0);
          let title = lines[0].replace(/^[:#\-*]+|\*\*/g, '').trim();
          
          
          if (title.length > 50) {
            title = "Healthy Meal Option";
          }
          
          const ingredients = lines.slice(1)
            .map(line => line.replace(/^[-•*]|\*\*/g, '').trim())
            .filter(line => line.length > 0 && line !== title);
       
          if (ingredients.length === 0 && lines.length > 0) {
            return {
              title: "Balanced Meal",
              ingredients: lines.map(line => line.trim()),
              id: Math.random().toString(36).substr(2, 9)
            };
          }
          
          return {
            title,
            ingredients,
            id: Math.random().toString(36).substr(2, 9)
          };
        });
        
        
        const suggestionCount = formattedSuggestions.length;
        if (suggestionCount < 3) {
          const defaultSuggestions = [
            {
              title: "Greek Yogurt Protein Bowl",
              ingredients: [
                "2 cups Greek yogurt (high protein)",
                "1/4 cup mixed berries",
                "1 tbsp honey",
                "2 tbsp chopped nuts",
                "1 tsp chia seeds"
              ],
              id: Math.random().toString(36).substr(2, 9)
            },
            {
              title: "Grilled Chicken Salad",
              ingredients: [
                "6 oz grilled chicken breast",
                "2 cups mixed greens",
                "1/4 avocado, sliced",
                "1/2 cucumber, diced",
                "2 tbsp olive oil and lemon dressing"
              ],
              id: Math.random().toString(36).substr(2, 9)
            },
            {
              title: "Salmon with Roasted Vegetables",
              ingredients: [
                "5 oz wild-caught salmon fillet",
                "1 cup Brussels sprouts, halved",
                "1 cup cauliflower florets",
                "1 tbsp olive oil",
                "1 tsp herbs de Provence"
              ],
              id: Math.random().toString(36).substr(2, 9)
            }
          ];
          
        
          for (let i = 0; i < 3 - suggestionCount; i++) {
            formattedSuggestions.push(defaultSuggestions[i]);
          }
        }
        
        setAiSuggestions(formattedSuggestions.slice(0,3)); 
      }
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      setError("Failed to load AI suggestions. Using fallback meal ideas instead.");
      
  
      setAiSuggestions([
        {
          title: "High-Protein Breakfast Bowl",
          ingredients: [
            "3 egg whites, scrambled",
            "1/2 cup black beans",
            "1/4 avocado, sliced",
            "2 tbsp salsa",
            "Fresh cilantro for garnish"
          ],
          id: Math.random().toString(36).substr(2, 9)
        },
        {
          title: "Mediterranean Chicken Plate",
          ingredients: [
            "5 oz grilled chicken breast",
            "1 cup cucumber and tomato salad",
            "2 tbsp hummus",
            "1/4 cup tzatziki",
            "Lemon wedge and fresh herbs"
          ],
          id: Math.random().toString(36).substr(2, 9)
        },
        {
          title: "Baked Cod with Vegetables",
          ingredients: [
            "6 oz cod fillet",
            "1 cup roasted asparagus",
            "1/2 cup cherry tomatoes",
            "1 tbsp olive oil",
            "1 tsp lemon zest and herbs"
          ],
          id: Math.random().toString(36).substr(2, 9)
        }
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const toggleFavorite = (mealId) => {
    const newFavorites = favorites.includes(mealId)
      ? favorites.filter(id => id !== mealId)
      : [...favorites, mealId];
    
    setFavorites(newFavorites);
    localStorage.setItem("mealFavorites", JSON.stringify(newFavorites));
  };

  const isFavorite = (mealId) => favorites.includes(mealId);

  const NutritionBar = ({ value, total, type, color }) => {
    const percentage = (value / total) * 100;
    return (
      <div className="mt-1">
        <div className="flex justify-between text-xs mb-1">
          <span>{type}: {value}g</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  const MealCard = ({ meal, isAiMeal = false }) => {
    const mealId = meal.id || `regular-${meal.name}`;
    
    return (
      <div className="bg-gray-800 p-5 rounded-2xl shadow-lg text-white transition-all duration-300 hover:shadow-xl hover:bg-gray-750 border border-gray-700 hover:border-gray-600">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-emerald-400">{meal.name || meal.title}</h3>
          <button 
            onClick={() => toggleFavorite(mealId)}
            className="text-gray-400 hover:text-yellow-400 transition-colors"
          >
            {isFavorite(mealId) ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            )}
          </button>
        </div>
        
        {!isAiMeal && (
          <>
            <div className="inline-block px-2 py-1 rounded-lg bg-gray-700 text-sm font-medium text-gray-300 mb-3">
              {meal.type}
            </div>
            <p className="mt-2 text-gray-300 mb-4">{meal.description}</p>
            
            <div className="mt-4 pt-3 border-t border-gray-700">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Calories:</span>
                <span className="text-emerald-400 font-bold">{meal.calories} kcal</span>
              </div>
              
              <NutritionBar value={parseInt(meal.protein)} total={50} type="Protein" color="bg-blue-500" />
              <NutritionBar value={parseInt(meal.carbs)} total={300} type="Carbs" color="bg-green-500" />
              <NutritionBar value={parseInt(meal.fats)} total={65} type="Fats" color="bg-yellow-500" />
            </div>
          </>
        )}
        
        {isAiMeal && (
          <div className="mt-3">
            <div className="inline-block px-2 py-1 rounded-lg bg-blue-600 text-sm font-medium text-white mb-3">
              AI Suggested
            </div>
            <ul className="space-y-2">
              {meal.ingredients && meal.ingredients.length > 0 ? (
                meal.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-emerald-400 mr-2">•</span>
                    <span className="text-gray-300">{ingredient}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No ingredients available</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
            NutriPlanner
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover balanced meal options tailored to your nutritional goals with AI-powered suggestions
          </p>
        </header>

        <div className="sticky top-4 z-10 bg-gray-800 p-4 rounded-xl shadow-lg mb-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search meals..."
                className="w-full p-3 pl-10 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="relative min-w-64">
              <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                className="w-full p-3 pl-10 rounded-xl bg-gray-900 border border-gray-700 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-all"
                onChange={(e) => setSelectedType(e.target.value)}
                value={selectedType}
              >
                {mealTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-3 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              AI-Generated Suggestions
            </h2>
            <button 
              onClick={fetchAISuggestions}
              disabled={isRefreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isRefreshing ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
            >
              <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {loading && aiSuggestions.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700 animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-700 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aiSuggestions.map((meal, index) => (
                <MealCard key={meal.id || index} meal={meal} isAiMeal={true} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Meal Database
            </h2>
            <div className="text-gray-400 text-sm">
              {filteredMeals.length} meals found
            </div>
          </div>
          
          {filteredMeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeals.map((meal) => (
                <MealCard key={meal.name} meal={meal} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 p-8 rounded-2xl text-center border border-gray-700">
              <p className="text-gray-400 mb-3">No meals match your search criteria</p>
              <button 
                onClick={() => {setSearch(""); setSelectedType("All");}}
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dietplans;