import { Gamepad2, Settings } from 'lucide-react';

interface HeaderProps {
  onAdminToggle: () => void;
  isAdmin: boolean;
}

export function Header({ onAdminToggle, isAdmin }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-[#0f172a]/80 border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            ARIFE <span className="text-indigo-400">GAME HUB</span>
          </h1>
        </div>
        
        <button 
          onClick={onAdminToggle}
          className={`p-2 rounded-full transition-colors ${
            isAdmin ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Admin Panel"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
