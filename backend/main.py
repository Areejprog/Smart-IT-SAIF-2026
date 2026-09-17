from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, SessionLocal, Base
from models import User, Asset, Ticket, ActivityLog

from schemas import (
    UserCreate,
    UserResponse,
    AssetCreate,
    AssetResponse,
    TicketCreate,
    TicketResponse,
)


# -------------------------
# Database
# -------------------------

Base.metadata.create_all(bind=engine)


# -------------------------
# FastAPI Application
# -------------------------

app = FastAPI(
    title="Smart IT API",
    description="Intelligent IT Asset and Ticket Management System",
    version="1.0.0",
)


# -------------------------
# CORS
# -------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Database Dependency
# -------------------------

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# -------------------------
# Root
# -------------------------

@app.get("/")
def root():
    return {
        "message": "Smart IT API is running",
        "status": "online"
    }


# -------------------------
# Users
# -------------------------

@app.post("/users", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    new_user = User(
        username=user.username,
        password=user.password,
        role=user.role,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Activity Log
    log = ActivityLog(
        username=user.username,
        action=f"Created user: {user.username}"
    )

    db.add(log)
    db.commit()

    return new_user


@app.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


# -------------------------
# Assets
# -------------------------
@app.post("/assets", response_model=AssetResponse)
def create_asset(
    asset: AssetCreate,
    db: Session = Depends(get_db)
):

    existing_asset = (
        db.query(Asset)
        .filter(Asset.asset_id == asset.asset_id)
        .first()
    )

    if existing_asset:
        raise HTTPException(
            status_code=400,
            detail="Asset ID already exists"
        )

    new_asset = Asset(
        asset_id=asset.asset_id,
        name=asset.name,
        type=asset.type,
        status=asset.status,
        location=asset.location,
    )

    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)

    # Activity Log
    log = ActivityLog(
        username="System",
        action=f"Created asset: {new_asset.asset_id}"
    )

    db.add(log)
    db.commit()

    return new_asset

@app.get("/assets", response_model=list[AssetResponse])
def get_assets(db: Session = Depends(get_db)):
    return db.query(Asset).all()


@app.put("/assets/{asset_id}", response_model=AssetResponse)
def update_asset(
    asset_id: int,
    asset: AssetCreate,
    db: Session = Depends(get_db)
):

    existing_asset = (
        db.query(Asset)
        .filter(Asset.id == asset_id)
        .first()
    )

    if not existing_asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    existing_asset.asset_id = asset.asset_id
    existing_asset.name = asset.name
    existing_asset.type = asset.type
    existing_asset.status = asset.status
    existing_asset.location = asset.location

    db.commit()
    db.refresh(existing_asset)

    # Activity Log
    log = ActivityLog(
        username="System",
        action=f"Updated asset: {existing_asset.asset_id}"
    )

    db.add(log)
    db.commit()

    return existing_asset


@app.delete("/assets/{asset_id}")
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db)
):

    existing_asset = (
        db.query(Asset)
        .filter(Asset.id == asset_id)
        .first()
    )

    if not existing_asset:
        raise HTTPException(
            status_code=404,
            detail="Asset not found"
        )

    deleted_asset_id = existing_asset.asset_id

    db.delete(existing_asset)
    db.commit()

    # Activity Log
    log = ActivityLog(
        username="System",
        action=f"Deleted asset: {deleted_asset_id}"
    )

    db.add(log)
    db.commit()

    return {
        "message": "Asset deleted successfully"
    }


# -------------------------
# Tickets
# -------------------------

@app.post("/tickets", response_model=TicketResponse)
def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db)
):

    existing_ticket = (
        db.query(Ticket)
        .filter(Ticket.ticket_id == ticket.ticket_id)
        .first()
    )

    if existing_ticket:
        raise HTTPException(
            status_code=400,
            detail="Ticket ID already exists"
        )

    new_ticket = Ticket(
        ticket_id=ticket.ticket_id,
        title=ticket.title,
        description=ticket.description,
        priority=ticket.priority,
        status=ticket.status,
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    # Activity Log
    log = ActivityLog(
        username="System",
        action=f"Created ticket: {new_ticket.ticket_id}"
    )

    db.add(log)
    db.commit()

    return new_ticket


@app.get("/tickets", response_model=list[TicketResponse])
def get_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).all()


