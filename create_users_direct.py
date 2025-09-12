#!/usr/bin/env python3
"""
Создание пользователей напрямую в базе данных
"""
import requests
import json

def test_api():
    """Тестируем API напрямую"""
    print("🔍 Тестируем API...")
    
    # Проверяем доступность API
    try:
        response = requests.get("http://localhost:8000/")
        print(f"📊 API статус: {response.status_code}")
        if response.status_code == 200:
            print("✅ API работает!")
            return True
        else:
            print("❌ API не отвечает")
            return False
    except Exception as e:
        print(f"💥 Ошибка подключения к API: {e}")
        return False

def create_user_via_curl():
    """Создание пользователя через curl-подобный запрос"""
    import subprocess
    import sys
    
    users = [
        {
            "username": "manager",
            "password": "admin123",
            "role": "manager",
            "full_name": "Менеджер",
            "email": "manager@test.com"
        }
    ]
    
    for user in users:
        print(f"👤 Создаем пользователя: {user['username']}")
        
        # Используем PowerShell для отправки запроса
        cmd = f'''
        $body = @{{
            username = "{user['username']}"
            password = "{user['password']}"
            role = "{user['role']}"
            full_name = "{user['full_name']}"
            email = "{user['email']}"
        }} | ConvertTo-Json
        
        try {{
            $response = Invoke-RestMethod -Uri "http://localhost:8000/auth/register" -Method POST -ContentType "application/json" -Body $body
            Write-Host "✅ Пользователь {user['username']} создан: $response"
        }} catch {{
            Write-Host "❌ Ошибка создания {user['username']}: $($_.Exception.Message)"
        }}
        '''
        
        try:
            result = subprocess.run(["powershell", "-Command", cmd], 
                                  capture_output=True, text=True, shell=True)
            print(result.stdout)
            if result.stderr:
                print(f"Ошибка: {result.stderr}")
        except Exception as e:
            print(f"💥 Ошибка выполнения: {e}")

def main():
    print("🚀 Создание пользователей напрямую...")
    
    if test_api():
        create_user_via_curl()
    else:
        print("❌ API недоступен")

if __name__ == "__main__":
    main()
