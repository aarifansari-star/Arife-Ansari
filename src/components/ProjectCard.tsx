import { Play, Globe, Sparkles } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const isGame = project.category === 'Games';
  
  return (
    <div 
      className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:shadow-indigo-500/10 cursor-pointer flex flex-col h-full"
      onClick={() => onClick(project)}
    >
      <div className="relative aspect-video overflow-hidden bg-slate-800">
        <img 
          src={project.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop'} 
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80" />
        
        {project.isNew && (
          <div className="absolute top-3 left-3 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Sparkles className="w-3 h-3" />
            NEW
          </div>
        )}
        
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-slate-300 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700/50">
          {project.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors line-clamp-1">
          {project.name}
        </h3>
        <p className="text-sm text-slate-400 mb-6 line-clamp-2 flex-grow">
          {project.description}
        </p>
        
        <button 
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            isGame 
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (project.url) {
              window.open(project.url, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          {project.url ? (
            <>
              {isGame ? <Play className="w-4 h-4 fill-current" /> : <Globe className="w-4 h-4" />}
              {isGame ? 'PLAY NOW' : 'OPEN WEBSITE'}
            </>
          ) : (
            'COMING SOON'
          )}
        </button>
      </div>
    </div>
  );
}
