// src/utils/api.ts
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem('access_token')

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Optional: handle 401 and refresh if needed
  return response
}
