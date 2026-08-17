import { useState, useEffect, useMemo } from 'react';
import { Project, Category } from './types';
import { loadProjects } from './data';
import { saveProjectDB, deleteProjectDB, deleteAllProjectsDB } from './lib/db';
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
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data
  useEffect(() => {
    loadProjects().then(data => {
      setProjects(data);
      setIsLoaded(true);
    });
  }, []);

  // Filter projects based on search and category
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Only show visible projects to users (admin panel sees all)
      if (!project.visible) return false;

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
  }, [projects, searchQuery, activeFilter]);

  // Admin handlers
  const handleSaveProject = async (project: Project) => {
    const isEditing = projects.some(p => p.id === project.id);
    let updatedProjects: Project[];
    
    if (isEditing) {
      updatedProjects = projects.map(p => p.id === project.id ? project : p);
    } else {
      updatedProjects = [...projects, project];
    }
    
    setProjects(updatedProjects);
    await saveProjectDB(project);
  };

  const handleDeleteProject = async (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    await deleteProjectDB(id);
  };

  const handleDeleteAllProjects = async () => {
    setProjects([]);
    await deleteAllProjectsDB();
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      <Header 
        isAdmin={isAdminOpen} 
        onAdminToggle={() => setIsAdminOpen(!isAdminOpen)} 
      />
      
      <main className="flex-grow">
        {isAdminOpen ? (
          <AdminPanel 
            projects={projects}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
            onDeleteAllProjects={handleDeleteAllProjects}
            onClose={() => setIsAdminOpen(false)}
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
                  <button 
                    onClick={() => setIsAdminOpen(true)}
                    className="mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors inline-flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    + ADD YOUR FIRST PROJECT
                  </button>
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
