from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.deps import get_db, get_current_user
from app.services.report_service import defects_to_csv

router = APIRouter()

@router.get("/defects/csv")
def export_defects_csv(project_id: int = None, db: Session = Depends(get_db), current=Depends(get_current_user)):
    csv_data = defects_to_csv(db, project_id=project_id)
    return Response(content=csv_data, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=defects.csv"})
