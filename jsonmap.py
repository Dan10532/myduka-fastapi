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
    stock_quantity: int
    created_at: datetime

class PurchaseGetMap(PurchasePostMap):
    id: int

# ===============================
# DASHBOARD SCHEMAS
# ===============================
class SalesPerProduct(BaseModel):
    data: list[int]
    labels: list[str]
   
   

class StockPerProduct(BaseModel):
    product_id: int
    product_name: str
    remaining_stock: int

# ===============================
# PROFIT SCHEMAS
# ===============================
    
class  ProfitPerProduct(BaseModel):
    product_id: int
    product_name: str
    total_profit: float

class ProfitPerDay(BaseModel):
    date: datetime
    total_profit: float

class ProfitPerProductPerDay(BaseModel):
    date: datetime
    product_id: int
    product_name: str
    total_profit: float

# ===============================
# TOKEN SCHEMAS
# ===============================
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    scopes: Optional[str] = None
