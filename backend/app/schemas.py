from pydantic import BaseModel, Field
from typing import Optional, List
import datetime
from app.models import RoleEnum, DefectStatus

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None
    role: RoleEnum = RoleEnum.observer

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None

class UserOut(UserBase):
    id: int
    email: Optional[str] = None
    is_active: bool
    created_at: datetime.datetime

    model_config = {
        "from_attributes": True
    }

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectOut(ProjectBase):
    id: int
    created_at: datetime.datetime
    model_config = {
        "from_attributes": True
    }

class DefectBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[int] = 3
    project_id: int
    assigned_to: Optional[int] = None

class DefectCreate(DefectBase):
    pass

class DefectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[int] = None
    status: Optional[DefectStatus] = None
    assigned_to: Optional[int] = None

class DefectOut(DefectBase):
    id: int
    status: DefectStatus
    created_at: datetime.datetime
    updated_at: datetime.datetime
    model_config = {
        "from_attributes": True
    }
