from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.deps import get_db
from app.services.auth_service import authenticate_user, create_user
from app.schemas import Token, UserCreate, UserOut

router = APIRouter()

@router.post("/token", response_model=Token, tags=["auth"])
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    auth = authenticate_user(db, form_data.username, form_data.password)
    if not auth:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    return {"access_token": auth["token"], "token_type": "bearer"}

@router.post("/register", response_model=UserOut, tags=["auth"])
def register(payload: UserCreate, db: Session = Depends(get_db)):
    user = create_user(db, payload)
    return user

@router.post("/create-test-users", tags=["auth"])
def create_test_users_endpoint(db: Session = Depends(get_db)):
    """Создание тестовых пользователей для разработки"""
    from app.models import User, RoleEnum
    import datetime
    
    test_users = [
        {"username": "manager", "password": "admin123", "role": RoleEnum.manager, "full_name": "Менеджер", "email": "manager@test.com"},
        {"username": "engineer", "password": "user123", "role": RoleEnum.engineer, "full_name": "Инженер", "email": "engineer@test.com"},
        {"username": "observer", "password": "view123", "role": RoleEnum.observer, "full_name": "Наблюдатель", "email": "observer@test.com"}
    ]
    
    created_users = []
    
    for user_data in test_users:
        # Проверяем, существует ли пользователь
        existing = db.query(User).filter(User.username == user_data["username"]).first()
        
        if not existing:
            # Создаем пользователя с простым хешем для тестирования
            user = User(
                username=user_data["username"],
                hashed_password=f"test_hash_{user_data['password']}",  # Простой тестовый хеш
                role=user_data["role"],
                full_name=user_data["full_name"],
                email=user_data["email"],
                is_active=True,
                created_at=datetime.datetime.utcnow()
            )
            db.add(user)
            created_users.append(user_data["username"])
    
    db.commit()
    
    return {
        "message": f"Создано пользователей: {len(created_users)}",
        "users": created_users
    }