from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.deps import get_db, get_current_user
from app.schemas import ProjectCreate, ProjectOut
from app.models import Project, RoleEnum

router = APIRouter()

@router.post("/", response_model=ProjectOut)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db), current=Depends(get_current_user)):
    # manager required
    if current.role != RoleEnum.manager:
        raise HTTPException(status_code=403, detail="Forbidden")
    project = Project(name=payload.name, description=payload.description)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/", response_model=List[ProjectOut])
def list_projects(db: Session = Depends(get_db), current=Depends(get_current_user)):
    projects = db.query(Project).all()
    return projects
