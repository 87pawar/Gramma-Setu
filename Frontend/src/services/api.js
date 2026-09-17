const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5400";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}
export const registerUser = (data) => apiRequest("/api/auth/register", { method: "POST", body: JSON.stringify(data) });
export const loginUser = (data) => apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify(data) });
export const getWorkers = (params = {}) => apiRequest(`/api/workers?${new URLSearchParams(params)}`);
export const getWorker = (id) => apiRequest(`/api/workers/${id}`);
export const createServiceRequest = (data) => apiRequest("/api/service-requests", { method: "POST", body: JSON.stringify(data) });
export const getMyRequests = () => apiRequest("/api/service-requests/my");
export const getWorkerRequests = () => apiRequest("/api/service-requests/worker");
export const updateRequest = (id, action) => apiRequest(`/api/service-requests/${id}/${action}`, { method: "PATCH" });
export const getAdminStats = () => apiRequest("/api/admin/stats");
export default apiRequest;
