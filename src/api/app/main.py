from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .jobs_routes import router

app = FastAPI(title="Job Management API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autoriser tous les origins pour le développement
    allow_credentials=False,  # Nécessaire quand allow_origins=["*"]
    allow_methods=["*"],  # Autoriser toutes les méthodes
    allow_headers=["*"],  # Autoriser tous les headers
)

app.include_router(
    router,
)

@app.get("/health")
def health_check():
    return {"status": "okk"}


# @app.get("/")
# def read_root():
#     return {"Hello": "World"}


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: str | None = None):
#     return {"item_id": item_id, "q": q}