#!/usr/bin/env python3
"""
Создание тестовых пользователей через API
"""
import requests
import json

def create_user(username, password, role, full_name, email):
    """Создание пользователя через API"""
    url = "http://localhost:8000/auth/register"
    data = {
        "username": username,
        "password": password,
        "role": role,
        "full_name": full_name,
        "email": email
    }
    
    try:
        print(f"👤 Создаем пользователя: {username}")
        response = requests.post(url, json=data)
        
        if response.status_code == 200:
            print(f"✅ Пользователь {username} создан успешно!")
            return True
        else:
            print(f"❌ Ошибка создания {username}: {response.status_code}")
            print(f"📝 Ответ: {response.text}")
            return False
            
    except Exception as e:
        print(f"💥 Исключение при создании {username}: {e}")
        return False

def main():
    """Создание всех тестовых пользователей"""
    print("🚀 Создание тестовых пользователей через API...")
    
    users = [
        {
            "username": "manager",
            "password": "managerpass",
            "role": "manager",
            "full_name": "Менеджер Проектов",
            "email": "manager@test.com"
        },
        {
            "username": "engineer", 
            "password": "engineerpass",
            "role": "engineer",
            "full_name": "Инженер Строитель",
            "email": "engineer@test.com"
        },
        {
            "username": "observer",
            "password": "observerpass", 
            "role": "observer",
            "full_name": "Наблюдатель",
            "email": "observer@test.com"
        }
    ]
    
    success_count = 0
    for user_data in users:
        if create_user(**user_data):
            success_count += 1
    
    print(f"\n📊 Создано пользователей: {success_count}/{len(users)}")
    
    if success_count == len(users):
        print("🎉 Все пользователи созданы успешно!")
        print("\n🔑 Данные для входа:")
        print("👤 manager / managerpass (Менеджер)")
        print("👤 engineer / engineerpass (Инженер)")  
        print("👤 observer / observerpass (Наблюдатель)")
    else:
        print("⚠️ Некоторые пользователи не были созданы")

if __name__ == "__main__":
    main()
