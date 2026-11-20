const BASE_URL = `${import.meta.env.VITE_Backend_URL}/api`;

function getToken() {
  return localStorage.getItem("licenseiq_token");
}

async function request(method, path, body = null, responseType = "json") {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
  } catch {
    const err = new Error("Unable to connect to server.");
    err.isNetworkError = true;
    throw err;
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    const text = await res.text().catch(() => "");
    if (text) {
      try {
        const payload = JSON.parse(text);
        message = payload.error || payload.message || message;
      } catch {
        message = text;
      }
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  // 204 No Content
  if (res.status === 204) return null;
  if (responseType === "blob") {
    return { data: await res.blob(), headers: res.headers };
  }
  return res.json();
}

export const get    = (path, responseType = "json") => request("GET", path, null, responseType);
export const post   = (path, body)   => request("POST",   path, body);
export const put    = (path, body)   => request("PUT",    path, body);
export const patch  = (path, body)   => request("PATCH",  path, body);
export const del    = (path)         => request("DELETE", path);
