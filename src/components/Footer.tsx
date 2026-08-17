import { Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between max-w-7xl">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h3 className="text-xl font-bold tracking-tight text-white mb-2">
            ARIFE <span className="text-indigo-400">GAME HUB</span>
          </h3>
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} ARIFE GAME HUB. All Rights Reserved.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-500 hover:text-white transition-all">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-500 hover:text-white transition-all">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="mailto:arifeali5566@gmail.com" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-500 hover:text-white transition-all">
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
