
FROM python:3.10-slim as base
WORKDIR /app


RUN apt update && \
    apt install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*


COPY src/server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY src/server/ .

EXPOSE 8000


CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]