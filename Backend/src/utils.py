'''
Frontend
    clerk authentication
    issue jwt token
    send to the backend

Backend
    connect to clerk
    ask clerk if the token is valid
'''

from fastapi import HTTPException
from clerk_backend_api import Clerk, AuthenticateRequestOptions

import os
from dotenv import load_dotenv

load_dotenv()

clerk_sdk = Clerk(bearer_auth = os.getenv('CLERK_SECRET_KEY'))


def authenticate_and_get_user_details(request):

    auth_header = request.headers.get("authorization")

    try:
        request_state = clerk_sdk.authenticate_request(
            request,
            AuthenticateRequestOptions(
                authorized_parties=["https://prove-my-point.vercel.app", "http://localhost:5173"],  # Keep local dev for testing

                jwt_key=os.getenv("JWT_KEY")
                # jwt_key = os.getenv("JWT_KEY").replace("\\n", "\n")
            )
        )

        if not request_state.is_signed_in:
            
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user_id = request_state.payload.get("sub")

        return {"user_id": user_id}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail = str(e))