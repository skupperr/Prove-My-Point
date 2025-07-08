from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import request_manager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['*'],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)

app.include_router(request_manager.router, prefix="/api")
# app.include_router(webhooks.router, prefix="/webhooks")