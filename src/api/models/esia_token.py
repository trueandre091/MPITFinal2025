from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, BigInteger
from sqlalchemy.orm import relationship, Session
from api.database import Base
from datetime import datetime, UTC


class EsiaToken(Base):
    __tablename__ = "esia_tokens"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False, unique=True)
    user = relationship("User", back_populates="esia_token")
    esia_token = Column(String, nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    @classmethod
    def get_by_user_id(cls, db: Session, user_id: int):
        return db.query(cls).filter(cls.user_id == user_id).first()

    @classmethod
    def get_by_esia_token(cls, db: Session, esia_token: str):
        return db.query(cls).filter(cls.esia_token == esia_token).first()

    @classmethod
    def update(cls, db: Session, id: int, **kwargs):
        db_esia_token = db.query(cls).filter(cls.id == id).first()
        for key, value in kwargs.items():
            if key not in [attr.name for attr in cls.__table__.columns]:
                continue
            setattr(db_esia_token, key, value)
        db.commit()
        db.refresh(db_esia_token)
        return db_esia_token

    @classmethod
    def create(cls, db: Session, user_id: int, esia_token: str, **kwargs):
        db_esia_token = cls(user_id=user_id, esia_token=esia_token)
        for key, value in kwargs.items():
            if key not in [attr.name for attr in cls.__table__.columns]:
                continue
            setattr(db_esia_token, key, value)
        db.add(db_esia_token)
        db.commit()
        db.refresh(db_esia_token)
        return db_esia_token
