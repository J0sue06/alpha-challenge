from fastapi import APIRouter, Depends
from src.utils.auth.security import decode_token
from src.services.users_service import create_user, get_users, get_user, update_user, delete_user
from src.models.schemas_models import UserCreate
from src.utils.db.dbinstance import get_db
from sqlalchemy.orm import Session

users_router = APIRouter()

@users_router.post('')
def create(user:UserCreate, db:Session=Depends(get_db)):
    newUser = create_user(db=db, user=user)
    return newUser

@users_router.get('')
def get(db:Session=Depends(get_db)):
    users = get_users(db=db)
    return users

@users_router.get('/{id}')
def getById(id: int, db:Session=Depends(get_db)):
    user = get_user(db=db, user_id=id)
    return user

@users_router.put('/{id}')
def updated(id: int, user:UserCreate, db:Session=Depends(get_db)):
    userUpdated = update_user(db=db, user_id=id, updated_data=user.model_dump())
    return userUpdated

@users_router.delete('/{id}')
def delete(id: int, db:Session=Depends(get_db)):
    user = delete_user(user_id=id, db=db)
    return user

@users_router.get('/profile/')
def profile(my_user: dict = Depends(decode_token)):
    return my_user