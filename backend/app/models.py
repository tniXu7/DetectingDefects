from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Enum, Boolean
from sqlalchemy.orm import relationship
from app.database import Base
import enum
import datetime

class RoleEnum(str, enum.Enum):
    admin = "admin"
    engineer = "engineer"
    manager = "manager"
    observer = "observer"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(128), unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.observer, nullable=False)
    full_name = Column(String(256), nullable=True)
    email = Column(String(256), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(256), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    defects = relationship("Defect", back_populates="project", cascade="all, delete-orphan")

class DefectStatus(str, enum.Enum):
    new = "new"
    in_progress = "in_progress"
    review = "review"
    closed = "closed"
    canceled = "canceled"

class Defect(Base):
    __tablename__ = "defects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(Integer, default=3)  # 1-high ... 5-low
    status = Column(Enum(DefectStatus), default=DefectStatus.new, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="defects")
    assignee = relationship("User", foreign_keys=[assigned_to])
    author = relationship("User", foreign_keys=[created_by])
