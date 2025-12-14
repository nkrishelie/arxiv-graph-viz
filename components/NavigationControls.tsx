import React from 'react';

interface Props {
  onRotate: (h: number, v: number) => void; // h - горизонталь, v - вертикаль
  onZoom: (dir: number) => void;            // +1 или -1
  onReset: () => void;
}

export const NavigationControls: React.FC<Props> = ({ onRotate, onZoom, onReset }) => {
  const btnClass = "w-10 h-10 flex items-center justify-center bg-slate-800/80 hover:bg-blue-600 border border-slate-600 rounded text-white transition-colors backdrop-blur-md active:scale-95 select-none";

  return (
    //<div className="absolute bottom-6 left-6 z-20 flex flex-col gap-4 pointer-events-auto">
    <div className="absolute bottom-6 left-6 z-20 hidden md:flex flex-col gap-4 pointer-events-auto">      
      
      {/* Блок вращения (Джойстик) */}
      <div className="relative w-32 h-32">
        {/* Вверх */}
        <button 
          className={`${btnClass} absolute top-0 left-1/2 -translate-x-1/2 rounded-t-lg`}
          onClick={() => onRotate(0, -1)}
          title="Rotate Up"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        </button>

        {/* Вниз */}
        <button 
          className={`${btnClass} absolute bottom-0 left-1/2 -translate-x-1/2 rounded-b-lg`}
          onClick={() => onRotate(0, 1)}
          title="Rotate Down"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </button>

        {/* Влево */}
        <button 
          className={`${btnClass} absolute left-0 top-1/2 -translate-y-1/2 rounded-l-lg`}
          onClick={() => onRotate(1, 0)} // Вращаем камеру влево = сцена вправо
          title="Rotate Left"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>

        {/* Вправо */}
        <button 
          className={`${btnClass} absolute right-0 top-1/2 -translate-y-1/2 rounded-r-lg`}
          onClick={() => onRotate(-1, 0)}
          title="Rotate Right"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>

        {/* Центр (Сброс) */}
        <button 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-slate-700 hover:bg-red-500 rounded-full border border-slate-500 text-white shadow-lg transition-all active:scale-90 flex items-center justify-center"
          onClick={onReset}
          title="Reset Camera"
        >
          <span className="text-xs font-bold">●</span>
        </button>
      </div>

      {/* Блок Зума */}
      <div className="flex flex-col gap-1 items-center">
        <button className={btnClass} onClick={() => onZoom(-1)} title="Zoom In">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button className={btnClass} onClick={() => onZoom(1)} title="Zoom Out">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>

    </div>
  );
};
