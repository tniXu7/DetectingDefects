#!/usr/bin/env python3
"""
Простой тест API для проверки работы аутентификации
"""
import requests
import json

def test_login():
    """Тест входа в систему"""
    url = "http://localhost:8000/auth/token"
    data = {
        'username': 'manager',
        'password': 'admin123'
    }
    
    try:
        print("🔐 Тестируем вход manager/admin123...")
        response = requests.post(url, data=data)
        
        print(f"📊 Статус: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Успешный вход!")
            print(f"🎫 Токен: {result.get('access_token', 'N/A')[:50]}...")
            print(f"🔖 Тип токена: {result.get('token_type', 'N/A')}")
            return result.get('access_token')
        else:
            print("❌ Ошибка входа!")
            print(f"📝 Ответ: {response.text}")
            return None
            
    except Exception as e:
        print(f"💥 Исключение: {e}")
        return None

def test_user_info(token):
    """Тест получения информации о пользователе"""
    if not token:
        print("⚠️ Нет токена для теста")
        return
        
    url = "http://localhost:8000/users/me"
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    try:
        print("\n👤 Получаем информацию о пользователе...")
        response = requests.get(url, headers=headers)
        
        print(f"📊 Статус: {response.status_code}")
        
        if response.status_code == 200:
            user_info = response.json()
            print("✅ Информация получена!")
            print(f"👤 Пользователь: {user_info.get('username')}")
            print(f"🎭 Роль: {user_info.get('role')}")
            print(f"📧 Email: {user_info.get('email', 'N/A')}")
            print(f"📛 Полное имя: {user_info.get('full_name', 'N/A')}")
        else:
            print("❌ Ошибка получения информации!")
            print(f"📝 Ответ: {response.text}")
            
    except Exception as e:
        print(f"💥 Исключение: {e}")

if __name__ == "__main__":
    print("🚀 Тестирование API аутентификации...")
    token = test_login()
    test_user_info(token)
    print("\n✨ Тест завершен!")
