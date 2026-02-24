from fastapi import FastAPI
from .jobs_routes import router

app = FastAPI(title="Job Management API", version="1.0")

app.include_router(
    router,
)

@app.get("/health")
def health_check():
    return {"status": "ok"}


# @app.get("/")
# def read_root():
#     return {"Hello": "World"}


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: str | None = None):
#     return {"item_id": item_id, "q": q}