from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from src.models.db_models import Product
from src.models.schemas_models import ProductCreate
from typing import List

def get_product_by_name(db: Session, product_name: str):
    return db.query(Product).filter((Product.name == product_name) & (Product.is_active)).first()

def get_product(db: Session, producto_id: int):
    product = db.query(Product).filter((Product.id == producto_id) & (Product.is_active)).first()

    if not product:
        raise HTTPException(status_code=400, detail="Product not found")
    
    return product

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Product).filter(Product.is_active == True).offset(skip).limit(limit).all()

def create_product(db: Session, producto: ProductCreate):
    _producto = get_product_by_name(db=db, product_name=producto.name)

    if _producto:
        raise HTTPException(status_code=400, detail="Product already exists")

    db_producto = Product(
        name=producto.name, 
        days_less_equal_operating_hour=producto.days_less_equal_operating_hour,  
        days_greater_operating_hour=producto.days_greater_operating_hour,  
        days_less_equal_operating_hour_reinvestment=producto.days_less_equal_operating_hour_reinvestment,  
        days_greater_operating_hour_reinvestment=producto.days_greater_operating_hour_reinvestment, 
        operating_hour=producto.operating_hour  
    )
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

def update_product(db: Session, producto_id: int, updated_data: ProductCreate):
    updated_data_dict = updated_data.model_dump(exclude_unset=True)

    result = db.query(Product).filter((Product.id == producto_id) & (Product.is_active)).update(updated_data_dict)

    if result == 0:
         raise HTTPException(status_code=400, detail="Product not found")

    db.commit()
    db_producto = get_product(db=db, producto_id=producto_id)
    return db_producto

def delete_product(db: Session, producto_id: int):
    db_producto = get_product(db=db, producto_id=producto_id)

    db_producto.is_active = False
    db.commit()
    db.refresh(db_producto)
    return db_producto

def ajustar_a_dia_laboral(date: datetime, days_off: List[datetime.date]) -> datetime:
    # Si cae en fin de semana, mover al lunes
    while date.weekday() in (5, 6) or date.date() in days_off:
        date += timedelta(days=1)
    return date

