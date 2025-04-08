from sqlalchemy import Column, Integer, String, Boolean, DateTime, BigInteger
from sqlalchemy.orm import relationship, Session
from api.database import Base
from datetime import datetime, UTC
from random import randint

class Admin(Base):
    __tablename__ = "admins"

    id = Column(BigInteger, primary_key=True, index=True)
    tg_id = Column(BigInteger, nullable=False)
    created_at = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    @classmethod
    def create(cls, db: Session, tg_id: int):
        db_admin = cls(id=cls._get_unique_id(db), tg_id=tg_id)
        db.add(db_admin)
        db.commit()
        db.refresh(db_admin)
        return db_admin
    
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
