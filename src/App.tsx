import { useState, useEffect, useMemo } from 'react';
import { Project, Category } from './types';
import { fetchProjects, saveProject, deleteProject, deleteAllProjects, syncUser } from './lib/api';
import { signIn } from './lib/firebase';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProjectCard } from './components/ProjectCard';
import { ProjectModal } from './components/ProjectModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

type FilterType = 'All' | Category | 'New';

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data
  useEffect(() => {
    fetchProjects()
      .then(data => {
        setProjects(data);
        setIsLoaded(true);
      })
      .catch(err => {
        console.error("Failed to load projects:", err);
        setProjects([]);
        setIsLoaded(true);
      });
  }, []);

  // Filter projects based on search and category
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Only show visible projects to users (owner panel sees all)
      if (!isOwnerMode && !project.visible) return false;

      // Search filter
      if (searchQuery && !project.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !project.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (activeFilter === 'Games' && project.category !== 'Games') return false;
      if (activeFilter === 'Websites' && project.category !== 'Websites') return false;
      if (activeFilter === 'New' && !project.isNew) return false;
      
      return true;
    });
  }, [projects, searchQuery, activeFilter, isOwnerMode]);

  // Admin handlers
  const handleSaveProject = async (project: Project) => {
    const savedProject = await saveProject(project);
    
    setProjects(prev => {
      const isEditing = prev.some(p => p.id === savedProject.id);
      if (isEditing) {
        return prev.map(p => p.id === savedProject.id ? savedProject : p);
      }
      return [...prev, savedProject];
    });
  };

  const handleDeleteProject = async (id: string | number) => {
    await deleteProject(id.toString());
    setProjects(prev => prev.filter(p => p.id.toString() !== id.toString()));
  };

  const handleDeleteAllProjects = async () => {
    await deleteAllProjects();
    setProjects([]);
  };

  const handleActivateOwnerMode = async () => {
    try {
      await signIn();
      await syncUser();
      setIsOwnerMode(true);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to activate owner mode. You must be an authorized owner.");
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      <Header 
        isOwnerMode={isOwnerMode} 
        onActivateOwnerMode={handleActivateOwnerMode}
        onExitOwnerMode={() => setIsOwnerMode(false)}
      />
      
      <main className="flex-grow">
        {isOwnerMode ? (
          <AdminPanel 
            projects={projects}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
            onDeleteAllProjects={handleDeleteAllProjects}
            onClose={() => setIsOwnerMode(false)}
          />
        ) : (
          <>
            <Hero 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
            
            <section className="container mx-auto px-4 py-8 max-w-7xl">
              {/* Filters */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                {(['All', 'Games', 'Websites', 'New'] as FilterType[]).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                      activeFilter === filter 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105' 
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              
              {/* Grid */}
              {projects.length === 0 ? (
                <div className="text-center py-24 text-slate-500">
                  <h3 className="text-2xl font-bold text-slate-300 mb-4">No projects added yet.</h3>
                  {/* Note: In public view, there is no way to add projects unless they activate Owner mode. We keep this empty state clean. */}
                  <p className="text-lg">Check back soon for new games and websites!</p>
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={setSelectedProject}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 text-slate-500">
                  <p className="text-xl">No projects found matching your criteria.</p>
                  <button 
                    onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                    className="mt-4 text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </main>
      
      <Footer />
      
      <ProjectModal 
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
