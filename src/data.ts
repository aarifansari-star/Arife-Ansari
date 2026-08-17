import { Project } from './types';
import { getAllProjects, saveProjectDB } from './lib/db';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Ludo Max',
    description: 'Play my online Ludo game with friends and family. Roll the dice and race to the finish!',
    category: 'Games',
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffaed?q=80&w=2071&auto=format&fit=crop',
    url: 'https://example.com/ludo', // Replace with real URL
    isNew: true,
    visible: true,
  },
  {
    id: '2',
    name: 'Endless Runner',
    description: 'A fast-paced endless runner. Dodge obstacles and get the highest score!',
    category: 'Games',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
    url: 'https://example.com/runner', // Replace with real URL
    isNew: false,
    visible: true,
  },
  {
    id: '3',
    name: 'My Website',
    description: 'Check out my portfolio, blog posts, and other cool stuff I build.',
    category: 'Websites',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
    url: 'https://example.com/my-website', // Replace with real URL
    isNew: true,
    visible: true,
  }
];

export async function loadProjects(): Promise<Project[]> {
  try {
    const stored = await getAllProjects();
    if (stored && stored.length > 0) {
      // Ensure visible field exists on legacy data
      return stored.map(p => ({ ...p, visible: p.visible ?? true }));
    }
  } catch (e) {
    console.error('Failed to load projects from IndexedDB', e);
  }
  
  // Initialize with samples if empty
  for (const p of INITIAL_PROJECTS) {
    try {
      await saveProjectDB(p);
    } catch (e) {
      console.error('Failed to save initial project to IndexedDB', e);
    }
  }
  return INITIAL_PROJECTS;
}
