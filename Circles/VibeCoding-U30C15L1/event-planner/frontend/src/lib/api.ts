import { EventCreate, EventUpdate } from '@/types/events';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = {
  // Auth endpoints
  login: (email: string, password: string) => 
    fetch(`${API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
      credentials: 'include',
    }).then(handleResponse),

  register: (email: string, password: string, full_name: string) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name }),
      credentials: 'include',
    }).then(handleResponse),

  // Event endpoints
  getEvents: (token: string) =>
    fetchWithAuth(`${API_BASE_URL}/events`, token),

  getEvent: (id: string, token: string) =>
    fetchWithAuth(`${API_BASE_URL}/events/${id}`, token),

  createEvent: (event: EventCreate, token: string) =>
    fetchWithAuth(`${API_BASE_URL}/events`, token, 'POST', event),

  updateEvent: (id: string, event: EventUpdate, token: string) =>
    fetchWithAuth(`${API_BASE_URL}/events/${id}`, token, 'PUT', event),

  deleteEvent: (id: string, token: string) =>
    fetchWithAuth(`${API_BASE_URL}/events/${id}`, token, 'DELETE'),

  // RSVP endpoints
  createRSVP: (eventId: string, status: string, token: string) =>
    fetchWithAuth(`${API_BASE_URL}/rsvps`, token, 'POST', { event_id: eventId, status }),

  updateRSVP: (rsvpId: string, status: string, token: string) =>
    fetchWithAuth(`${API_BASE_URL}/rsvps/${rsvpId}`, token, 'PUT', { status }),

  getEventRSVPs: (eventId: string, token: string) =>
    fetchWithAuth(`${API_BASE_URL}/rsvps/event/${eventId}`, token),

  getMyRSVPs: (token: string) =>
    fetchWithAuth(`${API_BASE_URL}/rsvps/user/me`, token),
};

// Helper functions
async function fetchWithAuth<T = unknown>(url: string, token: string, method: string = 'GET', body?: T) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options).then(handleResponse);
}

async function handleResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = (data && data.detail) || response.statusText;
    return Promise.reject(error);
  }

  return data;
}

export default api;
