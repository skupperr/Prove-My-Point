import firebase_admin
from firebase_admin import credentials, firestore
import os

# Path to your Firebase service account key (recommended to use env var or config)

cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "firebase-key.json")

# Only initialize once
if not firebase_admin._apps:
    # cred = credentials.Certificate(cred_path) for localhost
    cred = credentials.Certificate("/etc/secrets/firebase-key.json")  # for deployment
    firebase_admin.initialize_app(cred)

db = firestore.client()
