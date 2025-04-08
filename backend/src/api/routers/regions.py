from fastapi import APIRouter, HTTPException, Depends, status, Form
from passlib.context import CryptContext
from datetime import datetime, timedelta
import os
from api.database import get_db
from sqlalchemy.orm import Session
from api.settings import get_settings

from api.services.auth_service import AuthService

from api.models.region import Region
from api.models.user import User
from api.models.support_measure import SupportMeasure


router = APIRouter()
auth_service = AuthService()

@router.get("/")
async def get_regions(user: User = Depends(auth_service.verify_user), db: Session = Depends(get_db)):
    return Region.get_all(db)

@router.get("/{region_id}")
async def get_region(region_id: int, user: User = Depends(auth_service.verify_user), db: Session = Depends(get_db)):
    return Region.get_by_id(db, region_id).support_measures



