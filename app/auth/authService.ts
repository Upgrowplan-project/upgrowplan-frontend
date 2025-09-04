// app/auth/authService.ts
import axios from "axios";
import { API_BASE } from "./../apiConfig";


export interface JwtResponse {
  token: string;
  email: string;
}

async function handleRequest<T>(promise: Promise<{ data: T }>): Promise<T> {
  try {
    const res = await promise;
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Ошибка запроса");
    }
    throw error;
  }
}

export async function login(email: string, password: string): Promise<JwtResponse> {
  try {
    const res = await handleRequest<JwtResponse>(
      axios.post(`${API_BASE}/auth/login`, { email, password })
    );
    console.log("Login response:", res);
    return res;
  } catch (err: any) {
    console.error("Login error:", err.message || err);
    throw err;
  }
}

export async function registerByEmail(email: string, password: string): Promise<JwtResponse> {
  const payload = { email, password };
  console.log("Register payload:", payload);
  console.log("API_BASE:", API_BASE);

  try {
    const response = await handleRequest<JwtResponse>(
      axios.post(`${API_BASE}/auth/register`, payload)
    );
    console.log("Register response:", response);
    return response;
  } catch (error: any) {
    console.error("Register error:", error?.response?.data || error.message); 
    throw error;
  }
}



export async function registerByPhone(phone: string, password: string) {
  return handleRequest(
    axios.post(`${API_BASE}/auth/register-phone`, { phone, password })
  );
}

/*export async function verifyEmailCode(email: string, code: string) {
  return handleRequest(
    axios.post(`${API_BASE}/auth/verify-email`, { email, code })
  );
}*/

/*export async function verifySmsCode(phone: string, code: string) {
  return handleRequest(
    axios.post(`${API_BASE}/auth/verify-phone`, { phone, code })
  );
}

// --- новый метод для отправки email-кода ---
export async function sendEmailCode(email: string) {
  return handleRequest(
    axios.post(`${API_BASE}/auth/send-email-code`, { email })
  );
}*/

// --- методы для работы с профилем пользователя ---
export interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  avatarUrl?: string;
}

export async function getUserProfile(): Promise<UserProfile> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Токен не найден");
  }

  return handleRequest(
    axios.get(`${API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
}




export async function updateUserProfile(profile: Partial<UserProfile>) {
  return handleRequest(axios.put(`${API_BASE}/users/me`, profile));
}

// --- метод для загрузки аватара (эндпоинт пока условный, нужно добавить на бэке) ---
export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);

  return handleRequest(
    axios.post(`${API_BASE}/users/me/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
}
