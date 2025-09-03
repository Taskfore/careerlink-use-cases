export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EventBase {
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  is_public: boolean;
  max_attendees?: number;
  image_url?: string;
}

export interface EventCreate
  extends Omit<EventBase, "start_time" | "end_time"> {
  start_time: Date | string;
  end_time: Date | string;
}

export type EventUpdate = Partial<EventCreate>;

export interface Event extends EventBase {
  id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  user?: User;
  rsvp_count?: number;
  user_rsvp?: RSVP;
}

export interface RSVPBase {
  status: "going" | "not_going" | "maybe";
}

export interface RSVPCreate {
  event_id: string;
  status?: "going" | "not_going" | "maybe";
}

export interface RSVPUpdate {
  status: "going" | "not_going" | "maybe";
}

export interface RSVP extends RSVPBase {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
  updated_at: string;
  user?: User;
  event?: Event;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  status: number;
}
