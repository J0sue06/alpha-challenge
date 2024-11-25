from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.utils.db.dbinstance import get_db
from src.services.product_service import (
    create_product, 
    get_products, 
    get_product, 
    update_product, 
    delete_product
)
from src.models.schemas_models import ProductCreate

product_router = APIRouter()

@product_router.post('')
def create_producto_route(product: ProductCreate, db: Session = Depends(get_db)):
    return create_product(db=db, producto=product)

@product_router.get('')
def get_productos_route(db: Session = Depends(get_db)):
    productos = get_products(db=db)
    return productos

@product_router.get('/{id}')
def get_producto_by_id_route(id: int, db: Session = Depends(get_db)):
    producto = get_product(db=db, producto_id=id)
    return producto

@product_router.put('/{id}')
def update_producto_route(id: int, product: ProductCreate, db: Session = Depends(get_db)):
    updated_producto = update_product(db=db, producto_id=id, updated_data=product)
    return updated_producto

@product_router.delete('/{id}')
def delete_producto_route(id: int, db: Session = Depends(get_db)):
    deleted_producto = delete_product(db=db, producto_id=id)
    return deleted_producto

