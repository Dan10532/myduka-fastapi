
print("MAIN APP STARTED")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from db import engine
from models import Base

# ===============================
# ROUTERS
# ===============================
from routers.auth import router as auth_router
from routers.dashboard import router as dashboard_router
from routers.mpesa import router as mpesa_router
from routers.products import router as products_router
from routers.purchases import router as purchases_router
from routers.sales import router as sales_router


# ===============================
# APP INIT
# ===============================
app = FastAPI(title=settings.app_name)


# ===============================
# CORS CONFIG
# ===============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===============================
# DATABASE INIT
# ===============================
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)


# ===============================
# ROOT ENDPOINT
# ===============================
@app.get("/")
def root():
    return {"message": f"{settings.app_name} running"}


# ===============================
# REGISTER ROUTERS
# ===============================
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(sales_router)
app.include_router(purchases_router)
app.include_router(dashboard_router)
app.include_router(mpesa_router)