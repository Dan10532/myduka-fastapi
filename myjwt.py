# =========================
# IMPORTS
# =========================
from datetime import datetime, timedelta, timezone
from typing import Annotated

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy import select

from models import User, SessionLocal
from pwdlib import PasswordHash


# =========================
# CONFIG
# =========================
SECRET_KEY = "3q45wgte67u8l;0-i'[plokiujnyhbtgvrfdefrghtyulkoiujyhtgrfd]"
ALGORITHM = "HS256"

security = HTTPBearer()
password_hash = PasswordHash.recommended()


# =========================
# PASSWORD UTILS
# =========================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return password_hash.hash(password)


# =========================
# USER UTILS
# =========================
def get_user(email: str):
    return SessionLocal.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()


def authenticate_user(email: str, password: str):
    user = get_user(email)

    if not user:
        return False

    if not verify_password(password, user.password):
        return False

    return user


# =========================
# JWT TOKEN CREATION
# =========================
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """
    ALWAYS expects:
    data = {"sub": user.email}
    """
    if "sub" not in data:
        raise ValueError("Token data must include 'sub'")

    to_encode = data.copy()
    to_encode["scope"] = "user"

    expire = datetime.now(timezone.utc) + (
        expires_delta if expires_delta else timedelta(minutes=30)
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# =========================
# AUTH DEPENDENCY
# =========================
async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)]
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing subject",
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = get_user(email=email)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


# =========================
# OPTIONAL: ACTIVE USER CHECK
# =========================
async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if getattr(current_user, "disabled", False):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )

    return current_user