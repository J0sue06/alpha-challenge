from fastapi import FastAPI
from src.routes.index_router import include_routers
from src.middlewares.cors import add_cors_middleware 

app = FastAPI()

add_cors_middleware(app)

app.title = "API"

@app.get('/', tags=['about'])
def about():
    return { 'message': "API is running!" }

include_routers(app)

