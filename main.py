# =========================
# Standard Library Imports
# =========================
from datetime import datetime, timedelta
from typing import Annotated, List

# =========================
# FastAPI Imports
# =========================
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import (
    OAuth2PasswordBearer,
    OAuth2PasswordRequestForm,
    SecurityScopes,
    HTTPBearer,
    HTTPAuthorizationCredentials,
)
from fastapi.middleware.cors import CORSMiddleware

# =========================
# SQLAlchemy Imports
# =========================
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

# =========================
# Local App Imports
# =========================
from models import (Base, engine, SessionLocal, Product, Sale, Purchase, User,
                    )

from jsonmap import (
    ProductGetMap, ProductPostMap, PurchaseGetMap, PurchasePostMap, SaleGetMap, SalePostMap, SalesPerProduct,
    UserPostRegister, UserPostLogin, Token,
)

from myjwt import (create_access_token,
                   authenticate_user, get_current_user, get_password_hash, verify_password,
                   )

# =========================
# App & Security Setup
# =========================
app = FastAPI()
bearer_scheme = HTTPBearer()


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Startup Event
# =========================


@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)


# =========================
# Root Endpoint
# =========================
@app.get("/")
def read_root():
    return {"Duka FastAPI": "Version 1.0"}


# =========================
# Authentication Routes
# =========================
@app.post("/token", tags=["auth"])
def login_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.email, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user.email)
    return {
        "access_token": token,
        "token_type": "bearer",
    }


@app.post("/register", response_model=Token)
def register_user(user: UserPostRegister):
    if SessionLocal.execute(
        select(User).where(User.email == user.email)
    ).scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_password = get_password_hash(user.password)

    model_obj = User(
        email=user.email,
        fullname=user.fullname,
        password=hashed_password,
    )

    SessionLocal.add(model_obj)
    SessionLocal.commit()

    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email, "scope": ""},
        expires_delta=access_token_expires,
    )

    return Token(access_token=access_token, token_type="bearer")


@app.post("/login", response_model=Token)
def login_user(user: UserPostLogin):
    user = authenticate_user(user.email, user.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=30),
    )

    return Token(access_token=access_token, token_type="bearer")


# =========================
# Product Routes
# =========================
@app.get("/products", response_model=List[ProductGetMap])
def get_products(
    current_user: Annotated[User, Depends(get_current_user)],
):
    products = select(Product)
    return SessionLocal.scalars(products)


@app.post("/products", response_model=ProductGetMap)
def create_product(json_product_obj: ProductPostMap):
    model_obj = Product(
        name=json_product_obj.name,
        buying_price=json_product_obj.buying_price,
        selling_price=json_product_obj.selling_price,
    )
    SessionLocal.add(model_obj)
    SessionLocal.commit()
    return model_obj


# =========================
# Sales Routes
# =========================
@app.get("/sales", response_model=List[SaleGetMap])
def get_sales(
    current_user: Annotated[User, Depends(get_current_user)],
):
    sales = select(Sale).options(selectinload(Sale.product))
    return SessionLocal.scalars(sales).all()


@app.post("/sales", response_model=SaleGetMap)
def create_sale(json_sale_obj: SalePostMap):
    model_obj = Sale(
        product_id=json_sale_obj.product_id,
        quantity=json_sale_obj.quantity,
    )
    SessionLocal.add(model_obj)
    SessionLocal.commit()
    return model_obj


@app.put("/sales/{sale_id}", response_model=SaleGetMap)
def update_sale(sale_id: int, sale: SalePostMap):
    db_sale = SessionLocal.get(Sale, sale_id)
    if not db_sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    db_sale.product_id = sale.product_id
    db_sale.quantity = sale.quantity

    SessionLocal.commit()
    return db_sale


@app.delete("/sales/{sale_id}")
def delete_sale(sale_id: int):
    sale = SessionLocal.get(Sale, sale_id)
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    SessionLocal.delete(sale)
    SessionLocal.commit()
    return {"message": "Sale deleted successfully"}




# =========================
# Purchase Routes
# =========================
@app.get("/purchases", response_model=List[PurchaseGetMap])
def get_purchases(
    current_user: Annotated[User, Depends(get_current_user)],
):
    purchases = select(Purchase)
    return SessionLocal.scalars(purchases).all()


@app.post("/purchases", response_model=PurchaseGetMap)
def create_purchase(json_purchase_obj: PurchasePostMap):
    model_obj = Purchase(
        product_id=json_purchase_obj.product_id,
        stock_quantity=json_purchase_obj.stock_quantity,
        created_at=datetime.utcnow(),
    )
    SessionLocal.add(model_obj)
    SessionLocal.commit()
    return model_obj


@app.delete("/purchases/{product_id}")
def delete_purchase(product_id: int):
    purchase = SessionLocal.get(Purchase, product_id)
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    SessionLocal.delete(purchase)
    SessionLocal.commit()
    return {"message": "Purchase deleted successfully"}


@app.put("/purchases/{purchase_id}", response_model=PurchaseGetMap)
def update_purchase(purchase_id: int, purchase: PurchasePostMap):
    db_purchase = SessionLocal.get(Purchase, purchase_id)
    if not db_purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    db_purchase.product_id = purchase.product_id
    db_purchase.stock_quantity = purchase.stock_quantity

    SessionLocal.commit()
    return db_purchase

# =========================
# Dashboard Routes
# =========================


@app.get("/dashboard/spp", response_model=List[SalesPerProduct])
def get_sales_per_product(
    current_user: Annotated[User, Depends(get_current_user)],
):
    sales_data = SessionLocal.execute(
        select(
            Sale.product_id,
            Product.name.label("product_name"),
            func.sum(Sale.quantity).label("total_quantity_sold"),
            func.sum(Sale.quantity *
                     Product.selling_price).label("total_sales_amount"),
        )
        .join(Product, Sale.product_id == Product.id)
        .group_by(Sale.product_id, Product.name)
    ).all()

    data = [r.total_quantity_sold for r in sales_data]
    labels = [r.product_name for r in sales_data]

    return [
        SalesPerProduct(
            data=data,
            labels=labels
           
        )
      
    ]
