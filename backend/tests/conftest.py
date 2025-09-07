import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
from app import models
from app.utils.security import hash_password

# Use a test sqlite DB file
TEST_DB = "sqlite:///./test.db"

# Ensure database created
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)

@pytest.fixture(scope="session")
def test_client():
    return client

@pytest.fixture(autouse=True)
def seed_db():
    db = SessionLocal()
    # clean tables
    db.query(models.Defect).delete()
    db.query(models.Project).delete()
    db.query(models.User).delete()
    db.commit()
    # create manager and engineer and observer
    manager = models.User(username="manager", hashed_password=hash_password("managerpass"), role=models.RoleEnum.manager)
    engineer = models.User(username="engineer", hashed_password=hash_password("engineerpass"), role=models.RoleEnum.engineer)
    observer = models.User(username="observer", hashed_password=hash_password("observerpass"), role=models.RoleEnum.observer)
    db.add_all([manager, engineer, observer])
    db.commit()
    db.close()
    yield
