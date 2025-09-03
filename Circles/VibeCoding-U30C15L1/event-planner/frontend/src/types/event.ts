export interface BaseEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
  is_public: boolean;
  category: string;
  max_attendees?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

export interface Event extends BaseEvent {
  creator: User | null;
  attendees_count: number;
  current_user_rsvp: RSVP | null;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}


export interface RSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: 'going' | 'not_going' | 'maybe';
  created_at: string;
  updated_at: string;
}
