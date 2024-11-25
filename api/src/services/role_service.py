from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.models.db_models import Role
from src.models.schemas_models import RoleCreate

def get_rol_by_name(db: Session, name: str):
    return db.query(Role).filter((Role.name == name) & (Role.is_active)).first()

def get_rol(db: Session, rol_id: int):
    rol = db.query(Role).filter((Role.id == rol_id) & (Role.is_active)).first()

    if not rol:
        raise HTTPException(status_code=400, detail="Rol not found")
    
    return rol

def get_roles(db: Session, skip:int=0, limit:int=100):
    return db.query(Role).filter(Role.is_active).offset(skip).limit(limit).all()

def create_rol(db: Session, role: RoleCreate):
    _rol = get_rol_by_name(db=db, name=role.name)

    if _rol:
        raise HTTPException(status_code=400, detail="Rol already registered")
    
    db_role = Role(name=role.name, description=role.description)

    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def delete_rol(db: Session, rol_id: int):
    db_rol = get_rol(db=db, rol_id=rol_id)
    if not db_rol:
        raise HTTPException(status_code=400, detail="Rol not found")

    db_rol.is_active = False
    db.commit()
    db.refresh(db_rol)
    return db_rol