from typing import Optional
from fastapi import Depends, HTTPException, status
from ..database import get_db
from ..schemas.user import UserCreate, UserUpdate, UserInDB
from ..services.auth import get_password_hash


async def create_user(user: UserCreate):
    db = next(get_db())
    # Check if user already exists
    existing = await get_user_by_email(user.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    user_data = user.dict()
    user_data["hashed_password"] = get_password_hash(user.password)
    del user_data["password"]

    result = db.table("users").insert(user_data).execute()
    return result.data[0] if result.data else None


async def get_user(user_id: str):
    db = next(get_db())
    result = db.table("users").select("*").eq("id", user_id).single().execute()
    return result.data if hasattr(result, "data") else None


async def get_user_by_email(email: str):
    db = next(get_db())
    result = db.table("users").select("*").eq("email", email).maybe_single().execute()
    return result.data if hasattr(result, "data") else None


async def update_user(user_id: str, user: UserUpdate, current_user_id: str):
    # Verify user exists and is updating their own profile
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user",
        )

    db = next(get_db())
    update_data = user.dict(exclude_unset=True)

    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))

    if not update_data:
        return await get_user(user_id)

    result = db.table("users").update(update_data).eq("id", user_id).execute()
    return result.data[0] if result.data else None
