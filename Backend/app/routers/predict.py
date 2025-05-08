from fastapi import APIRouter, Body
from app.services.case_prediction import predict_from_raw_text

router = APIRouter()


@router.post("/predict-case")
def predict_case(text: str = Body(..., embed=True)):
    result = predict_from_raw_text(text)
    return result
