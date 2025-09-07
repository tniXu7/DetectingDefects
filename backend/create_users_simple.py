#!/usr/bin/env python3
"""
Простое создание пользователей в базе данных
"""
import sys
import os
sys.path.append('/app')

from app.database import SessionLocal
from app.models import User, RoleEnum
import datetime

def create_users():
    """Создание пользователей"""
    db = SessionLocal()
    
    try:
        # Тестовые пользователи с простыми паролями
        users_data = [
            {
                'username': 'manager',
                'password': 'admin123',
                'role': RoleEnum.manager,
                'full_name': 'Менеджер',
                'email': 'manager@test.com'
            },
            {
                'username': 'engineer',
                'password': 'user123',
                'role': RoleEnum.engineer,
                'full_name': 'Инженер',
                'email': 'engineer@test.com'
            },
            {
                'username': 'observer',
                'password': 'view123',
                'role': RoleEnum.observer,
                'full_name': 'Наблюдатель',
                'email': 'observer@test.com'
            }
        ]
        
        for user_data in users_data:
            # Проверяем, существует ли пользователь
            existing = db.query(User).filter(User.username == user_data['username']).first()
            
            if not existing:
                # Создаем пользователя с простым хешем для тестирования
                # В реальном проекте нужно использовать правильный хеш
                user = User(
                    username=user_data['username'],
                    hashed_password=f"test_hash_{user_data['password']}",  # Простой тестовый хеш
                    role=user_data['role'],
                    full_name=user_data['full_name'],
                    email=user_data['email'],
                    is_active=True,
                    created_at=datetime.datetime.utcnow()
                )
                db.add(user)
                print(f"✅ Создан пользователь: {user_data['username']}")
            else:
                print(f"⚠️ Пользователь уже существует: {user_data['username']}")
        
        db.commit()
        print("🎉 Все пользователи созданы!")
        
    except Exception as e:
        print(f"❌ Ошибка создания пользователей: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Создание тестовых пользователей...")
    create_users()
