from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.deps import get_db, get_current_user
from app.schemas import UserOut, UserCreate, UserUpdate
from app.services.auth_service import create_user
from app.models import RoleEnum

router = APIRouter()

@router.get("/", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), current=Depends(get_current_user)):
    # only managers can view full list
    if current.role != RoleEnum.manager:
        raise HTTPException(status_code=403, detail="Forbidden")
    users = db.query(current.__class__).all()
    return users

@router.post("/", response_model=UserOut)
def create_new_user(payload: UserCreate, db: Session = Depends(get_db), current=Depends(get_current_user)):
    if current.role != RoleEnum.manager:
        raise HTTPException(status_code=403, detail="Forbidden")
    user = create_user(db, payload)
    return user

@router.get("/me", response_model=UserOut)
def get_current_user_info(current=Depends(get_current_user)):
    return current

@router.put("/me", response_model=UserOut)
def update_current_user_info(
    payload: UserUpdate, 
    db: Session = Depends(get_db), 
    current=Depends(get_current_user)
):
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(current, field, value)
    db.commit()
    db.refresh(current)
    return current