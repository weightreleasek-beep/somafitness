from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import AdminUser
import os

SECRET_KEY = os.getenv("SECRET_KEY", "soma-secret-key-change-in-production-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

security = HTTPBearer()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> AdminUser:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    admin = db.query(AdminUser).filter(AdminUser.username == username).first()
    if admin is None:
        raise HTTPException(status_code=401, detail="Admin not found")
    return admin


def get_current_admin_only(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> AdminUser:
    """Only allow users with admin role."""
    user = get_current_admin(credentials, db)
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Δεν έχετε δικαίωμα πρόσβασης.")
    return user


def create_default_admin(db: Session):
    """Create default admin if none exists. Ensure existing admins have role set."""
    existing = db.query(AdminUser).first()
    if not existing:
        admin = AdminUser(
            username="admin",
            password_hash=hash_password("soma2024"),
            role="admin",
            display_name="Διαχειριστής",
        )
        db.add(admin)
        db.commit()
    else:
        # Ensure existing admin accounts have role set
        admins_without_role = db.query(AdminUser).filter(
            (AdminUser.role == None) | (AdminUser.role == "")
        ).all()
        for a in admins_without_role:
            a.role = "admin"
            if not a.display_name:
                a.display_name = a.username
        if admins_without_role:
            db.commit()
