from typing import List, Optional
from datetime import datetime
from fastapi import Depends, HTTPException, status
from ..database import get_db
from ..schemas.event import EventCreate, EventUpdate, EventInDB


async def create_event(event: EventCreate, user_id: str):
    db = next(get_db())
    # Use JSON-friendly dump to serialize datetime fields
    event_data = event.model_dump(mode="json")
    event_data["created_by"] = user_id
    result = db.table("events").insert(event_data).execute()
    return result.data[0] if result.data else None


async def get_events(
    skip: int = 0,
    limit: int = 100,
    is_public: Optional[bool] = None,
    user_id: Optional[str] = None,
) -> List[EventInDB]:
    db = next(get_db())
    query = db.table("events").select("*")

    if is_public is not None:
        query = query.eq("is_public", is_public)
    if user_id:
        query = query.or_(f"is_public.eq.true,created_by.eq.{user_id}")

    result = query.range(skip, skip + limit - 1).execute()
    return result.data if result.data else []


async def get_event(event_id: str) -> Optional[EventInDB]:
    db = next(get_db())
    result = db.table("events").select("*").eq("id", event_id).maybe_single().execute()
    return result.data if hasattr(result, "data") else None


async def update_event(
    event_id: str, event: EventUpdate, user_id: str
) -> Optional[EventInDB]:
    db = next(get_db())
    # Verify event exists and user is the creator
    existing = await get_event(event_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Event not found")
    if existing["created_by"] != user_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this event"
        )

    # JSON-friendly dump for partial updates, to serialize datetime fields
    update_data = event.model_dump(exclude_unset=True, mode="json")
    if not update_data:
        return existing

    result = db.table("events").update(update_data).eq("id", event_id).execute()
    return result.data[0] if result.data else None


async def delete_event(event_id: str, user_id: str) -> bool:
    db = next(get_db())
    # Verify event exists and user is the creator
    existing = await get_event(event_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Event not found")
    if existing["created_by"] != user_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this event"
        )

    result = db.table("events").delete().eq("id", event_id).execute()
    return len(result.data) > 0 if result.data else False
