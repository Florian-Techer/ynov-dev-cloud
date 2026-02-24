from fastapi import APIRouter, Depends, HTTPException
from azure.cosmos.exceptions import CosmosHttpResponseError
from .cosmos import get_cosmos_container
from .models import JobCreateRequest, JobCreateResponse, job_to_entity
from .blob_service import generate_upload_sas_url

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.post("", response_model=JobCreateResponse, status_code=201)
def create_job(request: JobCreateRequest) -> JobCreateResponse:
    container = get_cosmos_container()
    job_entity = job_to_entity(request)
    try:
        container.create_item(body=job_entity)
    except CosmosHttpResponseError as e:
        raise HTTPException(status_code=500, detail=f"Failed to create job: {str(e)}")
    
    blob_path = f"input/{job_entity['id']}/{request.file_name}"

    upload_url = generate_upload_sas_url(blob_path)
    return JobCreateResponse(
        jobId=job_entity["id"],
        status=job_entity["status"],
        createdAt=job_entity["createdAt"],
        uploadUrl=upload_url
    )

@router.get("/{job_id}", response_model=JobCreateResponse)
def get_job(job_id: str) -> JobCreateResponse:
    container = get_cosmos_container()
    try:
        job_entity = container.read_item(item=job_id, partition_key="JOB")
        return JobCreateResponse(
            jobId=job_entity["id"],
            status=job_entity["status"],
            createdAt=job_entity["createdAt"],
            file_name=job_entity["fileName"]
        )
    except CosmosHttpResponseError as e:
        if e.status_code == 404:
            raise HTTPException(status_code=404, detail="Job not found")
        else:
            raise HTTPException(status_code=500, detail=f"Failed to retrieve job: {str(e)}")
