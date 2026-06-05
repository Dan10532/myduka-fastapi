from typing import Annotated, List

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from db import get_db
from jsonmap import ProductGetMap, ProductPostMap
from models import Product
from myjwt import get_current_user


router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=List[ProductGetMap])
def get_products(
    db: Annotated[Session, Depends(get_db)],
    current_user=Depends(get_current_user),
):
    products = select(Product)
    return db.scalars(products).all()


@router.post("", response_model=ProductGetMap)
def create_product(
    product: ProductPostMap,
    db: Annotated[Session, Depends(get_db)],
    current_user=Depends(get_current_user),
):
    new_product = Product(
        name=product.name,
        buying_price=product.buying_price,
        selling_price=product.selling_price,
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product