@app.delete("/tickets/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):

    existing_ticket = (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )

    if not existing_ticket:
        raise HTTPException(
            status_code=404,
            detail="Ticket not found"
        )

    deleted_ticket_id = existing_ticket.ticket_id

    db.delete(existing_ticket)
    db.commit()

    # Activity Log
    log = ActivityLog(
        username="System",
        action=f"Deleted ticket: {deleted_ticket_id}"
    )

    db.add(log)
    db.commit()

    return {
        "message": "Ticket deleted successfully"
    }


# -------------------------
# Smart Risk Analysis
# -------------------------

@app.get("/risk-analysis")
def risk_analysis(db: Session = Depends(get_db)):

    assets = db.query(Asset).all()
    tickets = db.query(Ticket).all()

    # =========================
    # Asset Analysis
    # =========================

    maintenance_assets = sum(
        1
        for asset in assets
        if asset.status
        and asset.status.strip().lower() == "maintenance"
    )

    out_of_service_assets = sum(
        1
        for asset in assets
        if asset.status
        and asset.status.strip().lower() == "out of service"
    )

    active_assets = sum(
        1
        for asset in assets
        if asset.status
        and asset.status.strip().lower() == "active"
    )

    # =========================
    # Ticket Analysis
    # =========================

    open_tickets = sum(
        1
        for ticket in tickets
        if ticket.status
        and ticket.status.strip().lower() == "open"
    )

    progress_tickets = sum(
        1
        for ticket in tickets
        if ticket.status
        and ticket.status.strip().lower() == "in progress"
    )

    closed_tickets = sum(
        1
        for ticket in tickets
        if ticket.status
        and ticket.status.strip().lower() == "closed"
    )

    low_tickets = sum(
        1
        for ticket in tickets
        if ticket.priority
        and ticket.priority.strip().lower() == "low"
    )

    medium_tickets = sum(
        1
        for ticket in tickets
        if ticket.priority
        and ticket.priority.strip().lower() == "medium"
    )

    high_tickets = sum(
        1
        for ticket in tickets
        if ticket.priority
        and ticket.priority.strip().lower() == "high"
    )

    critical_tickets = sum(
        1
        for ticket in tickets
        if ticket.priority
        and ticket.priority.strip().lower() == "critical"
    )

    # =========================
    # Risk Score
    # =========================

    score = 0

    # Asset risk
    score += maintenance_assets * 8
    score += out_of_service_assets * 20

    # Ticket priority risk
    score += low_tickets * 1
    score += medium_tickets * 3
    score += high_tickets * 10
    score += critical_tickets * 20

    # Unresolved ticket risk
    score += open_tickets * 5
    score += progress_tickets * 2

    # Limit score to 100
    score = min(score, 100)

    # =========================
    # Risk Level
    # =========================

    if score >= 80:
        risk_level = "Critical"

    elif score >= 60:
        risk_level = "High"

    elif score >= 30:
        risk_level = "Medium"

    else:
        risk_level = "Low"

    # =========================
    # Risk Factors
    # =========================

    risk_factors = []

    if critical_tickets > 0:
        risk_factors.append(
            f"{critical_tickets} critical priority ticket(s)"
        )

    if high_tickets > 0:
        risk_factors.append(
            f"{high_tickets} high priority ticket(s)"
        )

    if out_of_service_assets > 0:
        risk_factors.append(
            f"{out_of_service_assets} out-of-service asset(s)"
        )

    if maintenance_assets > 0:
        risk_factors.append(
            f"{maintenance_assets} asset(s) under maintenance"
        )

    if open_tickets > 0:
        risk_factors.append(
            f"{open_tickets} unresolved open ticket(s)"
        )

    if not risk_factors:
        risk_factors.append(
            "No significant risk factors detected."
        )

    # =========================
    # Recommendations
    # =========================

    recommendations = []

    if critical_tickets > 0:
        recommendations.append(
            "Prioritize critical tickets immediately."
        )

    if high_tickets > 0:
        recommendations.append(
            "Review and resolve high-priority tickets."
        )

    if out_of_service_assets > 0:
        recommendations.append(
            "Review out-of-service assets for repair or replacement."
        )

    if maintenance_assets > 0:
        recommendations.append(
            "Monitor assets currently under maintenance."
        )

    if open_tickets > 0:
        recommendations.append(
            "Monitor unresolved tickets and reduce response delays."
        )

    if not recommendations:
        recommendations.append(
            "Maintain current operational status and continue monitoring."
        )

    # =========================
    # Final Result
    # =========================

    return {

        "risk_score": score,

        "risk_level": risk_level,

        "risk_factors": risk_factors,

        "summary": {

            "total_assets": len(assets),

            "active_assets": active_assets,

            "maintenance_assets": maintenance_assets,

            "out_of_service_assets": out_of_service_assets,

            "total_tickets": len(tickets),

            "open_tickets": open_tickets,

            "in_progress_tickets": progress_tickets,

            "closed_tickets": closed_tickets,

            "low_priority_tickets": low_tickets,

            "medium_priority_tickets": medium_tickets,

            "high_priority_tickets": high_tickets,

            "critical_tickets": critical_tickets

        },

        "recommendations": recommendations

    }


# -------------------------
# Activity Logs
# -------------------------

@app.get("/activity-logs")
def get_activity_logs(
    db: Session = Depends(get_db)
):

    logs = (
        db.query(ActivityLog)
        .order_by(ActivityLog.id.desc())
        .limit(20)
        .all()
    )

    return [
        {
            "id": log.id,
            "username": log.username,
            "action": log.action,
            "created_at": log.created_at
        }
        for log in logs
    ]