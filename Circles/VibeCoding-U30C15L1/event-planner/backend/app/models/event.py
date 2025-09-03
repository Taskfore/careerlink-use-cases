from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from .user import UserResponse

class EventBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = None
    location: Optional[str] = None
    start_time: datetime
    end_time: datetime
    is_public: bool = True
    category: Optional[str] = None
    max_attendees: Optional[int] = None

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    title: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class EventInDB(EventBase):
    id: str
    created_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class EventResponse(EventInDB):
    creator: Optional[UserResponse] = None
    attendees_count: int = 0
    current_user_rsvp: Optional[str] = None
