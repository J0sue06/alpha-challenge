from typing import Annotated  
from fastapi import Depends, HTTPException, Request, status
from src.models.schemas_models import User  
from src.utils.auth.security import decode_token

class RoleChecker:  
  def __init__(self, allowed_roles):  
    self.allowed_roles = allowed_roles  
  
  def __call__(self, user: Annotated[User, Depends(decode_token)], request: Request):
    if request.url.path == "/users/profile/" and user["rol_name"] == "user":
      return True
    if user["rol_name"] in self.allowed_roles:  
      return True  
    raise HTTPException(  
status_code=status.HTTP_401_UNAUTHORIZED,   
detail="You don't have enough permissions")  