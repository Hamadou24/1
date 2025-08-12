from typing import List, Optional
from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    features: List[float] = Field(..., description="Feature vector for prediction")


class PredictResponse(BaseModel):
    prediction: float


class ChatRequest(BaseModel):
    prompt: str
    context: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str