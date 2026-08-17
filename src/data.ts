import { Project } from './types';
import { getAllProjects } from './lib/db';

export async function loadProjects(): Promise<Project[]> {
  try {
    const stored = await getAllProjects();
    return stored.map(p => ({ ...p, visible: p.visible ?? true }));
  } catch (e) {
    console.error('Failed to load projects from IndexedDB', e);
    return [];
  }
}
