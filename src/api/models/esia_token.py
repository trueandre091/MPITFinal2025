from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship, Session
from api.database import Base
from datetime import datetime, UTC
import string
import random


class EsiaToken(Base):
    __tablename__ = "esia_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    token = Column(String, nullable=False)
    user = relationship("User", back_populates="esia_token")

    @classmethod
    def get_by_user_id(cls, db: Session, user_id: int):
        return db.query(cls).filter(cls.user_id == user_id).first()
    
    @classmethod
    def get_by_token(cls, db: Session, token: str):
        return db.query(cls).filter(cls.token == token).first()

    @classmethod
    def update(cls, db: Session, user_id: int, token: str):
        esia_token = cls.get_by_user_id(db, user_id)
        if esia_token:
            esia_token.token = token
            db.commit()
            db.refresh(esia_token)
        return esia_token

    @classmethod
    def create(cls, db: Session, user_id: int, token: str):
        esia_token = cls(user_id=user_id, token=token)
        db.add(esia_token)
        db.commit()
        db.refresh(esia_token)
        return esia_token

    @classmethod
    def _get_unique_esia_token(cls, db: Session, length=20):
        # временное решение
        chars = string.ascii_letters + string.digits
        while True:
            esia_token = ''.join(random.choice(chars) for _ in range(length))
            return esia_token