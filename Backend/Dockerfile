FROM python:3.11-slim

# Prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Install system dependencies (if needed)
RUN apt-get update && apt-get install -y gcc libpq-dev

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend code
COPY . .

# Set environment variable for FastAPI port
ENV PORT=8080

# Start FastAPI using server.py
CMD ["python", "server.py"]


# FROM python:3.11-slim

# # Set environment vars
# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1

# WORKDIR /app

# # Install dependencies
# RUN apt-get update \
#     && apt-get install -y --no-install-recommends gcc \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

# COPY requirements.txt .

# # Use pip cache + clean tricks
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# ENV PORT=8080

# CMD ["python", "server.py"]
