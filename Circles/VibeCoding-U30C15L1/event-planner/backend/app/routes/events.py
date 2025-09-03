from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from ..schemas.event import EventCreate, EventUpdate, EventResponse
from ..services import event as event_service
from ..services.auth import get_current_active_user

router = APIRouter(prefix="/events", tags=["events"])


@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    event: EventCreate,
    current_user: dict = Depends(get_current_active_user),
):
    return await event_service.create_event(event, current_user["id"])


@router.get("/", response_model=List[EventResponse])
async def list_events(
    skip: int = 0,
    limit: int = 100,
    is_public: Optional[bool] = None,
    current_user: dict = Depends(get_current_active_user),
):
    return await event_service.get_events(
        skip=skip, limit=limit, is_public=is_public, user_id=current_user["id"]
    )


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    event = await event_service.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if not event["is_public"] and event["created_by"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to view this event")
    return event


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: str,
    event: EventUpdate,
    current_user: dict = Depends(get_current_active_user),
):
    return await event_service.update_event(event_id, event, current_user["id"])


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    success = await event_service.delete_event(event_id, current_user["id"])
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    return None
