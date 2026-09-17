from pydantic import BaseModel
from typing import Optional


# -------------------------
# User
# -------------------------

class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "admin"


class UserResponse(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True


# -------------------------
# Asset
# -------------------------

class AssetCreate(BaseModel):
    asset_id: Optional[str] = None
    name: str
    type: str
    status: str = "Active"
    location: Optional[str] = None


class AssetResponse(BaseModel):
    id: int
    asset_id: str
    name: str
    type: str
    status: str
    location: Optional[str] = None

    class Config:
        from_attributes = True


# -------------------------
# Ticket
# -------------------------

class TicketCreate(BaseModel):
    ticket_id: str
    title: str
    description: Optional[str] = None
    priority: str = "Medium"
    status: str = "Open"


class TicketResponse(BaseModel):
    id: int
    ticket_id: str
    title: str
    description: Optional[str] = None
    priority: str
    status: str

    class Config:
        from_attributes = True