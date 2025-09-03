from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .user import UserResponse
from .event import EventResponse

class RSVPBase(BaseModel):
    status: str

class RSVPCreate(RSVPBase):
    event_id: str

class RSVPUpdate(RSVPBase):
    pass

class RSVPInDB(RSVPBase):
    id: str
    user_id: str
    event_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class RSVPResponse(RSVPInDB):
    user: Optional[UserResponse] = None
    event: Optional[EventResponse] = None
