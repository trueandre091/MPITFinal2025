from sqlalchemy import Column, Integer, String, Boolean, DateTime, BigInteger
from sqlalchemy.orm import relationship, Session
from api.database import Base
from api.models.esia_token import EsiaToken
from datetime import datetime, UTC
from random import randint
import string

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String)
    role = Column(String, default="user")
    tg_id = Column(BigInteger, unique=True, index=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    user_requests = relationship(
        "Request", foreign_keys="Request.user_id", back_populates="user"
    )
    esia_token = relationship(
        "EsiaToken", foreign_keys="EsiaToken.user_id", back_populates="user"
    )


    @classmethod
    def create(cls, db: Session, esia_token: str, name: str, role: str, **kwargs):
        db_user = cls(
            id=cls._get_unique_id(db),
            name=name,
            role=role,
        )
        for key, value in kwargs.items():
            if key not in [attr.name for attr in cls.__table__.columns]:
                continue
            setattr(db_user, key, value)
        
        # временное решение
        EsiaToken.create(db, db_user.id, esia_token)

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @classmethod
    def _get_unique_id(cls, db: Session):
        while True:
            id = randint(10**7, 10**10)
            if not cls.get_by_id(db, id):
                return id

    @classmethod
    def get_by_id(cls, db: Session, id: int):
        return db.query(cls).filter(cls.id == id).first()

    @classmethod
    def get_by_tg_id(cls, db: Session, tg_id: int):
        return db.query(cls).filter(cls.tg_id == tg_id).first()

    @classmethod
    def update(cls, db: Session, id: int, **kwargs):
        db_user = db.query(cls).filter(cls.id == id).first()
        for key, value in kwargs.items():
            if key not in [attr.name for attr in cls.__table__.columns]:
                continue
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
        return db_user
