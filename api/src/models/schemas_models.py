from pydantic import BaseModel
from datetime import date, time, datetime

# Modelo base para los Roles
class RoleBase(BaseModel):
    name: str
    description: str | None = None

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int
    is_active: bool
    
    class Config:
        orm_mode = True

# Modelo base para los Usuarios
class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    rol_id: int | None = None
    password: str
    newpassword: str | None = None

class User(UserBase):
    id: int
    is_active: bool
    role: Role | None = None  # Incluye la relación completa con rol
    
    class Config:
        orm_mode = True

# Modelo base para DayOff
class DayOffBase(BaseModel):
    day: date

class DayOffCreate(DayOffBase):
    pass

class DayOff(DayOffBase):
    id: int
    is_active: bool
    
    class Config:
        orm_mode = True

# Base model for Product
class ProductBase(BaseModel):
    name: str
    days_less_equal_operating_hour: int
    days_greater_operating_hour: int
    days_less_equal_operating_hour_reinvestment: int
    days_greater_operating_hour_reinvestment: int
    operating_hour: time

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    is_active: bool
    
    class Config:
        orm_mode = True

# Base model for Investment
class InvestmentBase(BaseModel):
    product_id: int
    creation_date: datetime
    term: int
    reinvestment: bool

class InvestmentCreate(InvestmentBase):
    pass

class Investment(InvestmentBase):
    id: int
    start_date: datetime
    end_date: datetime
    actual_term: int
    is_active: bool

    class Config:
        orm_mode = True
