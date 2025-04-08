from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    BigInteger,
)
from sqlalchemy.orm import relationship, Session
from api.database import Base
from datetime import datetime, UTC
from random import randint

class Request(Base):
    __tablename__ = "requests"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    leader_id = Column(BigInteger, ForeignKey("leaders.id"), nullable=True)
    theme = Column(String, nullable=False)
    message = Column(String, nullable=False)
    is_closed = Column(Boolean, default=False)
    rating = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    leader = relationship("Leader", back_populates="requests")
    user = relationship("User", back_populates="requests")

    @classmethod
    def create(cls, db: Session, user_id: int, theme: str, message: str, **kwargs):
        db_request = cls(id=cls._get_unique_id(db), user_id=user_id, theme=theme, message=message)
        for key, value in kwargs.items():
            if key not in [attr.name for attr in cls.__table__.columns]:
                continue
            setattr(db_request, key, value)
        db.add(db_request)
        db.commit()
        db.refresh(db_request)
        return db_request
    
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
    def update(cls, db: Session, id: int, **kwargs):
        db_request = db.query(cls).filter(cls.id == id).first()
        for key, value in kwargs.items():
            if key not in [attr.name for attr in cls.__table__.columns]:
                continue
            setattr(db_request, key, value)
        db.commit()
        db.refresh(db_request)
        return db_request
    