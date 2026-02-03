from typing import List, Annotated
from datetime import timedelta

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, func

from models import (
    Base, engine, SessionLocal,
    Product, Sale, User, Purchase
)

from jsonmap import (
    ProductGetMap, ProductPostMap,
    SaleGetMap, SalePostMap,
    PurchaseGetMap, PurchasePostMap,
    UserPostRegister, UserPostLogin,
    SalesPerProduct, StockPerProduct,
    Token
)

from myjwt import (
    create_access_token,
    authenticate_user,
    get_password_hash,
    get_current_user
)

app = FastAPI(title="Duka FastAPI")

# =========================
# DATABASE DEPENDENCY
# =========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================
# STARTUP
# =========================
@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)

# =========================
# ROOT
# =========================
@app.get("/")
def read_root():
    return {"Duka FastAPI": "Version 1.0"}

# =========================
# AUTH
# =========================
@app.post("/register", response_model=Token)
def register_user(
    user: UserPostRegister,
    db: Session = Depends(get_db)
):
    existing_user = db.execute(
        select(User).where(User.email == user.email)
    ).scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = get_password_hash(user.password)
    model_obj = User(email=user.email, fullname=user.fullname, password=hashed_password)

    db.add(model_obj)
    db.commit()
    db.refresh(model_obj)

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=30)
    )

    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/login", response_model=Token)
def login_user(user: UserPostLogin):
    auth_user = authenticate_user(user.email, user.password)
    if not auth_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": auth_user.email},
        expires_delta=timedelta(minutes=30)
    )

    return {"access_token": access_token, "token_type": "bearer"}

# =========================
# PRODUCTS
# =========================
@app.get("/products", response_model=List[ProductGetMap])
def get_products(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return db.execute(select(Product)).scalars().all()

@app.post("/products", response_model=ProductGetMap)
def create_product(
    json_product_obj: ProductPostMap,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    model_obj = Product(**json_product_obj.model_dump())
    db.add(model_obj)
    db.commit()
    db.refresh(model_obj)
    return model_obj

# =========================
# SALES
# =========================
@app.get("/sales", response_model=List[SaleGetMap])
def get_sales(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return db.execute(
        select(Sale).options(selectinload(Sale.product))
    ).scalars().all()

@app.post("/sales", response_model=SaleGetMap)
def create_sale(
    json_sale_obj: SalePostMap,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    sale = Sale(**json_sale_obj.model_dump())
    db.add(sale)
    db.commit()
    db.refresh(sale)
    return sale

# =========================
# PURCHASES
# =========================
@app.get("/purchases", response_model=List[PurchaseGetMap])
def get_purchases(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return db.execute(
        select(Purchase).options(selectinload(Purchase.product))
    ).scalars().all()

@app.post("/purchases", response_model=PurchaseGetMap)
def create_purchase(
    json_purchase_obj: PurchasePostMap,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    purchase = Purchase(**json_purchase_obj.model_dump())
    db.add(purchase)
    db.commit()
    db.refresh(purchase)
    return purchase

# =========================
# DASHBOARD
# =========================
@app.get("/dashboard/sales-per-product", response_model=List[SalesPerProduct])
def sales_per_product(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    return (
        db.query(
            Product.id.label("product_id"),
            Product.name.label("product_name"),
            func.coalesce(func.sum(Sale.quantity), 0).label("total_quantity_sold"),
            func.coalesce(func.sum(Sale.quantity * Product.selling_price), 0).label("total_sales_amount"),
        )
        .outerjoin(Sale, Product.id == Sale.product_id)
        .group_by(Product.id)
        .all()
    )

@app.get("/dashboard/stock-per-product", response_model=List[StockPerProduct])
def stock_per_product(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    sales_sub = (
        db.query(Sale.product_id, func.sum(Sale.quantity).label("sold"))
        .group_by(Sale.product_id)
        .subquery()
    )

    purchase_sub = (
        db.query(Purchase.product_id, func.sum(Purchase.quantity).label("purchased"))
        .group_by(Purchase.product_id)
        .subquery()
    )

    return (
        db.query(
            Product.id.label("product_id"),
            Product.name.label("product_name"),
            (func.coalesce(purchase_sub.c.purchased, 0) - func.coalesce(sales_sub.c.sold, 0)).label("remaining_stock")
        )
        .outerjoin(sales_sub, Product.id == sales_sub.c.product_id)
        .outerjoin(purchase_sub, Product.id == purchase_sub.c.product_id)
        .all()
    )
