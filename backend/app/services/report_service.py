from sqlalchemy.orm import Session
from app.models import Defect, Project
import csv
from io import StringIO

def defects_to_csv(db: Session, project_id: int = None):
    query = db.query(Defect)
    if project_id:
        query = query.filter(Defect.project_id == project_id)
    defects = query.all()

    out = StringIO()
    writer = csv.writer(out)
    writer.writerow(["id", "title", "description", "status", "priority", "project_id", "assigned_to", "created_at", "updated_at"])
    for d in defects:
        writer.writerow([d.id, d.title, d.description, d.status.value, d.priority, d.project_id, d.assigned_to, d.created_at, d.updated_at])
    out.seek(0)
    return out.getvalue()
