import { X, Play, Globe, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import { useEffect } from 'react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [project]);

  if (!project) return null;

  const isGame = project.category === 'Games';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-slate-900/50 hover:bg-slate-800 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-full aspect-video relative bg-slate-800 shrink-0">
          <img 
            src={project.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop'} 
            alt={project.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-90" />
        </div>
        
        <div className="p-6 md:p-8 flex-grow overflow-y-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-slate-800 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full border border-slate-700">
              {project.category}
            </span>
            {project.isNew && (
              <span className="text-indigo-400 text-xs font-bold tracking-wider">
                NEW RELEASE
              </span>
            )}
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {project.name}
          </h2>
          
          <p className="text-slate-300 leading-relaxed mb-8">
            {project.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button 
              className={`flex-1 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                project.url 
                  ? isGame 
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
              onClick={() => {
                if (project.url) {
                  window.open(project.url, '_blank', 'noopener,noreferrer');
                }
              }}
              disabled={!project.url}
            >
              {project.url ? (
                <>
                  {isGame ? <Play className="w-5 h-5 fill-current" /> : <Globe className="w-5 h-5" />}
                  {isGame ? 'PLAY NOW' : 'OPEN WEBSITE'}
                </>
              ) : (
                'COMING SOON'
              )}
            </button>
            
            {project.url && (
              <button 
                className="px-6 py-4 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(project.url);
                  alert('Link copied to clipboard!');
                }}
              >
                <ExternalLink className="w-5 h-5" />
                Copy Link
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
