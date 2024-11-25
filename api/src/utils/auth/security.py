from typing import Annotated
from fastapi import Depends, HTTPException
from jose import jwt
import bcrypt
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def encode_token(payload: dict) -> str:
    token = jwt.encode(payload, "secret_key", algorithm="HS256")
    return token

def decode_token(token: Annotated[str, Depends(oauth2_scheme)]) -> dict:
    data = jwt.decode(token, "secret_key", algorithms=["HS256"])
    if not data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return data

def verify_password(plain_password, hashed_password) -> bool:
    _response = verify_hash_password(password=plain_password,hashed=hashed_password)
    return _response

def hash_password(password: str) -> str:
    # Generar el salt y aplicar el hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed

def verify_hash_password(password: str, hashed: str) -> bool:
   # Verificar si el password coincide con el hash
   return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))