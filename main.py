# =========================
# STANDARD LIBRARIES
# =========================
from datetime import datetime, timedelta
from typing import List

# =========================
# FASTAPI
# =========================
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

# =========================
# SQLALCHEMY
# =========================
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

# =========================
# LOCAL IMPORTS
# =========================
from models import Base, engine, SessionLocal, Product, Sale, Purchase, User

from jsonmap import (
    ProductGetMap, ProductPostMap,
    PurchaseGetMap, PurchasePostMap,
    SaleGetMap, SalePostMap,
    SalesPerProduct,
    UserPostRegister, UserPostLogin,
    Token
)

from mpesa import make_stk_push
from myjwt import (
    create_access_token,
    authenticate_user,
    get_current_user,
    get_password_hash,
)

# =========================
# APP SETUP
# =========================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# STARTUP
# =========================
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {"message": "Duka API running 🚀"}

# =========================
# AUTH ROUTES
# =========================
@app.post("/token", response_model=Token, tags=["auth"])
def login_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=30),
    )

    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/login", response_model=Token)
def login_user(user: UserPostLogin):
    db_user = authenticate_user(user.email, user.password)

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        data={"sub": db_user.email},
        expires_delta=timedelta(minutes=30),
    )

    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/register", response_model=Token)
def register_user(user: UserPostRegister):
    existing_user = SessionLocal.execute(
        select(User).where(User.email == user.email)
    ).scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    new_user = User(
        fullname=user.fullname,
        email=user.email,
        password=get_password_hash(user.password),
    )

    SessionLocal.add(new_user)
    SessionLocal.commit()

    access_token = create_access_token(
        data={"sub": new_user.email},
        expires_delta=timedelta(minutes=30),
    )

    return {"access_token": access_token, "token_type": "bearer"}


# =========================
# PRODUCT ROUTES
# =========================
@app.get("/products", response_model=List[ProductGetMap])
def get_products():
    products = select(Product)
    return SessionLocal.scalars(products).all()


@app.post("/products", response_model=ProductGetMap)
def create_product(product: ProductPostMap):
    new_product = Product(
        name=product.name,
        buying_price=product.buying_price,
        selling_price=product.selling_price,
    )

    SessionLocal.add(new_product)
    SessionLocal.commit()
    return new_product


# =========================
# SALES ROUTES
# =========================
@app.get("/sales", response_model=List[SaleGetMap])
def get_sales(current_user: User = Depends(get_current_user)):
    sales = select(Sale).options(selectinload(Sale.product))
    return SessionLocal.scalars(sales).all()


@app.post("/sales", response_model=SaleGetMap)
def create_sale(sale: SalePostMap):
    new_sale = Sale(
        product_id=sale.product_id,
        quantity=sale.quantity,
        created_at=datetime.utcnow(),
    )

    SessionLocal.add(new_sale)
    SessionLocal.commit()
    return new_sale


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
    return {"message": "Sale deleted"}


# =========================
# PURCHASE ROUTES
# =========================
@app.get("/purchases", response_model=List[PurchaseGetMap])
def get_purchases(current_user: User = Depends(get_current_user)):
    purchases = select(Purchase)
    return SessionLocal.scalars(purchases).all()


@app.post("/purchases", response_model=PurchaseGetMap)
def create_purchase(purchase: PurchasePostMap):
    new_purchase = Purchase(
        product_id=purchase.product_id,
        stock_quantity=purchase.stock_quantity,
        created_at=datetime.utcnow(),
    )

    SessionLocal.add(new_purchase)
    SessionLocal.commit()
    return new_purchase


@app.put("/purchases/{purchase_id}", response_model=PurchaseGetMap)
def update_purchase(purchase_id: int, purchase: PurchasePostMap):
    db_purchase = SessionLocal.get(Purchase, purchase_id)

    if not db_purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    db_purchase.product_id = purchase.product_id
    db_purchase.stock_quantity = purchase.stock_quantity

    SessionLocal.commit()
    return db_purchase


@app.delete("/purchases/{purchase_id}")
def delete_purchase(purchase_id: int):
    purchase = SessionLocal.get(Purchase, purchase_id)

    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")

    SessionLocal.delete(purchase)
    SessionLocal.commit()
    return {"message": "Purchase deleted"}


# =========================
# DASHBOARD
# =========================
@app.get("/dashboard/spp", response_model=List[SalesPerProduct])
def sales_per_product(current_user: User = Depends(get_current_user)):
    results = SessionLocal.execute(
        select(
            Sale.product_id,
            Product.name,
            func.sum(Sale.quantity),
        )
        .join(Product)
        .group_by(Sale.product_id, Product.name)
    ).all()

    data = [r[2] for r in results]
    labels = [r[1] for r in results]

    return [SalesPerProduct(data=data, labels=labels)]

app.post("/stk-push")
def stk_push(payload: dict):        
    try:
        response_data = make_stk_push(payload)
        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
app.post("/stk_call_back")
def stk_call_back(payload: dict):
    print("STK Callback received:", payload)
    return {"message": "Callback received"}