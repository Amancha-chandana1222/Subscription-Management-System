const BASE_URL = "http://localhost:8080/api";

function getToken() {
  return localStorage.getItem("licenseiq_token");
}

async function request(method, path, body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
}

export const get    = (path)         => request("GET",    path);
export const post   = (path, body)   => request("POST",   path, body);
export const put    = (path, body)   => request("PUT",    path, body);
export const patch  = (path, body)   => request("PATCH",  path, body);
export const del    = (path)         => request("DELETE", path);
