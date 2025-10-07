import client from "./client";

export async function login(username: string, password: string) {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);
  const r = await client.post("/auth/token", form);
  return r.data;
}

export const authApi = {
  getCurrentUser: () => client.get("/users/me"),
};