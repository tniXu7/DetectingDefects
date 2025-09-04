from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from app.deps import get_db, get_current_user
from app.schemas import DefectCreate, DefectOut, DefectUpdate
from app.models import Defect, Project, DefectStatus, RoleEnum
from app.utils.file_upload import save_upload

router = APIRouter()

@router.post("/", response_model=DefectOut)
def create_defect(payload: DefectCreate, db: Session = Depends(get_db), current=Depends(get_current_user)):
    # any authenticated user can create
    project = db.query(Project).filter(Project.id == payload.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    d = Defect(
        title=payload.title,
        description=payload.description,
        priority=payload.priority or 3,
        project_id=payload.project_id,
        assigned_to=payload.assigned_to,
        created_by=current.id,
    )
    db.add(d)
    db.commit()
    db.refresh(d)
    return d

@router.get("/", response_model=List[DefectOut])
def list_defects(db: Session = Depends(get_db),
                 status: Optional[DefectStatus] = Query(None),
                 project_id: Optional[int] = Query(None),
                 current=Depends(get_current_user)):
    q = db.query(Defect)
    if status:
        q = q.filter(Defect.status == status)
    if project_id:
        q = q.filter(Defect.project_id == project_id)
    return q.all()

@router.get("/{defect_id}", response_model=DefectOut)
def get_defect(defect_id: int, db: Session = Depends(get_db), current=Depends(get_current_user)):
    d = db.query(Defect).filter(Defect.id == defect_id).first()
    if not d:
        raise HTTPException(404, "Not found")
    return d

@router.put("/{defect_id}", response_model=DefectOut)
def update_defect(defect_id: int, payload: DefectUpdate, db: Session = Depends(get_db), current=Depends(get_current_user)):
    d = db.query(Defect).filter(Defect.id == defect_id).first()
    if not d:
        raise HTTPException(404, "Not found")
    # simple RBAC: engineers/managers can update
    if current.role not in (RoleEnum.manager, RoleEnum.engineer):
        raise HTTPException(403, "Forbidden")
    for field, val in payload.dict(exclude_unset=True).items():
        if field == "status" and isinstance(val, str):
            try:
                val = DefectStatus(val)
            except ValueError:
                raise HTTPException(422, "Invalid status")
        setattr(d, field, val)
    db.add(d)
    db.commit()
    db.refresh(d)
    return d

@router.post("/{defect_id}/attachments")
async def upload_attachment(defect_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), current=Depends(get_current_user)):
    d = db.query(Defect).filter(Defect.id == defect_id).first()
    if not d:
        raise HTTPException(404, "Not found")
    path = await save_upload(file)
    # For simplicity, just return path; in production you would store metadata in DB
    return {"path": path}
