
from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.utils.auth.security import verify_password
from src.services.users_service import get_user_by_email


def login(db: Session, dto: dict):
    user = get_user_by_email(db=db, user_email=dto.username)

    if not user or not verify_password(dto.password, user.password):
        raise HTTPException(status_code=404, detail="Incorrect email or password")
    
    return user