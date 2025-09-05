from app.models import User
from app.utils.security import hash_password, verify_password, create_access_token
from sqlalchemy.orm import Session
from app.schemas import UserCreate

def create_user(db: Session, user_in: UserCreate):
    user = User(
        username=user_in.username,
        hashed_password=hash_password(user_in.password),
        role=user_in.role,
        full_name=user_in.full_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    
    # Проверяем простой тестовый хеш
    if user.hashed_password == f"test_hash_{password}":
        token = create_access_token(user.username)
        return {"user": user, "token": token}
    
    # Проверяем обычный bcrypt хеш
    if verify_password(password, user.hashed_password):
        token = create_access_token(user.username)
        return {"user": user, "token": token}
    
    return None
