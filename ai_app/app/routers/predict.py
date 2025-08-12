from fastapi import APIRouter, HTTPException, Request
import numpy as np
from ..schemas import PredictRequest, PredictResponse

router = APIRouter(tags=["predict"])


@router.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest, request: Request) -> PredictResponse:
    if not hasattr(request.app.state, "model"):
        raise HTTPException(status_code=503, detail="Model not loaded")

    model = request.app.state.model
    features = np.array(payload.features, dtype=float)

    model_dim = model.weights.shape[0]
    if features.shape[0] != model_dim:
        if features.shape[0] > model_dim:
            features = features[:model_dim]
        else:
            features = np.pad(features, (0, model_dim - features.shape[0]), mode="constant")

    pred = float(model.predict(features))
    return PredictResponse(prediction=pred)