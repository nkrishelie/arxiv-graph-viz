import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-600 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col relative">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold text-yellow-500 tracking-wider uppercase">
            About ArXiv Universe
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar text-gray-300 space-y-6 leading-relaxed">
          
          {/* Section 1: Intro */}
          <section>
            <h3 className="text-white font-bold text-lg mb-2">What is this?</h3>
            <p>
              This is an interactive 3D visualization of the scientific landscape based on <a href="https://arxiv.org" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">arXiv.org</a> data. 
              It treats scientific disciplines as massive planets and individual papers as satellites connecting them.
            </p>
          </section>

          {/* Section 2: DATA SCOPE (ЭТУ СЕКЦИЮ МЫ ОБНОВИЛИ) */}
          <section className="bg-gray-800/50 p-4 rounded border-l-4 border-yellow-500">
            <h3 className="text-white font-bold text-lg mb-2">⚠️ Data Scope & Visualization</h3>
            
            <div className="mb-4">
                <strong className="text-white text-sm uppercase tracking-wide block mb-1">
                    The Two Numbers Explained:
                </strong>
                <p className="text-sm text-gray-300">
                    You will see a counter like <span className="text-white font-mono">1.3k / 54k Papers</span>.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-400">
                    <li>
                        <span className="text-white">~54k (Total Analyzed):</span> The total number of papers published in the <span className="text-yellow-400">last 365 days</span> that we analyzed to calculate the connection strength between disciplines.
                    </li>
                    <li>
                        <span className="text-white">~1.3k (Displayed):</span> The "Top-15" most significant papers per category that are actually drawn on screen. We limit this number to keep the visualization fast and readable.
                    </li>
                </ul>
            </div>

            <div className="pt-2 border-t border-gray-700/50">
                <p className="text-sm">
                This visualization represents <strong>science through the lens of Mathematics</strong>.
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-gray-400">
                    <li>We exclusively fetch articles with a Mathematical classification or a strong link to Math.</li>
                    <li>Nodes for Physics or CS appear only if they intersect with Mathematics in our dataset.</li>
                </ul>
            </div>
          </section>

          {/* Section 3: Filtering */}
          <section>
            <h3 className="text-white font-bold text-lg mb-2">Filtering Rules</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>
                <span className="text-white font-semibold">Freshness:</span> We analyze only the most recent submissions (last 365 days).
              </li>
              <li>
                <span className="text-white font-semibold">The "Top 15" Limit:</span> Priority is given to <strong>cross-disciplinary papers</strong> (those bridging multiple fields) and the most recently published ones.
              </li>
            </ul>
          </section>

          {/* Section 4: Navigation */}
          <section>
            <h3 className="text-white font-bold text-lg mb-2">How to Navigate</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                <strong className="block text-white mb-1">Desktop</strong>
                <ul className="list-disc pl-4 space-y-1">
                  <li><span className="text-yellow-500">Left Click + Drag:</span> Rotate camera</li>
                  <li><span className="text-yellow-500">Right Click + Drag:</span> Pan camera</li>
                  <li><span className="text-yellow-500">Scroll:</span> Zoom In / Out</li>
                  <li><span className="text-yellow-500">Click Node:</span> View details</li>
                </ul>
              </div>
              <div className="bg-gray-800/50 p-3 rounded border border-gray-700">
                <strong className="block text-white mb-1">Touch / Mobile</strong>
                <ul className="list-disc pl-4 space-y-1">
                  <li><span className="text-yellow-500">One Finger:</span> Rotate</li>
                  <li><span className="text-yellow-500">Two Fingers:</span> Zoom & Pan</li>
                  <li><span className="text-yellow-500">Tap:</span> Select node</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5: Legend */}
          <section>
            <h3 className="text-white font-bold text-lg mb-2">Visual Legend</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_5px_currentColor]"></span>
                <span><strong>Large Spheres:</strong> Scientific Disciplines. Size represents the number of connections (centrality).</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-gray-500 opacity-60"></span>
                <span><strong>Small Dots:</strong> Individual Papers.</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-1 bg-gradient-to-r from-gray-700 to-white rounded"></span>
                <span><strong>Moving Particles:</strong> Represent the "flow" of shared articles between disciplines. Faster flow = Stronger connection.</span>
              </li>
            </ul>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/30 rounded-b-xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
