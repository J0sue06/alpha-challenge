from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.utils.db.dbinstance import get_db
from src.models.schemas_models import InvestmentCreate
from src.services.investment_service import calculate_investment_dates, get_investment, delete_investment

investment_router = APIRouter()

@investment_router.post('/calculate_investment')
def calculate_dates(data: InvestmentCreate, db: Session = Depends(get_db)):
    # Calcular las fechas de inversión
    result = calculate_investment_dates(db=db, data=data)
    return result

@investment_router.get('')
def get_investments(db: Session = Depends(get_db)):
    # Obtener todos los productos activos
    investments = get_investment(db=db)
    return investments

@investment_router.delete('/{id}')
def delete_producto_route(id: int, db: Session = Depends(get_db)):
    # Eliminar un producto (marcar como inactivo)
    deleted_investment = delete_investment(db=db, investment_id=id)
    if not deleted_investment:
        raise HTTPException(status_code=404, detail="Investment not found")
    return deleted_investment