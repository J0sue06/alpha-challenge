from fastapi import Depends
from src.routes.login_router import login_router
from src.routes.user_router import users_router
from src.routes.roles_router import roles_router
from src.routes.day_off_router import dayOff_router
from src.routes.product_router import product_router
from src.routes.investment_router import investment_router
from src.utils.auth.role_check import RoleChecker

def include_routers(app):
    app.include_router(router=investment_router, prefix="/investment", tags=['investment'], dependencies=[Depends(RoleChecker(allowed_roles=["user", "admin"]))])
    app.include_router(router=product_router, prefix="/product", tags=['product'], dependencies=[Depends(RoleChecker(allowed_roles=["user", "admin"]))])
    app.include_router(router=dayOff_router, prefix="/day_off", tags=['day-off'], dependencies=[Depends(RoleChecker(allowed_roles=["admin"]))])
    app.include_router(router=users_router, prefix="/users", tags=['user'], dependencies=[Depends(RoleChecker(allowed_roles=["admin"]))])
    app.include_router(router=roles_router, prefix="/roles", tags=['roles'], dependencies=[Depends(RoleChecker(allowed_roles=["admin"]))])
    app.include_router(router=login_router, prefix="/login", tags=['oauth'])
