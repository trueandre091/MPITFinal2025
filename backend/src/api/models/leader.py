from sqlalchemy import Column, Integer, String, Boolean, DateTime, BigInteger
from sqlalchemy.orm import relationship, Session
from api.database import Base
from datetime import datetime, UTC
from random import randint

class Leader(Base):
    __tablename__ = "leaders"

    id = Column(BigInteger, primary_key=True, index=True)
    tg_id = Column(BigInteger, nullable=False, unique=True)
    name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    requests = relationship("Request", back_populates="leader")

    @classmethod
    def create(cls, db: Session, tg_id: int, name: str):
        db_leader = cls(id=cls._get_unique_id(db), tg_id=tg_id, name=name)
        db.add(db_leader)
        db.commit()
        db.refresh(db_leader)
        return db_leader
    
    @classmethod
    def update(cls, db: Session, id: int, **kwargs):
        db_leader = db.query(cls).filter(cls.id == id).first()
        for key, value in kwargs.items():
            if key not in [attr.name for attr in cls.__table__.columns]:
                continue
            setattr(db_leader, key, value)
        db.commit()
        db.refresh(db_leader)
        return db_leader
    
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
    def delete(cls, db: Session, id: int):
        db_leader = db.query(cls).filter(cls.id == id).first()
        db.delete(db_leader)
        db.commit()
        db.refresh(db_leader)
        return db_leader
