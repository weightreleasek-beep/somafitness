from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import engine, get_db, Base
from models import ContactInquiry, NewsletterSubscription, ClassSession, Booking, AdminUser
from auth import hash_password, verify_password, create_access_token, get_current_admin, get_current_admin_only, create_default_admin
from email_service import send_booking_confirmation
from typing import Optional
from datetime import date, time, timedelta
import random
import string
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SOMA Fitness Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    db = next(get_db())
    try:
        create_default_admin(db)
    finally:
        db.close()


# =============================================
# Schemas
# =============================================

class ContactRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    service: Optional[str] = None
    message: str

class NewsletterRequest(BaseModel):
    email: str

class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    service: Optional[str]
    message: str
    class Config:
        from_attributes = True

class BookingRequest(BaseModel):
    session_id: int
    name: str
    email: str
    phone: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class ClassSessionCreate(BaseModel):
    session_type: str  # "pilates", "gym", or "dietitian"
    title: str
    date: date
    start_time: time
    end_time: time
    max_seats: int

class RecurringSessionCreate(BaseModel):
    session_type: str
    title: str
    start_time: time
    end_time: time
    max_seats: int
    days: list[int]  # 0=Monday, 1=Tuesday, ... 5=Saturday
    from_date: date
    to_date: date

class ClassSessionUpdate(BaseModel):
    title: Optional[str] = None
    date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    max_seats: Optional[int] = None
    is_active: Optional[bool] = None

class ConfirmAttendanceRequest(BaseModel):
    confirmation_code: Optional[str] = None
    booking_id: Optional[int] = None

class StaffAccountCreate(BaseModel):
    username: str
    password: str
    display_name: Optional[str] = None

class StaffAccountUpdate(BaseModel):
    display_name: Optional[str] = None
    password: Optional[str] = None


# =============================================
# Helpers
# =============================================

def generate_confirmation_code() -> str:
    return ''.join(random.choices(string.digits, k=4))


# =============================================
# Public — Contact & Newsletter
# =============================================

@app.get("/")
def root():
    index = os.path.join(STATIC_DIR, "index.html")
    if os.path.isfile(index):
        return FileResponse(index)
    return {"message": "SOMA Fitness Studio API"}

@app.post("/api/contact")
def submit_contact(data: ContactRequest, db: Session = Depends(get_db)):
    inquiry = ContactInquiry(
        name=data.name, email=data.email, phone=data.phone,
        service=data.service, message=data.message,
    )
    db.add(inquiry)
    db.commit()
    return {"success": True, "message": "Το μήνυμά σας στάλθηκε επιτυχώς!"}

@app.post("/api/newsletter")
def subscribe_newsletter(data: NewsletterRequest, db: Session = Depends(get_db)):
    existing = db.query(NewsletterSubscription).filter(
        NewsletterSubscription.email == data.email
    ).first()
    if existing:
        return {"success": True, "message": "Είστε ήδη εγγεγραμμένοι!"}
    db.add(NewsletterSubscription(email=data.email))
    db.commit()
    return {"success": True, "message": "Εγγραφήκατε επιτυχώς!"}


# =============================================
# Public — Booking System
# =============================================

