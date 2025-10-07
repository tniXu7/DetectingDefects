from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.deps import get_db, get_current_user
from app.schemas import UserOut, UserCreate, UserUpdate
from app.services.auth_service import create_user
from app.models import RoleEnum, User
from pydantic import BaseModel

router = APIRouter()

@router.get("/", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db), current=Depends(get_current_user)):
    # only managers and admins can view full list
    if current.role not in [RoleEnum.manager, RoleEnum.admin]:
        raise HTTPException(status_code=403, detail="Forbidden")
    users = db.query(User).all()
    return users

@router.post("/", response_model=UserOut)
def create_new_user(payload: UserCreate, db: Session = Depends(get_db), current=Depends(get_current_user)):
    # Managers and admins can create users
    if current.role not in [RoleEnum.manager, RoleEnum.admin]:
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

class RoleUpdatePayload(BaseModel):
    role: RoleEnum


@router.put("/{user_id}/role", response_model=UserOut)
def update_user_role(
    user_id: int,
    payload: RoleUpdatePayload,
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    # Только админы могут изменять роли
    if current.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Только администраторы могут изменять роли")
    
    # Находим пользователя
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    # Нельзя изменить роль самому себе
    if user.id == current.id:
        raise HTTPException(status_code=400, detail="Нельзя изменить роль самому себе")
    
    # Обновляем роль
    user.role = payload.role
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current=Depends(get_current_user)):
    # Только админы могут удалять пользователей
    if current.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Только администраторы могут удалять пользователей")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    # Защита от удаления самого себя
    if user.id == current.id:
        raise HTTPException(status_code=400, detail="Нельзя удалить самого себя")

    # Запрещаем удалять любых пользователей с ролью admin
    if user.role == RoleEnum.admin:
        raise HTTPException(status_code=400, detail="Нельзя удалять пользователей с ролью admin")

    db.delete(user)
    db.commit()
    return {"status": "ok"}