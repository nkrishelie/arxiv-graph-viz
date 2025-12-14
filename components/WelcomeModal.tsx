import React, { useState } from 'react';

interface WelcomeModalProps {
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to ArXiv Universe",
      content: "This is an interactive 3D visualization of scientific papers and their connections. Every node is a category or an article.",
    },
    {
      title: "Navigation",
      content: "• Left Click: Rotate camera\n• Right Click: Pan (move)\n• Scroll: Zoom in/out\n• Click on Node: View details",
    },
    {
      title: "Colors & Structure",
      content: "• Big Spheres: Scientific Categories (Math, CS, Physics)\n• Small Dots: Individual Articles\n• Links: Citations and Authorship",
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-blue-500/30 text-white p-8 rounded-2xl max-w-lg w-full shadow-2xl relative">
        
        {/* Кнопка закрытия (крестик) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Контент слайда */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-blue-100">{steps[step].title}</h2>
          <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
            {steps[step].content}
          </p>
        </div>

        {/* Кнопки навигации */}
        <div className="flex justify-between items-center mt-8">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 w-2 rounded-full transition-colors ${i === step ? 'bg-blue-500' : 'bg-gray-700'}`}
              />
            ))}
          </div>
          
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            {step === steps.length - 1 ? "Start Exploring" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};
