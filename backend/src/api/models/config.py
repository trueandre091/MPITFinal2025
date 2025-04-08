from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship, Session
from api.database import Base
from datetime import datetime, UTC


class Config(Base):
    __tablename__ = "configs"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, nullable=False)
    value = Column(String, nullable=False)

    @classmethod
    def get_by_key(cls, db: Session, key: str):
        return db.query(cls).filter(cls.key == key).first()

    @classmethod
    def update(cls, db: Session, key: str, value: str):
        config = cls.get_by_key(db, key)
        if config:
            config.value = value
            db.commit()
            db.refresh(config)
        return config

    @classmethod
    def create(cls, db: Session, key: str, value: str):
        config = cls(key=key, value=value)
        db.add(config)
        db.commit()
        db.refresh(config)
        return config
