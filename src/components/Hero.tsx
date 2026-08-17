import { Search } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export function Hero({ searchQuery, onSearchChange }: HeroProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">ARIFE GAME HUB</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Play my games and explore my websites in one place. Discover a collection of fun, interactive projects built for you.
        </p>
        
        <div className="relative max-w-xl mx-auto group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search games or websites..."
            className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-full py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-xl backdrop-blur-sm"
          />
        </div>
      </div>
    </section>
  );
}
