from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from ..schemas.rsvp import RSVPCreate, RSVPUpdate, RSVPResponse
from ..services import rsvp as rsvp_service
from ..services.auth import get_current_active_user
from ..services import event as event_service

router = APIRouter(prefix="/rsvps", tags=["rsvps"])


@router.post("/", response_model=RSVPResponse, status_code=status.HTTP_201_CREATED)
async def create_rsvp(
    rsvp: RSVPCreate,
    current_user: dict = Depends(get_current_active_user),
):
    return await rsvp_service.create_rsvp(rsvp.event_id, current_user["id"], rsvp.status or "maybe")


@router.put("/{rsvp_id}", response_model=RSVPResponse)
async def update_rsvp(
    rsvp_id: str,
    rsvp: RSVPUpdate,
    current_user: dict = Depends(get_current_active_user),
):
    return await rsvp_service.update_rsvp(rsvp_id, rsvp, current_user["id"])


@router.get("/event/{event_id}", response_model=List[RSVPResponse])
async def list_event_rsvps(
    event_id: str,
    status: str = None,
    current_user: dict = Depends(get_current_active_user),
):
    # Verify user has access to the event
    event = await event_service.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if not event["is_public"] and event["created_by"] != current_user["id"]:
        raise HTTPException(
            status_code=403, detail="Not authorized to view RSVPs for this event"
        )

    return await rsvp_service.get_event_rsvps(event_id, status)


@router.get("/user/me", response_model=List[RSVPResponse])
async def list_my_rsvps(
    current_user: dict = Depends(get_current_active_user),
):
    return await rsvp_service.get_user_rsvps(current_user["id"])
