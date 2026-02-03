from typing import List, Optional
from datetime import datetime
from sqlalchemy import String, ForeignKey, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

# ===============================
# DATABASE CONFIG
# ===============================
DATABASE_URL = "postgresql://postgres:Mdan10532@localhost:5432/flask_shop"

engine = create_engine(DATABASE_URL, echo=True)  # echo=True prints SQL queries

SessionLocal = Session(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ===============================
# BASE CLASS
# ===============================
class Base(DeclarativeBase):
    pass

# ===============================
# USER MODEL
# ===============================
class User(Base):
    __tablename__ = "fastapi_usersp"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    fullname: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    password: Mapped[str] = mapped_column(String(100), nullable=False)

# ===============================
# PRODUCT MODEL
# ===============================
class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    buying_price: Mapped[float] = mapped_column(nullable=False)
    selling_price: Mapped[float] = mapped_column(nullable=False)

    # Relationship to sales and purchases
    sales: Mapped[List["Sale"]] = relationship(back_populates="product", cascade="all, delete-orphan")
    purchases: Mapped[List["Purchase"]] = relationship(back_populates="product", cascade="all, delete-orphan")

# ===============================
# SALE MODEL
# ===============================
class Sale(Base):
    __tablename__ = "sales"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    quantity: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    product: Mapped["Product"] = relationship(back_populates="sales")

# ===============================
# PURCHASE MODEL
# ===============================
class Purchase(Base):
    __tablename__ = "purchases"

    id: Mapped[int] = mapped_column(primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"))
    quantity: Mapped[int] = mapped_column(nullable=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    product: Mapped["Product"] = relationship(back_populates="purchases")
