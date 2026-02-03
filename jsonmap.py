from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# ===============================
# USER SCHEMAS
# ===============================
class UserPostRegister(BaseModel):
    email: str
    fullname: str
    password: str

class UserPostLogin(BaseModel):
    email: str
    password: str

# ===============================
# PRODUCT SCHEMAS
# ===============================
class ProductPostMap(BaseModel):
    name: str
    buying_price: float
    selling_price: float

class ProductGetMap(ProductPostMap):
    id: int

    class Config:
        orm_mode = True  # This allows returning SQLAlchemy models directly

# ===============================
# SALE SCHEMAS
# ===============================
class SalePostMap(BaseModel):
    product_id: int
    quantity: int

class SaleGetMap(SalePostMap):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# ===============================
# PURCHASE SCHEMAS
# ===============================
class PurchasePostMap(BaseModel):
    product_id: int
    quantity: int

class PurchaseGetMap(PurchasePostMap):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# ===============================
# DASHBOARD SCHEMAS
# ===============================
class SalesPerProduct(BaseModel):
    product_id: int
    product_name: str
    total_quantity_sold: int
    total_sales_amount: float

class StockPerProduct(BaseModel):
    product_id: int
    product_name: str
    remaining_stock: int

# ===============================
# TOKEN SCHEMAS
# ===============================
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    scopes: Optional[str] = None
