import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Optional


@dataclass(frozen=True)
class Settings:
    model_weights_file: Path
    openai_api_key: Optional[str]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    model_path = Path(os.environ.get("MODEL_WEIGHTS_FILE", "models/weights.npz"))
    api_key = os.environ.get("OPENAI_API_KEY")
    model_path.parent.mkdir(parents=True, exist_ok=True)
    return Settings(model_weights_file=model_path, openai_api_key=api_key)