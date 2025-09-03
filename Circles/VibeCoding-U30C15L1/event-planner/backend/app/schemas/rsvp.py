from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal
from .user import UserResponse
from .event import EventResponse


class RSVPBase(BaseModel):
    status: Literal['going', 'not_going', 'maybe']


class RSVPCreate(BaseModel):
    event_id: str
    status: Optional[Literal['going', 'not_going', 'maybe']] = 'maybe'


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
