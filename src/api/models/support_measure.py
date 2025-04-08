
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship, Session
from api.database import Base
from datetime import datetime, UTC


class SupportMeasure(Base):
    __tablename__ = "support_measures"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    link = Column(String, nullable=True)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=False)
    region = relationship("Region", back_populates="support_measures")

    @classmethod
    def get_by_id(cls, db: Session, id: int):
        return db.query(cls).filter(cls.id == id).first()

    @classmethod
    def get_region_id(cls, db: Session, region_id: int):
        return db.query(cls).filter(cls.region_id == region_id).all()


    def _to_dict(self):
        return {
            "id": self.id,
            "description": self.description,
            "link": self.link,
            "region_id": self.region_id
        }


    @classmethod
    def update(cls, db: Session, id: int, **kwargs):
        db_support_measure = db.query(cls).filter(cls.id == id).first()
        for key, value in kwargs.items():
            if key not in [attr.name for attr in cls.__table__.columns]:
                continue
            setattr(db_support_measure, key, value)
        db.commit()
        db.refresh(db_support_measure)
        return db_support_measure

    @classmethod
    def create(cls, db: Session, description: str, link: str, region_id: int):
        support_measure = cls(description=description, link=link, region_id=region_id)
        db.add(support_measure)
        db.commit()
        db.refresh(support_measure)
        return support_measure
