from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.exceptions import HTTPException
from typing import Annotated
from src.utils.auth.security import encode_token, verify_password
from src.services.users_service import get_user_by_email
from src.utils.db.dbinstance import get_db
from sqlalchemy.orm import Session
from src.services.login_service import login

login_router = APIRouter()
  
@login_router.post('')
def do_login(dto: Annotated[OAuth2PasswordRequestForm, Depends()], db:Session=Depends(get_db)):
    user = login(db=db, dto=dto)
    
    token = encode_token({
        "username": user.name,
        "email": user.email,
        "rol_id": user.rol_id,
        "rol_name": user.role.name
    })
    return { 'access_token': token }
