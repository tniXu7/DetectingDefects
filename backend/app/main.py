from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine, SessionLocal
from app.routers import auth, users, projects, defects, reports
from app.models import User, RoleEnum
from app.utils.security import hash_password
import datetime

# Create DB tables
Base.metadata.create_all(bind=engine)

# Create test users if they don't exist
def create_test_users():
    db = SessionLocal()
    try:
        # Check if any users exist
        user_count = db.query(User).count()
        if user_count == 0:
            # Create test users
            test_users = [
                {
                    'username': 'manager',
                    'password': 'managerpass',
                    'role': RoleEnum.manager,
                    'full_name': 'Менеджер Проектов',
                    'email': 'manager@test.com'
                },
                {
                    'username': 'engineer',
                    'password': 'engineerpass',
                    'role': RoleEnum.engineer,
                    'full_name': 'Инженер Строитель',
                    'email': 'engineer@test.com'
                },
                {
                    'username': 'observer',
                    'password': 'observerpass',
                    'role': RoleEnum.observer,
                    'full_name': 'Наблюдатель',
                    'email': 'observer@test.com'
                }
            ]
            
            for user_data in test_users:
                user = User(
                    username=user_data['username'],
                    hashed_password=hash_password(user_data['password']),
                    role=user_data['role'],
                    full_name=user_data['full_name'],
                    email=user_data['email'],
                    is_active=True,
                    created_at=datetime.datetime.utcnow()
                )
                db.add(user)
            
            db.commit()
            print("✅ Тестовые пользователи созданы!")
        else:
            print(f"ℹ️ Найдено {user_count} пользователей в базе данных")
    except Exception as e:
        print(f"❌ Ошибка создания пользователей: {e}")
        db.rollback()
    finally:
        db.close()

# Initialize test data - disabled due to password length issue
# create_test_users()

app = FastAPI(title="Construction Defects System")

# CORS for frontend dev and docker
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(users.router, prefix="/users")
app.include_router(projects.router, prefix="/projects")
app.include_router(defects.router, prefix="/defects")
app.include_router(reports.router, prefix="/reports")

@app.get("/")
def root():
    return {"ok": True, "service": "construction-defects-system"}
