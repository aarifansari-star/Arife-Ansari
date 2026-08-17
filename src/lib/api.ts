import { Project } from '../types';
import { auth, storage } from './firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const getHeaders = async () => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (auth && auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function syncUser() {
  const res = await fetch('/api/auth/sync', {
    method: 'POST',
    headers: await getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to sync user');
  return res.json();
}

export async function saveProject(project: Project): Promise<Project> {
  let imageUrl = project.image;

  // Upload image if it's a new data URL and storage is available
  if (imageUrl.startsWith('data:image') && storage) {
    try {
      const imageRef = ref(storage, `projects/${Date.now()}_${Math.random().toString(36).substring(7)}`);
      
      // Prevent hanging by wrapping in a Promise.race with a timeout
      await Promise.race([
        uploadString(imageRef, imageUrl, 'data_url'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Image upload timed out')), 5000))
      ]);
      
      imageUrl = await getDownloadURL(imageRef);
    } catch (uploadError) {
      console.warn("Failed to upload image to cloud storage. Proceeding with base64 string.", uploadError);
      // Keep the original data URL
    }
  }

  const projectData = { ...project, image: imageUrl };

  // Note: For simplicity, we use PUT for existing projects if they are numeric IDs
  const isEditing = project.id !== 'new';
  
  if (isEditing) {
    const res = await fetch(`/api/projects/${project.id}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(projectData),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  } else {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(projectData),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  }
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, {
    method: 'DELETE',
    headers: await getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete project');
}

export async function deleteAllProjects(): Promise<void> {
  const projects = await fetchProjects();
  for (const p of projects) {
    await deleteProject(p.id.toString());
  }
}

