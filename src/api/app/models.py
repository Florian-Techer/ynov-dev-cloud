from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Optional, Any, List, Dict
import uuid

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

class JobCreateRequest(BaseModel):
    file_name: str = Field(..., min_length=1, description="The name of the file to be processed")
    contentType: str = Field(default="application/octet-stream", min_length=1, description="The content type of the file")

class JobCreateResponse(BaseModel):
    jobId: str = Field(..., description="The ID of the job")
    status: str = Field(..., description="The status of the job")
    createdAt: str = Field(..., description="The date and time the job was created")
    uploadUrl: str = Field(..., description="The URL to upload the file for processing")

def job_to_entity(job: JobCreateRequest) -> Dict[str, Any]:
    job_id = str(uuid.uuid4())
    ts = now_iso()
    return {
        "id": job_id,
        "pk": "JOB",
        "status": "CREATED",
        "fileName": job.file_name,
        "contentType": job.contentType,
        "createdAt": ts,
        "updatedAt": ts,
        "resultSummury": None,
        "error": None
    }