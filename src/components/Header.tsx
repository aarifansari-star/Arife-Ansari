import { Gamepad2, LogOut } from 'lucide-react';
import { useRef } from 'react';

interface HeaderProps {
  isOwnerMode: boolean;
  onExitOwnerMode: () => void;
  onActivateOwnerMode: () => void;
}

export function Header({ isOwnerMode, onExitOwnerMode, onActivateOwnerMode }: HeaderProps) {
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  const handleLogoClick = () => {
    const now = Date.now();
    // Reset if more than 1.5 seconds have passed since the last click
    if (now - lastClickTimeRef.current > 1500) {
      clickCountRef.current = 0;
    }
    
    clickCountRef.current += 1;
    lastClickTimeRef.current = now;

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      if (!isOwnerMode) {
        onActivateOwnerMode();
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-[#0f172a]/80 border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <div 
          className="flex items-center gap-3 select-none" 
          onClick={handleLogoClick}
          // Do not add cursor-pointer to keep it hidden
        >
          <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            ARIFE <span className="text-indigo-400">GAME HUB</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {isOwnerMode && (
            <button
              onClick={onExitOwnerMode}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg font-medium transition-colors flex items-center gap-2 border border-red-500/20"
              title="Exit Owner Mode"
            >
              <LogOut className="w-4 h-4" /> Exit Owner Mode
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

