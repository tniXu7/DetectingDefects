import client from "./client";

export interface ProjectCreate {
  name: string;
  description?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export async function listProjects() {
  const r = await client.get("/projects/");
  return r.data;
}

export async function createProject(project: ProjectCreate) {
  const r = await client.post("/projects/", project);
  return r.data;
}
