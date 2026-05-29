const API_BASE_URL = import.meta.env.VITE_API_URL || "";

async function readApiResponse(response) {
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data;
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registerUser(formData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  return readApiResponse(response);
}

export async function loginUser(formData) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  return readApiResponse(response);
}

export async function convertAudio(file, token) {
  const body = new FormData();
  body.append("audioFile", file);

  const response = await fetch(`${API_BASE_URL}/api/speech/convert`, {
    method: "POST",
    headers: authHeaders(token),
    body,
  });

  return readApiResponse(response);
}

export async function getHistory(token) {
  const response = await fetch(`${API_BASE_URL}/api/speech/history`, {
    headers: authHeaders(token),
  });

  return readApiResponse(response);
}

export async function getTranscript(id, token) {
  const response = await fetch(`${API_BASE_URL}/api/speech/${id}`, {
    headers: authHeaders(token),
  });

  return readApiResponse(response);
}
