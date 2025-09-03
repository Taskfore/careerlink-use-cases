from fastapi import APIRouter, Depends, HTTPException, status
from ..schemas.user import UserResponse, UserUpdate
from ..services import user as user_service
from ..services.auth import get_current_active_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserResponse)
async def read_current_user(
    current_user: dict = Depends(get_current_active_user)
):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_active_user),
):
    return await user_service.update_user(
        user_id=current_user["id"],
        user=user_update,
        current_user_id=current_user["id"]
    )

@router.get("/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: str,
    current_user: dict = Depends(get_current_active_user),
):
    if user_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this user"
        )
    user = await user_service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
