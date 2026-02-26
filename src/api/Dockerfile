FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
COPY app/ ./app

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

# Les variables d'environnement (COSMOS_*, BLOB_*) doivent être fournies au runtime
# Exemple : docker run --env-file .env ... ou docker compose up
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]