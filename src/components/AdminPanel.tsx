import { useState, useRef } from 'react';
import { Project, Category } from '../types';
import { Trash2, Edit2, Plus, Save, X, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

interface AdminPanelProps {
  projects: Project[];
  onSaveProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onClose: () => void;
}

export function AdminPanel({ projects, onSaveProject, onDeleteProject, onClose }: AdminPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Games');
  const [image, setImage] = useState('');
  const [url, setUrl] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [visible, setVisible] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setName(project.name);
    setDescription(project.description);
    setCategory(project.category);
    setImage(project.image);
    setUrl(project.url);
    setIsNew(project.isNew);
    setVisible(project.visible ?? true);
  };

  const startNew = () => {
    setEditingId('new');
    setName('');
    setDescription('');
    setCategory('Games');
    setImage('');
    setUrl('');
    setIsNew(true);
    setVisible(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image (JPG, PNG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL(file.type, 0.8);
        setImage(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Project name is required');
      return;
    }
    
    const project: Project = {
      id: editingId === 'new' ? Date.now().toString() : editingId!,
      name,
      description,
      category,
      image,
      url,
      isNew,
      visible,
    };
    
    onSaveProject(project);
    setEditingId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
          <p className="text-slate-400">Manage your game hub projects.</p>
        </div>
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
        >
          Back to Hub
        </button>
      </div>

      {editingId ? (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingId === 'new' ? 'Add New Project' : 'Edit Project'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Project Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="e.g. Space Shooter"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="Games">Games</option>
                  <option value="Websites">Websites</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">URL / Link</label>
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Leave empty for 'Coming Soon'"
                />
              </div>
              
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="isNew"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 bg-slate-950"
                />
                <label htmlFor="isNew" className="text-sm font-medium text-slate-300 select-none">
                  Mark as NEW project
                </label>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="isVisible"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900 bg-slate-950"
                />
                <label htmlFor="isVisible" className="text-sm font-medium text-slate-300 select-none">
                  Project is visible
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Project Image</label>
                <input 
                  type="file" 
                  accept="image/jpeg, image/jpg, image/png, image/webp"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white hover:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none flex items-center gap-2 justify-center transition-colors shadow-sm"
                >
                  <ImageIcon className="w-5 h-5 text-indigo-400" />
                  Choose Image
                </button>
                {image && (
                  <div className="mt-3 relative aspect-video rounded-lg overflow-hidden bg-slate-800 border border-slate-700 group">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop'; }} />
                    <button 
                      onClick={() => setImage('')}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                placeholder="Short description of the project..."
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button 
              onClick={cancelEdit}
              className="px-6 py-2.5 rounded-lg font-medium text-slate-300 hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Save className="w-4 h-4" /> Save Project
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-end">
            <button 
              onClick={startNew}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Plus className="w-5 h-5" /> Add New Project
            </button>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs text-slate-400 uppercase bg-slate-950/50 border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Project</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        No projects found. Add one to get started.
                      </td>
                    </tr>
                  ) : (
                    projects.map((project) => (
                      <tr key={project.id} className={`hover:bg-slate-800/50 transition-colors ${!project.visible ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded overflow-hidden bg-slate-800 shrink-0">
                              <img src={project.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-semibold text-white flex items-center gap-2">
                                {project.name}
                                {!project.visible && <EyeOff className="w-3 h-3 text-slate-500" />}
                              </div>
                              <div className="text-xs text-slate-500 line-clamp-1 max-w-[200px] md:max-w-xs">{project.url || 'No URL'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            {project.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex flex-col gap-1">
                          {project.isNew && (
                            <span className="text-indigo-400 text-xs font-bold">NEW</span>
                          )}
                          {!project.visible && (
                            <span className="text-slate-500 text-xs font-bold">HIDDEN</span>
                          )}
                          {project.visible && !project.isNew && (
                            <span className="text-emerald-400 text-xs font-bold">VISIBLE</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => startEdit(project)}
                              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this project?')) {
                                  onDeleteProject(project.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
