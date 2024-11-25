from datetime import timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from src.services.product_service import get_product
from src.services.day_off_service import get_daysOff
from src.models.schemas_models import InvestmentCreate
from src.models.db_models import Investment

def is_working_day(fecha, holidays):
    fecha_comparable = fecha.date()
    result = fecha.weekday() < 5 and fecha_comparable not in holidays
    return result

def move_to_work_day(fecha, holidays):
    while not is_working_day(fecha, holidays):
        fecha += timedelta(days=1)
    return fecha

def calculate_investment_dates(db: Session, data: InvestmentCreate):
    product = get_product(db=db, producto_id=data.product_id)

    days_off = get_daysOff(db=db)
    holidays = {holiday.day for holiday in days_off} 

    hora_operativa = product.operating_hour

    if data.creation_date.time() <= hora_operativa:
        if data.reinvestment:
            dias_a_sumar = product.days_less_equal_operating_hour_reinvestment
        else:
            dias_a_sumar = product.days_less_equal_operating_hour
    else:
        if data.reinvestment:
            dias_a_sumar = product.days_greater_operating_hour_reinvestment
        else:
            dias_a_sumar = product.days_greater_operating_hour

    fecha_inicio = data.creation_date + timedelta(days=dias_a_sumar)
    fecha_inicio = move_to_work_day(fecha_inicio, holidays)

    fecha_fin = fecha_inicio + timedelta(days=data.term + 1)
    fecha_fin = move_to_work_day(fecha_fin, holidays)

    plazo_real = (fecha_fin - fecha_inicio).days

    fecha_inicio = fecha_inicio.replace(hour=0, minute=0, second=0, microsecond=0)
    fecha_fin = fecha_fin.replace(hour=0, minute=0, second=0, microsecond=0)

    fecha_inicio_str = fecha_inicio.strftime("%Y-%m-%d %H:%M:%S")
    fecha_fin_str = fecha_fin.strftime("%Y-%m-%d %H:%M:%S")

    new_investment = Investment(
        product_id=data.product_id, 
        term=data.term,
        start_date=fecha_inicio_str,  
        end_date=fecha_fin_str, 
        actual_term=plazo_real,  
        creation_date=data.creation_date, 
        is_active=True 
    )

    db.add(new_investment)
    db.commit()
    db.refresh(new_investment)

    return {
        "producto": data.product_id,
        "plazo": data.term,
        "fechaInicio": fecha_inicio_str,
        "fechaFin": fecha_fin_str,
        "plazoReal": plazo_real
    }

def get_investment(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Investment).filter(Investment.is_active == True).options(joinedload(Investment.products)).offset(skip).limit(limit).all()


def delete_investment(db: Session, investment_id: int):
    db_investment = db.query(Investment).filter((Investment.id == investment_id) & (Investment.is_active)).first()
    if not db_investment:
        raise HTTPException(status_code=400, detail="Investment not found")

    db_investment.is_active = False
    db.commit()
    db.refresh(db_investment)
    return db_investment