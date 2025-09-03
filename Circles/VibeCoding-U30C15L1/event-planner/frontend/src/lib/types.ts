export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  image_url?: string;
  capacity?: number;
  is_public: boolean;
  created_by: string; // User ID
  created_at: string;
  updated_at: string;
  // Optional relations
  user?: User; // User who created the event
  rsvps?: RSVP[]; // List of RSVPs for this event
}

export interface RSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: "going" | "maybe" | "not_going";
  created_at: string;
  updated_at: string;
  // Optional relations
  user?: User; // User who made the RSVP
  event?: Event; // Event this RSVP is for
}

// Response types for API calls
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    status?: number;
  };
}

// Type for creating a new event
export type CreateEventInput = Pick<Event, 'title' | 'description' | 'location' | 'start_time' | 'end_time' | 'is_public'> & {
  image_url?: string;
  capacity?: number;
};

// Type for updating an event
export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string;
}

// Type for RSVP status update
export type RSVPStatus = 'going' | 'maybe' | 'not_going';

export interface UpdateRSVPInput {
  eventId: string;
  status: 'going' | 'maybe' | 'not_going';
}
