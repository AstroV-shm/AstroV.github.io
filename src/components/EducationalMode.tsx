import { useState } from 'react';
import { BookOpen, X, ChevronRight, Info, History, Lightbulb } from 'lucide-react';
import { getHistoricalImpacts } from '../utils/impactCalculator';

interface EducationalModeProps {
  isEnabled: boolean;
  onToggle: () => void;
}

export default function EducationalMode({ isEnabled, onToggle }: EducationalModeProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const tutorialSteps = [
    {
      title: 'Welcome to AstroV',
      content: 'Learn about asteroid impacts and how to simulate them. This tool uses real physics calculations to show the potential effects of Near-Earth Objects.',
    },
    {
      title: 'What is an Asteroid?',
      content: 'Asteroids are rocky remnants from the early solar system. Most orbit between Mars and Jupiter, but some (Near-Earth Objects) pass close to Earth.',
    },
    {
      title: 'Impact Energy',
      content: 'Impact energy is calculated using E = ½mv². A small asteroid moving fast can release more energy than the largest nuclear weapons.',
    },
    {
      title: 'The Parameters',
      content: 'Diameter affects mass, velocity affects energy, angle changes effectiveness, and density (rocky/metallic/icy) determines composition.',
    },
    {
      title: 'Understanding Results',
      content: 'Results show crater size, affected area, and environmental effects. Energy is measured in megatons of TNT equivalent.',
    },
    {
      title: 'Mitigation Strategies',
      content: 'If detected early enough, asteroids can be deflected using kinetic impactors, nuclear devices, or gravity tractors.',
    },
  ];

  const infoCards = [
    {
      term: 'Diameter',
      definition: 'The width of the asteroid. Larger asteroids are rarer but far more dangerous.',
    },
    {
      term: 'Velocity',
      definition: "Impact speed in km/s. Earth's escape velocity is 11 km/s. Asteroids typically hit at 15-35 km/s.",
    },
    {
      term: 'Impact Angle',
      definition: 'Angle of entry. 90° is straight down, 0° is grazing. Most real impacts are 30-45°.',
    },
    {
      term: 'Megatons TNT',
      definition: 'Energy comparison. 1 megaton = 1 million tons of TNT = ~4.2 × 10¹⁵ joules.',
    },
    {
      term: 'Crater Diameter',
      definition: 'The size of the impact crater. Typically 10-20 times larger than the asteroid.',
    },
    {
      term: 'PHO',
      definition: 'Potentially Hazardous Object - asteroids >140m that pass within 7.5M km of Earth.',
    },
  ];

  const historicalImpacts = getHistoricalImpacts();

  if (!isEnabled) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-50"
        title="Enable Educational Mode"
      >
        <BookOpen size={24} />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-colors z-50"
        title="Disable Educational Mode"
      >
        <Lightbulb size={24} />
      </button>

      <div className="fixed top-20 right-4 flex flex-col gap-2 z-50">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Info size={18} />
          <span>Glossary</span>
        </button>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <History size={18} />
          <span>History</span>
        </button>

        <button
          onClick={() => setCurrentTutorialStep(0)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <BookOpen size={18} />
          <span>Tutorial</span>
        </button>
      </div>

      {showInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Info className="text-blue-400" />
                Glossary
              </h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {infoCards.map((card, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <h3 className="font-bold text-blue-400 mb-2">{card.term}</h3>
                  <p className="text-gray-300 text-sm">{card.definition}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <History className="text-orange-400" />
                Famous Impact Events
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {historicalImpacts.map((impact, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-5 border border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-white">{impact.name}</h3>
                    <span className="text-gray-400 text-sm">
                      {impact.year > 0 ? impact.year : `${Math.abs(impact.year).toLocaleString()} BCE`}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-gray-400 text-sm">Diameter</span>
                      <p className="text-blue-400 font-bold">{impact.diameter}m</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Energy</span>
                      <p className="text-orange-400 font-bold">
                        {impact.energy >= 1000000
                          ? `${(impact.energy / 1000000).toFixed(0)}M MT`
                          : `${impact.energy} MT`}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Location</span>
                      <p className="text-green-400 font-bold">{impact.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{impact.effect}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentTutorialStep < tutorialSteps.length && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-2xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-blue-400" />
                  <span className="text-sm text-gray-400">
                    Step {currentTutorialStep + 1} of {tutorialSteps.length}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentTutorialStep(tutorialSteps.length)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                {tutorialSteps[currentTutorialStep].title}
              </h2>
              <p className="text-gray-300 mb-6">
                {tutorialSteps[currentTutorialStep].content}
              </p>

              <div className="flex gap-3">
                {currentTutorialStep > 0 && (
                  <button
                    onClick={() => setCurrentTutorialStep(currentTutorialStep - 1)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={() => setCurrentTutorialStep(currentTutorialStep + 1)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  {currentTutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
