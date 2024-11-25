from fastapi import APIRouter, Depends
from src.services.role_service import create_rol, get_roles, get_rol, delete_rol
from src.models.schemas_models import RoleCreate
from sqlalchemy.orm import Session
from src.utils.db.dbinstance import get_db

roles_router = APIRouter()

@roles_router.post('')
def create(rol: RoleCreate, db:Session=Depends(get_db)):
    newRole= create_rol(db=db, role=rol)
    return newRole

@roles_router.get('')
def get(db:Session=Depends(get_db)):
    roles = get_roles(db=db)
    return roles

@roles_router.get('/{id}')
def get(id:int, db:Session=Depends(get_db)):
    rol = get_rol(db=db, rol_id=id)
    return rol

@roles_router.delete('/{id}')
def delete(id: int, db:Session=Depends(get_db)):
    rol = delete_rol(db=db, rol_id=id)
    return rol