from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routes import auth_router, users_router, events_router, rsvps_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API for managing community events",
)

# CORS (dev-friendly)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers (they already include their own prefixes)
app.include_router(auth_router, prefix=settings.API_V1_STR, tags=["Auth"])
app.include_router(users_router, prefix=settings.API_V1_STR, tags=["Users"])
app.include_router(events_router, prefix=settings.API_V1_STR, tags=["Events"])
app.include_router(rsvps_router, prefix=settings.API_V1_STR, tags=["RSVPs"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to the Event Planner API",
        "docs": "/docs",
        "redoc": "/redoc",
        "apiBase": settings.API_V1_STR,
    }
