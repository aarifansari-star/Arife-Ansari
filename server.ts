import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { getAllDbProjects, addDbProject, updateDbProject, deleteDbProject } from './src/db/projects.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Public API: get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await getAllDbProjects();
      res.json(projects);
    } catch (error: any) {
      console.error("Failed to fetch projects:", error);
      res.status(500).json({ error: error.message || "Failed to fetch projects" });
    }
  });

  // Secure API: Login/Sync user
  app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user || req.user.email !== 'arifeali5566@gmail.com') return res.status(403).json({ error: "Forbidden: Not the owner" });
      const user = await getOrCreateUser(req.user.uid, req.user.email || '');
      res.json(user);
    } catch (error: any) {
      console.error("Failed to sync user:", error);
      res.status(500).json({ error: error.message || "Failed to sync user" });
    }
  });

  // Secure API: add project
  app.post("/api/projects", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user || req.user.email !== 'arifeali5566@gmail.com') return res.status(403).json({ error: "Forbidden: Not the owner" });
      const user = await getOrCreateUser(req.user.uid, req.user.email || '');
      const newProject = await addDbProject(user.id, req.body);
      res.json(newProject);
    } catch (error: any) {
      console.error("Failed to add project:", error);
      res.status(500).json({ error: error.message || "Failed to add project" });
    }
  });

  // Secure API: edit project
  app.put("/api/projects/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user || req.user.email !== 'arifeali5566@gmail.com') return res.status(403).json({ error: "Forbidden: Not the owner" });
      const updatedProject = await updateDbProject(parseInt(req.params.id), req.body);
      res.json(updatedProject);
    } catch (error: any) {
      console.error("Failed to update project:", error);
      res.status(500).json({ error: error.message || "Failed to update project" });
    }
  });

  // Secure API: delete project
  app.delete("/api/projects/:id", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user || req.user.email !== 'arifeali5566@gmail.com') return res.status(403).json({ error: "Forbidden: Not the owner" });
      await deleteDbProject(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      console.error("Failed to delete project:", error);
      res.status(500).json({ error: error.message || "Failed to delete project" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
