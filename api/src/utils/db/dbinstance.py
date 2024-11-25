from .database import SessionLocal, engine
from src.models.db_models import Base

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try : 
        yield db
    finally:
        db.close()