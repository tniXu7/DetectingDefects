#!/usr/bin/env python3
"""
Скрипт для создания тестовых пользователей
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import User, RoleEnum
from app.utils.security import get_password_hash
import datetime

# Конфигурация базы данных
DATABASE_URL = "postgresql://postgres:postgres@localhost:5433/construction_defects"

# Создаем подключение
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_test_users():
    """Создание тестовых пользователей"""
    db = SessionLocal()
    
    try:
        # Создаем таблицы если их нет
        Base.metadata.create_all(bind=engine)
        
        # Тестовые пользователи
        test_users = [
            {
                "username": "manager",
                "password": "managerpass",
                "role": RoleEnum.manager,
                "full_name": "Менеджер Проектов",
                "email": "manager@example.com"
            },
            {
                "username": "engineer",
                "password": "engineerpass", 
                "role": RoleEnum.engineer,
                "full_name": "Инженер Строитель",
                "email": "engineer@example.com"
            },
            {
                "username": "observer",
                "password": "observerpass",
                "role": RoleEnum.observer,
                "full_name": "Наблюдатель",
                "email": "observer@example.com"
            }
        ]
        
        for user_data in test_users:
            # Проверяем, существует ли пользователь
            existing_user = db.query(User).filter(User.username == user_data["username"]).first()
            
            if not existing_user:
                # Создаем нового пользователя
                hashed_password = get_password_hash(user_data["password"])
                
                user = User(
                    username=user_data["username"],
                    hashed_password=hashed_password,
                    role=user_data["role"],
                    full_name=user_data["full_name"],
                    email=user_data["email"],
                    is_active=True,
                    created_at=datetime.datetime.utcnow()
                )
                
                db.add(user)
                print(f"✅ Создан пользователь: {user_data['username']} ({user_data['role']})")
            else:
                print(f"⚠️  Пользователь уже существует: {user_data['username']}")
        
        db.commit()
        print("\n🎉 Все тестовые пользователи созданы!")
        
    except Exception as e:
        print(f"❌ Ошибка создания пользователей: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Создание тестовых пользователей...")
    create_test_users()
