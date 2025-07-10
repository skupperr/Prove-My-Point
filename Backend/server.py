# server.py
from src.app import app
import uvicorn
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))  # fallback for local
    uvicorn.run(app, host="0.0.0.0", port=port)
