# import firebase_admin
# from firebase_admin import credentials, firestore
# import os

# # Path to your Firebase service account key (recommended to use env var or config)



# # Only initialize once
# if not firebase_admin._apps:

#     try:
#         cred = credentials.Certificate(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS") )  # for deployment
#     except:
#         cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "/etc/secrets/firebase-key.json")
#         cred = credentials.Certificate(cred_path) # for localhost

#     firebase_admin.initialize_app(cred)

# db = firestore.client()

# import firebase_admin
# from firebase_admin import credentials, firestore
# import os

# # Only initialize once
# if not firebase_admin._apps:
#     # Check if the secret-mapped file exists first (used in Google Cloud Run)
#     secret_path = "/etc/secrets/firebase-key.json"
    
#     if os.path.exists(secret_path):
#         cred_path = secret_path
#     else:
#         # Fall back to local .env-style setup
#         cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "firebase-key.json")

#     cred = credentials.Certificate(cred_path)
#     firebase_admin.initialize_app(cred)

# db = firestore.client()

import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

if not firebase_admin._apps:
    # Try to load from FIREBASE_KEY env var (Cloud Run secret)
    firebase_key_json = os.environ.get("FIREBASE_KEY")
    if firebase_key_json:
        cred_dict = json.loads(firebase_key_json)
        cred = credentials.Certificate(cred_dict)
    else:
        # Fallback to local file
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "firebase-key.json")
        cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()