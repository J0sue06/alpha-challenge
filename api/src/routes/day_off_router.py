from fastapi import APIRouter, Depends
from src.models.schemas_models import DayOffCreate
from src.utils.db.dbinstance import get_db
from sqlalchemy.orm import Session
from src.services.day_off_service import create_dayOff, get_dayOff, get_daysOff, delete_dayOff, update_dayOff

dayOff_router = APIRouter()

@dayOff_router.post('')
def create(dayOff: DayOffCreate, db:Session=Depends(get_db)):
    dayOff = create_dayOff(db=db, day=dayOff)
    return dayOff

@dayOff_router.get('')
def get(db:Session=Depends(get_db)):
    daysOff = get_daysOff(db=db)
    return daysOff

@dayOff_router.get('/{id}')
def getById(id: int, db:Session=Depends(get_db)):
    dayOff = get_dayOff(db=db, dayoff_id=id)
    return dayOff

@dayOff_router.put('/{id}')
def updated(id: int, dayOff:DayOffCreate, db:Session=Depends(get_db)):
    dayOff = update_dayOff(db=db, dayOff_id=id, updated_data=dayOff)
    return dayOff

@dayOff_router.delete('/{id}')
def delete(id: int, db:Session=Depends(get_db)):
    dayOff = delete_dayOff(db=db, dayOff_id=id)
    return dayOff
