from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(50), default="admin")


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String(50), unique=True, nullable=False)
    name = Column(String(150), nullable=False)
    type = Column(String(100), nullable=False)
    status = Column(String(50), default="Active")
    location = Column(String(150), nullable=True)
    created_at = Column(DateTime, server_default=func.now())


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String(50), unique=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(50), default="Medium")
    status = Column(String(50), default="Open")
    created_at = Column(DateTime, server_default=func.now())


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=True)
    action = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())