from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship, Session
from api.database import Base
from datetime import datetime, UTC


class Region(Base):
    __tablename__ = "regions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    support_measures = relationship("SupportMeasure", back_populates="region")

    @classmethod
    def get_by_id(cls, db: Session, id: int):
        return db.query(cls).filter(cls.id == id).first()

    @classmethod
    def get_all(cls, db: Session):
        return [cls._to_dict(region) for region in db.query(cls).all()]
    
    @classmethod
    def _to_dict(cls, region):
        return {
            "id": region.id,
            "name": region.name,
            "support_measures": [support_measure._to_dict() for support_measure in region.support_measures]
        }

    @classmethod
    def update(cls, db: Session, id: int, **kwargs):
        db_region = db.query(cls).filter(cls.id == id).first()
        for key, value in kwargs.items():
            if key not in [attr.name for attr in cls.__table__.columns]:
                continue    
            setattr(db_region, key, value)
        db.commit()
        db.refresh(db_region)
        return db_region

    @classmethod
    def create(cls, db: Session, name: str):
        region = cls(name=name)
        db.add(region)
        db.commit()
        db.refresh(region)
        return region
