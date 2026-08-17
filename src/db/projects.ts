import { db } from './index.ts';
import { projects } from './schema.ts';
import { eq } from 'drizzle-orm';
import { Project } from '../types.ts';

export async function getAllDbProjects() {
  try {
    return await db.select().from(projects);
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Failed to load projects from cloud database.", { cause: error });
  }
}

export async function addDbProject(userId: number, projectData: Omit<Project, 'id' | 'createdAt' | 'visible'>) {
  try {
    const result = await db.insert(projects).values({
      userId,
      name: projectData.name,
      description: projectData.description,
      category: projectData.category,
      image: projectData.image,
      url: projectData.url,
      isNew: projectData.isNew,
      visible: true,
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to add project:", error);
    throw new Error("Failed to add project to cloud database.", { cause: error });
  }
}

export async function updateDbProject(projectId: number, projectData: Partial<Project>) {
  try {
    const { id, ...dataToUpdate } = projectData; // Don't update id
    const result = await db.update(projects)
      .set(dataToUpdate as any)
      .where(eq(projects.id, projectId))
      .returning();
    return result[0];
  } catch (error) {
    console.error("Failed to update project:", error);
    throw new Error("Failed to update project in cloud database.", { cause: error });
  }
}

export async function deleteDbProject(projectId: number) {
  try {
    await db.delete(projects).where(eq(projects.id, projectId));
  } catch (error) {
    console.error("Failed to delete project:", error);
    throw new Error("Failed to delete project from cloud database.", { cause: error });
  }
}
