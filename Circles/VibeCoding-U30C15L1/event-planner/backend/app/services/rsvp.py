from typing import List, Optional
from fastapi import Depends, HTTPException, status
from ..database import get_db
from ..services import event as event_service
from ..schemas.rsvp import RSVPUpdate


async def create_rsvp(event_id: str, user_id: str, status_value: str = "maybe"):
    db = next(get_db())
    # Check if RSVP already exists
    existing = await get_user_rsvp_for_event(event_id, user_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already RSVP'd to this event",
        )
    rsvp_data = {"event_id": event_id, "status": status_value, "user_id": user_id}
    result = db.table("rsvps").insert(rsvp_data).execute()
    return result.data[0] if result.data else None


async def update_rsvp(rsvp_id: str, rsvp_data: RSVPUpdate, user_id: str):
    db = next(get_db())
    # Verify RSVP exists and belongs to user
    existing = await get_rsvp(rsvp_id)
    if not existing:
        raise HTTPException(status_code=404, detail="RSVP not found")
    if existing["user_id"] != user_id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this RSVP"
        )

    # Serialize/clean update payload
    update_data = rsvp_data.model_dump(exclude_unset=True)
    if not update_data:
        return existing

    result = db.table("rsvps").update(update_data).eq("id", rsvp_id).execute()
    return result.data[0] if result.data else None


async def get_rsvp(rsvp_id: str):
    db = next(get_db())
    result = db.table("rsvps").select("*").eq("id", rsvp_id).maybe_single().execute()
    return result.data if hasattr(result, "data") else None


async def get_user_rsvp_for_event(event_id: str, user_id: str):
    db = next(get_db())
    result = (
        db.table("rsvps")
        .select("*")
        .eq("event_id", event_id)
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    return result.data if hasattr(result, "data") else None


async def get_event_rsvps(event_id: str, status: Optional[str] = None):
    db = next(get_db())
    query = db.table("rsvps").select("*, user:users(*)").eq("event_id", event_id)
    if status:
        query = query.eq("status", status)
    result = query.execute()
    return result.data if result.data else []


async def get_user_rsvps(user_id: str):
    db = next(get_db())
    result = (
        db.table("rsvps")
        .select("*, event:events(*, creator:users!events_created_by_fkey(*))")
        .eq("user_id", user_id)
        .execute()
    )
    return result.data if result.data else []
