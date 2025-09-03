import { Event } from "@/lib/types";

export interface ApiResponse<T> {
  data?: T | null;
  error?: string;
  status?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// Get headers with auth token
const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return {
      error: error.detail || error.message || "An error occurred",
    };
  }
  const data = await response.json();
  return { data };
}

export const eventService = {
  // Get all events
  async getEvents(): Promise<ApiResponse<Event[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      return handleResponse<Event[]>(response);
    } catch (error) {
      return { error: "Failed to fetch events. Please check your connection." };
    }
  },

  // Get single event by ID
  async getEvent(id: string): Promise<ApiResponse<Event>> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      return handleResponse<Event>(response);
    } catch (error) {
      return { error: "Failed to fetch event details." };
    }
  },

  // Create new event
  async createEvent(
    eventData: Omit<Event, "id" | "created_at" | "updated_at">
  ): Promise<ApiResponse<Event>> {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(eventData),
      });
      return handleResponse<Event>(response);
    } catch (error) {
      return { error: "Failed to create event." };
    }
  },

  // Update event
  async updateEvent(
    id: string,
    eventData: Partial<Event>
  ): Promise<ApiResponse<Event>> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(eventData),
      });
      return handleResponse<Event>(response);
    } catch (error) {
      return { error: "Failed to update event." };
    }
  },

  // Delete event
  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return { error: error.detail || "Failed to delete event" };
      }
      return {};
    } catch (error) {
      return { error: "Failed to delete event." };
    }
  },

  // RSVP to an event
  async rsvpToEvent(
    eventId: string,
    status: "going" | "not_going" | "maybe"
  ): Promise<ApiResponse<{ rsvpId: string; status: string }>> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${eventId}/rsvp`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          error: errorData.message || "Failed to update RSVP status",
          status: response.status 
        };
      }

      return handleResponse<{ rsvpId: string; status: string }>(response);
    } catch (error) {
      console.error('RSVP Error:', error);
      return { 
        error: error instanceof Error ? error.message : "Failed to update RSVP status" 
      };
    }
  },

  // Get user's RSVP status for an event
  async getUserRsvp(eventId: string): Promise<ApiResponse<{ 
    id: string;
    status: string;
    event_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/rsvps/event/${eventId}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (response.status === 404) {
        return { data: null, status: 404 };
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          error: errorData.message || "Failed to fetch RSVP status",
          status: response.status 
        };
      }

      return handleResponse<{
        id: string;
        status: string;
        event_id: string;
        user_id: string;
        created_at: string;
        updated_at: string;
      }>(response);
    } catch (error) {
      console.error('Get RSVP Error:', error);
      return { 
        error: error instanceof Error ? error.message : "Failed to fetch RSVP status"
      };
    }
  },
};
