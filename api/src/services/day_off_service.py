from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.models.db_models import DayOff
from src.models.schemas_models import DayOffCreate

def check_dayOff(db: Session, day: str):
    dayOff = db.query(DayOff).filter(DayOff.day == day).first()

    if dayOff:
        raise HTTPException(status_code=400, detail="DayOff already registered")

def get_dayOff(db: Session, dayoff_id: int):
    dayOff = db.query(DayOff).filter((DayOff.id == dayoff_id) & (DayOff.is_active)).first()

    if not dayOff:
        raise HTTPException(status_code=400, detail="DayOff not found")
    
    return dayOff

def get_daysOff(db: Session, skip:int=0, limit:int=100):
    return db.query(DayOff).filter(DayOff.is_active).offset(skip).limit(limit).all()

def create_dayOff(db: Session, day: DayOffCreate):
    check_dayOff(db=db, day=day.day)
    
    db_dayOff = DayOff(day=day.day)

    db.add(db_dayOff)
    db.commit()
    db.refresh(db_dayOff)
    
    return db_dayOff

def update_dayOff(db: Session, dayOff_id: int, updated_data: DayOffCreate):
    updated_data_dict = updated_data.model_dump(exclude_unset=True)

    result = db.query(DayOff).filter(DayOff.id == dayOff_id).update(updated_data_dict)

    if result == 0:
        raise HTTPException(status_code=400, detail="DayOff not found")

    db.commit()

    db_dayOff = db.query(DayOff).filter(DayOff.id == dayOff_id).first()

    return db_dayOff


def delete_dayOff(db: Session, dayOff_id: int):
    db_dayOff = get_dayOff(db=db, dayoff_id=dayOff_id)

    db_dayOff.is_active = False
    db.commit()
    db.refresh(db_dayOff)
    return db_dayOff