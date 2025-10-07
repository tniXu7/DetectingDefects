import client from "./client";

export interface DefectCreate {
  title: string;
  description?: string;
  priority?: number;
  project_id: number;
  assigned_to?: number;
}

export interface DefectUpdate {
  status?: string;
  assigned_to?: number;
}

export interface Defect {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: number;
  project_id: number;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

export async function listDefects(status?: string, project_id?: number) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (project_id) params.append('project_id', project_id.toString());
  
  const r = await client.get(`/defects/?${params.toString()}`);
  return r.data;
}

export async function createDefect(defect: DefectCreate) {
  const r = await client.post("/defects/", defect);
  return r.data;
}

export async function updateDefect(id: number, defect: DefectUpdate) {
  const r = await client.put(`/defects/${id}`, defect);
  return r.data;
}
