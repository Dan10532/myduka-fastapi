# ===============================
# IMPORTS
# ===============================
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List


# ===============================
# USER SCHEMAS
# ===============================
class UserPostRegister(BaseModel):
    fullname: str
    email: EmailStr
    password: str = Field(min_length=6)


class UserPostLogin(BaseModel):
    email: EmailStr
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
        orm_mode = True


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


class PurchaseGetMap(BaseModel):
    id: int
    product_id: int
    stock_quantity: int
    created_at: datetime

    class Config:
        orm_mode = True


# ===============================
# DASHBOARD SCHEMAS
# ===============================
class SalesPerProduct(BaseModel):
    data: List[int]
    labels: List[str]


class StockPerProduct(BaseModel):
    product_id: int
    product_name: str
    remaining_stock: int


# ===============================
# PROFIT SCHEMAS
# ===============================
class ProfitPerProduct(BaseModel):
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
# AUTH / TOKEN SCHEMAS
# ===============================
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    sub: Optional[str] = None   # MUST match JWT payload
    scopes: Optional[str] = None