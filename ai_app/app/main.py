from fastapi import FastAPI
from loguru import logger
from contextlib import asynccontextmanager
from .config import get_settings
from .services.model import ToyLogisticModel, load_model_from_file, save_model_to_file
from .routers.predict import router as predict_router
from .routers.chat import router as chat_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up application and loading model (lifespan)")
    model = load_model_from_file(settings.model_weights_file)
    if model is None:
        model = ToyLogisticModel.initialize_default()
        save_model_to_file(model, settings.model_weights_file)
    app.state.model = model
    yield


app = FastAPI(title="AI App", version="0.1.0", lifespan=lifespan)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


app.include_router(predict_router, prefix="/api")
app.include_router(chat_router, prefix="/api")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)