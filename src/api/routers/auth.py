from fastapi import APIRouter, HTTPException, Depends, status, Form
from passlib.context import CryptContext
from datetime import datetime, timedelta
import os
from api.database import get_db
from sqlalchemy.orm import Session
from api.settings import get_settings

from api.services.auth_service import AuthService
from api.services.user_service import UserCreate

from api.models.user import User
from api.models.esia_token import EsiaToken
settings = get_settings()
router = APIRouter()
auth_service = AuthService()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    esia_token: str = Form(...),
    name: str = Form(...),
    role: str = Form(...),
    db: Session = Depends(get_db),
):
    user = UserCreate(esia_token=esia_token, name=name, role=role)

    if EsiaToken.get_by_token(db, user.esia_token):
        raise HTTPException(status_code=406, detail="User already exists")

    user = User.create(db, user.esia_token, user.name, user.role)
    token = auth_service.create_token({"sub": str(user.id)})

    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "role": user.role,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
        },
    }


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(
    esia_token: str = Form(...), db: Session = Depends(get_db)
):
    user = User.get_by_esia_token(db, esia_token)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.is_active:
        User.update(db, user.id, is_active=True)

    token = auth_service.create_token({"sub": str(user.id)})
    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "role": user.role,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
        },
    }


@router.get("/me", status_code=status.HTTP_200_OK)
async def me(
    user: User = Depends(auth_service.verify_user), db: Session = Depends(get_db)
):
    return {
        "user": {
            "id": user.id,
            "name": user.name,
            "role": user.role,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
        }
    }


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    user: User = Depends(auth_service.verify_user), db: Session = Depends(get_db)
):
    User.update(db, user.id, is_active=False)
    return {"detail": "Logged out"}
