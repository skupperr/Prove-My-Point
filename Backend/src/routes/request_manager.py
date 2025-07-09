from fastapi import APIRouter, Depends, HTTPException, Request, Body
from pydantic import BaseModel
from ..utils import authenticate_and_get_user_details
from ..ai_generator.utils import main
from firebase_admin import firestore
from ..firebase_config import db
import json

class QuestionInput(BaseModel):
    question: str

router = APIRouter()

@router.get("/test")
async def test():
    return {"status": "working"}



# @router.post('/generate-answer')
# async def generate_answer(input: QuestionInput, request_obj: Request):
    
#     query = input.question.strip()

#     if not query:
#         raise HTTPException(status_code=400, detail="Empty question is not allowed.")

#     try:
#         # user_details = authenticate_and_get_user_details(request_obj)
#         # user_id = user_details.get('user_id')
#         # print(user_id)

#         result = await main(query)

#         if result["status"] == "INVALID":
#             return {
#                 "status": "INVALID",
#                 "message": result["explanation"]
#             }

#         return {
#             "status": "VALID",
#             "answer": result["response"],
#             "sources": result["ranked_results"]
#         }

#     except Exception as e:
#         print("Error in /generate-answer:", str(e))  # ✅ Print to console
#         raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@router.post('/generate-answer')
async def generate_answer(
    input: QuestionInput = Body(...),  # 👈 Ensure FastAPI parses JSON body
    request_obj: Request = None        # Optional, only if you need headers etc
):
    query = input.question.strip()

    if not query:
        raise HTTPException(status_code=400, detail="Empty question is not allowed.")

    try:
        # Uncomment if auth is needed
        # user_details = authenticate_and_get_user_details(request_obj)
        # user_id = user_details.get('user_id')

        result = await main(query)

        if result["status"] == "INVALID":
            print(result["explanation"])
            return {
                "status": "INVALID",
                "message": result["explanation"]
            }

        return {
            "status": "VALID",
            "answer": result["response"],
            "sources": result["ranked_results"]
        }

    except Exception as e:
        print("Error in /generate-answer:", str(e))
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
    

@router.get("/user-history")
async def get_user_history(request: Request):
    try:
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")
        print(user_id)

        # Order documents by timestamp (newest first)
        history_ref = db.collection("users").document(user_id).collection("history").order_by("timestamp", direction="DESCENDING")
        docs = history_ref.stream()

        history = [
            {
                "id": doc.id,
                "question": doc.to_dict().get("question", ""),
                "timestamp": doc.to_dict().get("timestamp")
            }
            for doc in docs
        ]

        return {"status": "success", "history": history}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")


@router.get("/user-history/{doc_id}")
async def get_user_history_entry(doc_id: str, request: Request):
    try:
        # Authenticate the request and extract the user ID
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        # Get the document reference
        doc_ref = db.collection("users").document(user_id).collection("history").document(doc_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="History entry not found.")

        return {"status": "success", "data": doc.to_dict()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch entry: {str(e)}")