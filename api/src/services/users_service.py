from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from src.utils.auth.security import hash_password, verify_password
from src.models.db_models import User
from src.models.schemas_models import UserCreate

def get_user_by_email(db: Session, user_email: str):
    return db.query(User).filter((User.email == user_email) & (User.is_active)).first()

def get_user(db: Session, user_id: int):
    user = (
        db.query(User)
        .filter((User.id == user_id) & (User.is_active == True))
        .first()
    )
    if not user:
        raise HTTPException(status_code=400, detail="User not found")
    
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_active": user.is_active,
        "rol_id": user.rol_id,
    }

def get_users(db: Session, skip:int=0, limit:int=100):
    users = (
        db.query(User)
        .filter(User.is_active == True)
        .options(joinedload(User.role))
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "is_active": user.is_active,
            "rol_id": user.rol_id,
            "role": {
                "id": user.role.id,
                "name": user.role.name,
                "description": user.role.description,
                "is_active": user.role.is_active,
            } if user.role else None,
        }
        for user in users
    ]

def create_user(db: Session, user: UserCreate):
    _user = get_user_by_email(db=db, user_email=user.email)

    if _user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    _hashed_password = hash_password(password=user.password)
    
    db_user = User(email=user.email, name=user.name, rol_id=user.rol_id, password=_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

def update_user(db: Session, user_id: int, updated_data: UserCreate):
    user = get_user_by_email(db=db, user_email=updated_data["email"])
    
    if not user or not verify_password(updated_data["password"], user.password):
        raise HTTPException(status_code=404, detail="Incorrect email or password")

    _hashed_password = hash_password(password=updated_data["newpassword"])
    updated_data["password"] = _hashed_password

    updated_data.pop("newpassword", None)

    result = db.query(User).filter(User.id == user_id).update(updated_data)

    if result == 0:
        raise HTTPException(status_code=400, detail="User not found")

    db.commit()
    db_user = get_user(db=db, user_id=user_id)
    return db_user


def delete_user(db: Session, user_id: int):
    db_user = get_user(db=db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    db_user["is_active"] = False
    db.commit()
    db.refresh(db_user)
    return db_user