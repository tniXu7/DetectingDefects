import client from "./client";

export async function exportCSV(projectId?: number) {
  const url = projectId ? `/reports/defects/csv?project_id=${projectId}` : "/reports/defects/csv";
  const r = await client.get(url, { responseType: "blob" });
  return r.data;
}
