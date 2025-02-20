
import React, { useEffect, useState } from 'react';
import injuryData from '../Data/data.json';

const Injury = () => {
  const [injuries, setInjuries] = useState([]);
  const [visibleSection, setVisibleSection] = useState(null);

  useEffect(() => {
    setInjuries(injuryData);
  }, []);

  const handleButtonClick = (section) => {
    setVisibleSection((prevSection) => (prevSection === section ? null : section));
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="text-3xl font-bold text-center text-white mb-6">Injury Solutions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {injuries.map((injury, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-2xl shadow-lg p-4 hover:shadow-2xl transition duration-300 text-center"
          >
            <h2 className="text-2xl font-extrabold text-white mb-4">{injury.name}</h2>
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => handleButtonClick(`description-${index}`)}
                className="bg-purple-200 border-2 border-purple-600 text-purple-600 font-bold px-4 py-2 rounded-full hover:scale-110 transition"
              > 
                Description
              </button>
              <button
                onClick={() => handleButtonClick(`solution-${index}`)}
                className="bg-green-100 border-2 border-green-600 text-green-500 font-bold px-4 py-2 rounded-full hover:scale-110 transition"
              >
                Solution
              </button>
            </div>
            {visibleSection === `description-${index}` && (
              <p className="text-gray-300 mb-2"><strong>Description:</strong> {injury.description}</p>
            )}
            {visibleSection === `solution-${index}` && (
              <p className="text-green-400"><strong>Solution:</strong> {injury.solution}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Injury;