@app.get("/api/sessions")
def get_available_sessions(
    session_type: Optional[str] = None,
    from_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    """Get available class sessions with seat counts."""
    query = db.query(ClassSession).filter(ClassSession.is_active == True)

    if session_type:
        query = query.filter(ClassSession.session_type == session_type)
    if from_date:
        query = query.filter(ClassSession.date >= from_date)
    else:
        query = query.filter(ClassSession.date >= date.today())

    sessions = query.order_by(ClassSession.date, ClassSession.start_time).all()

    result = []
    for s in sessions:
        booked = len([b for b in s.bookings if not b.is_cancelled])
        result.append({
            "id": s.id,
            "session_type": s.session_type,
            "title": s.title,
            "date": s.date.isoformat(),
            "start_time": s.start_time.strftime("%H:%M"),
            "end_time": s.end_time.strftime("%H:%M"),
            "max_seats": s.max_seats,
            "booked_seats": booked,
            "available_seats": s.max_seats - booked,
        })
    return result


@app.post("/api/book")
def create_booking(data: BookingRequest, db: Session = Depends(get_db)):
    """Book a seat in a class session."""
    session = db.query(ClassSession).filter(ClassSession.id == data.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Το μάθημα δεν βρέθηκε.")
    if not session.is_active:
        raise HTTPException(status_code=400, detail="Το μάθημα δεν είναι διαθέσιμο.")

    booked = len([b for b in session.bookings if not b.is_cancelled])
    if booked >= session.max_seats:
        raise HTTPException(status_code=400, detail="Δεν υπάρχουν διαθέσιμες θέσεις.")

    # Check duplicate booking (same session)
    existing = db.query(Booking).filter(
        Booking.session_id == data.session_id,
        Booking.email == data.email,
        Booking.is_cancelled == False,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Έχετε ήδη κράτηση σε αυτό το μάθημα.")

    # Check time overlap — prevent double-booking across sessions on the same date
    overlapping = (
        db.query(Booking)
        .join(ClassSession)
        .filter(
            Booking.email == data.email,
            Booking.is_cancelled == False,
            ClassSession.date == session.date,
            ClassSession.start_time < session.end_time,
            ClassSession.end_time > session.start_time,
            ClassSession.id != session.id,
        )
        .first()
    )
    if overlapping:
        raise HTTPException(
            status_code=400,
            detail="Έχετε ήδη κράτηση σε άλλο μάθημα την ίδια ώρα.",
        )

    code = generate_confirmation_code()
    booking = Booking(
        session_id=data.session_id,
        name=data.name,
        email=data.email,
        phone=data.phone,
        confirmation_code=code,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    # Send confirmation email
    send_booking_confirmation(
        to_email=data.email,
        name=data.name,
        confirmation_code=code,
        session_title=session.title,
        session_date=session.date.strftime("%d/%m/%Y"),
        session_time=f"{session.start_time.strftime('%H:%M')} - {session.end_time.strftime('%H:%M')}",
    )

    return {
        "success": True,
        "message": "Η κράτησή σας ολοκληρώθηκε!",
        "confirmation_code": code,
        "booking": {
            "id": booking.id,
            "name": booking.name,
            "session_title": session.title,
            "date": session.date.isoformat(),
            "time": f"{session.start_time.strftime('%H:%M')} - {session.end_time.strftime('%H:%M')}",
        },
    }


# =============================================
# Admin — Auth
# =============================================

@app.post("/api/admin/login")
def admin_login(data: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.username == data.username).first()
    if not admin or not verify_password(data.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Λάθος στοιχεία σύνδεσης.")
    token = create_access_token(data={"sub": admin.username})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": admin.role,
        "display_name": admin.display_name or admin.username,
    }


# =============================================
# Admin — Class Session Management
# =============================================

@app.get("/api/admin/sessions")
def admin_get_sessions(
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    sessions = db.query(ClassSession).order_by(ClassSession.date.desc(), ClassSession.start_time).all()
    result = []
    for s in sessions:
        active_bookings = [b for b in s.bookings if not b.is_cancelled]
        result.append({
            "id": s.id,
            "session_type": s.session_type,
            "title": s.title,
            "date": s.date.isoformat(),
            "start_time": s.start_time.strftime("%H:%M"),
            "end_time": s.end_time.strftime("%H:%M"),
            "max_seats": s.max_seats,
            "booked_seats": len(active_bookings),
            "confirmed_count": len([b for b in active_bookings if b.is_confirmed_attendance]),
            "is_active": s.is_active,
        })
    return result


@app.post("/api/admin/sessions")
def admin_create_session(
    data: ClassSessionCreate,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    session = ClassSession(
        session_type=data.session_type,
        title=data.title,
        date=data.date,
        start_time=data.start_time,
        end_time=data.end_time,
        max_seats=data.max_seats,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"success": True, "id": session.id, "message": "Το μάθημα δημιουργήθηκε!"}


@app.post("/api/admin/sessions/recurring")
def admin_create_recurring(
    data: RecurringSessionCreate,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Create recurring sessions for selected days within a date range."""
    if data.from_date > data.to_date:
        raise HTTPException(status_code=400, detail="Η ημερομηνία έναρξης πρέπει να είναι πριν τη λήξη.")
    if not data.days:
        raise HTTPException(status_code=400, detail="Επιλέξτε τουλάχιστον μία ημέρα.")

    created = 0
    current = data.from_date
    while current <= data.to_date:
        # current.weekday(): 0=Monday ... 6=Sunday
        if current.weekday() in data.days:
            session = ClassSession(
                session_type=data.session_type,
                title=data.title,
                date=current,
                start_time=data.start_time,
                end_time=data.end_time,
                max_seats=data.max_seats,
            )
            db.add(session)
            created += 1
        current += timedelta(days=1)

    db.commit()
    return {"success": True, "created": created, "message": f"Δημιουργήθηκαν {created} μαθήματα!"}


@app.put("/api/admin/sessions/{session_id}")
def admin_update_session(
    session_id: int,
    data: ClassSessionUpdate,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    session = db.query(ClassSession).filter(ClassSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(session, field, value)
    db.commit()
    return {"success": True, "message": "Το μάθημα ενημερώθηκε!"}


@app.delete("/api/admin/sessions/{session_id}")
def admin_delete_session(
    session_id: int,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    session = db.query(ClassSession).filter(ClassSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()
    return {"success": True, "message": "Το μάθημα διαγράφηκε!"}


# =============================================
# Admin — Booking Management
# =============================================

@app.get("/api/admin/sessions/{session_id}/bookings")
def admin_get_bookings(
    session_id: int,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    session = db.query(ClassSession).filter(ClassSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    bookings = [b for b in session.bookings if not b.is_cancelled]
    return {
        "session": {
            "id": session.id,
            "title": session.title,
            "date": session.date.isoformat(),
            "start_time": session.start_time.strftime("%H:%M"),
            "end_time": session.end_time.strftime("%H:%M"),
            "max_seats": session.max_seats,
        },
        "bookings": [
            {
                "id": b.id,
                "name": b.name,
                "email": b.email,
                "phone": b.phone,
                "confirmation_code": b.confirmation_code,
                "is_confirmed_attendance": b.is_confirmed_attendance,
                "created_at": b.created_at.isoformat() if b.created_at else None,
            }
            for b in bookings
        ],
    }


@app.post("/api/admin/confirm-attendance")
def admin_confirm_attendance(
    data: ConfirmAttendanceRequest,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Confirm attendance by 4-digit code or booking ID."""
    booking = None

    if data.confirmation_code:
        booking = db.query(Booking).filter(
            Booking.confirmation_code == data.confirmation_code,
            Booking.is_cancelled == False,
        ).order_by(Booking.created_at.desc()).first()
    elif data.booking_id:
        booking = db.query(Booking).filter(Booking.id == data.booking_id).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Η κράτηση δεν βρέθηκε.")

    booking.is_confirmed_attendance = True
    db.commit()
    return {"success": True, "message": f"Επιβεβαιώθηκε η παρουσία: {booking.name}"}


@app.post("/api/admin/toggle-attendance/{booking_id}")
def admin_toggle_attendance(
    booking_id: int,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Toggle attendance for a booking (check/uncheck)."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    booking.is_confirmed_attendance = not booking.is_confirmed_attendance
    db.commit()
    return {"success": True, "confirmed": booking.is_confirmed_attendance}


@app.get("/api/admin/contacts")
def admin_get_contacts(
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return [
        {
            "id": c.id, "name": c.name, "email": c.email,
            "phone": c.phone, "service": c.service, "message": c.message,
            "is_read": c.is_read,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        }
        for c in db.query(ContactInquiry).order_by(ContactInquiry.created_at.desc()).all()
    ]


# =============================================
# Admin — Staff Account Management (admin-only)
# =============================================

@app.get("/api/admin/staff")
def admin_get_staff(
    admin: AdminUser = Depends(get_current_admin_only),
    db: Session = Depends(get_db),
):
    """List all staff accounts (admin-only)."""
    users = db.query(AdminUser).order_by(AdminUser.created_at).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "display_name": u.display_name or u.username,
            "role": u.role,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        }
        for u in users
    ]


@app.post("/api/admin/staff")
def admin_create_staff(
    data: StaffAccountCreate,
    admin: AdminUser = Depends(get_current_admin_only),
    db: Session = Depends(get_db),
):
    """Create a new staff account (admin-only)."""
    existing = db.query(AdminUser).filter(AdminUser.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Το username υπάρχει ήδη.")
    if len(data.password) < 4:
        raise HTTPException(status_code=400, detail="Ο κωδικός πρέπει να έχει τουλάχιστον 4 χαρακτήρες.")

    user = AdminUser(
        username=data.username,
        password_hash=hash_password(data.password),
        role="staff",
        display_name=data.display_name or data.username,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"success": True, "message": f"Ο λογαριασμός '{data.username}' δημιουργήθηκε!"}


@app.put("/api/admin/staff/{user_id}")
def admin_update_staff(
    user_id: int,
    data: StaffAccountUpdate,
    admin: AdminUser = Depends(get_current_admin_only),
    db: Session = Depends(get_db),
):
    """Update a staff account (admin-only)."""
    user = db.query(AdminUser).filter(AdminUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Ο χρήστης δεν βρέθηκε.")
    if data.display_name is not None:
        user.display_name = data.display_name
    if data.password is not None:
        if len(data.password) < 4:
            raise HTTPException(status_code=400, detail="Ο κωδικός πρέπει να έχει τουλάχιστον 4 χαρακτήρες.")
        user.password_hash = hash_password(data.password)
    db.commit()
    return {"success": True, "message": "Ο λογαριασμός ενημερώθηκε!"}


@app.delete("/api/admin/staff/{user_id}")
def admin_delete_staff(
    user_id: int,
    admin: AdminUser = Depends(get_current_admin_only),
    db: Session = Depends(get_db),
):
    """Delete a staff account (admin-only). Cannot delete yourself."""
    user = db.query(AdminUser).filter(AdminUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Ο χρήστης δεν βρέθηκε.")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Δεν μπορείτε να διαγράψετε τον εαυτό σας.")
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Δεν μπορείτε να διαγράψετε λογαριασμό admin.")
    db.delete(user)
    db.commit()
    return {"success": True, "message": f"Ο λογαριασμός '{user.username}' διαγράφηκε!"}


@app.get("/api/admin/me")
def admin_get_me(admin: AdminUser = Depends(get_current_admin)):
    """Get current user info."""
    return {
        "id": admin.id,
        "username": admin.username,
        "display_name": admin.display_name or admin.username,
        "role": admin.role,
    }


# =============================================
# Serve React Frontend (production)
# =============================================

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")


@app.on_event("startup")
def mount_frontend():
    """Mount React static files if build exists."""
    static_inner = os.path.join(STATIC_DIR, "static")
    if os.path.isdir(static_inner):
        app.mount("/static", StaticFiles(directory=static_inner), name="react-static")
        print(f"Frontend mounted from {STATIC_DIR}")
    else:
        print(f"No frontend build found at {STATIC_DIR}")


@app.get("/{full_path:path}")
def serve_react(full_path: str):
    """Serve React app for all non-API routes."""
    if not os.path.isdir(STATIC_DIR):
        return {"message": "SOMA Fitness Studio API"}
    file_path = os.path.join(STATIC_DIR, full_path)
    if full_path and os.path.isfile(file_path):
        return FileResponse(file_path)
    index = os.path.join(STATIC_DIR, "index.html")
    if os.path.isfile(index):
        return FileResponse(index)
    return {"message": "SOMA Fitness Studio API"}
