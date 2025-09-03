from typing import Generator
from supabase import create_client, Client
from .config import settings


def _create_client() -> Client:
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_KEY must be set in your environment (.env)"
        )
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


# Global Supabase client
supabase: Client = _create_client()


def get_db() -> Generator[Client, None, None]:
    # Simple dependency to provide the supabase client
    yield supabase
