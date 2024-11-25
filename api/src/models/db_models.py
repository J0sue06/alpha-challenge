from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, DateTime, Time
from sqlalchemy.orm import relationship

from src.utils.db.database import Base

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)  
    description = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)

    # Relación inversa con User
    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255), index=True)
    is_active = Column(Boolean, default=True)
    
    # Relación con Role
    rol_id = Column(Integer, ForeignKey("roles.id"))
    role = relationship("Role", back_populates="users")

class DayOff(Base):
    __tablename__ = "dayOff"
    id = Column(Integer, primary_key=True, index=True)
    day = Column(Date, index=True)
    is_active = Column(Boolean, default=True)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)  # Cambiado 'nombre' a 'name'
    days_less_equal_operating_hour = Column(Integer)  # Cambiado 'dias_menor_igual_hora_operativa' a 'days_less_equal_operating_hour'
    days_greater_operating_hour = Column(Integer)  # Cambiado 'dias_mayor_hora_operativa' a 'days_greater_operating_hour'
    days_less_equal_operating_hour_reinvestment = Column(Integer)  # Cambiado 'dias_menor_igual_hora_operativa_reinversion' a 'days_less_equal_operating_hour_reinvestment'
    days_greater_operating_hour_reinvestment = Column(Integer)  # Cambiado 'dias_mayor_hora_operativa_reinversion' a 'days_greater_operating_hour_reinvestment'
    operating_hour = Column(Time)  # Cambiado 'hora_operativa' a 'operating_hour'
    is_active = Column(Boolean, default=True)

class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)
   
    creation_date = Column(DateTime)  # Cambiado 'fecha_creacion' a 'creation_date'
    term = Column(Integer)  # Cambiado 'plazo' a 'term'
    start_date = Column(DateTime)  # Cambiado 'fecha_inicio' a 'start_date'
    end_date = Column(DateTime)  # Cambiado 'fecha_fin' a 'end_date'
    actual_term = Column(Integer)  # Cambiado 'plazo_real' a 'actual_term'
    is_active = Column(Boolean, default=True)

    # Relationship with Product
    product_id = Column(Integer, ForeignKey("products.id"))
    products = relationship("Product", back_populates="investments")

# Back reference to Investment from Product
Product.investments = relationship("Investment", back_populates="products", cascade="all, delete-orphan")
