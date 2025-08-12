from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import numpy as np


@dataclass
class ToyLogisticModel:
    weights: np.ndarray
    bias: float

    def predict_proba(self, features: np.ndarray) -> float:
        z = float(np.dot(self.weights, features) + self.bias)
        return 1.0 / (1.0 + np.exp(-z))

    def predict(self, features: np.ndarray) -> float:
        return self.predict_proba(features)

    @staticmethod
    def initialize_default(num_features: int = 4) -> "ToyLogisticModel":
        rng = np.random.default_rng(seed=42)
        weights = rng.normal(0.0, 0.5, size=(num_features,))
        bias = float(rng.normal(0.0, 0.1))
        return ToyLogisticModel(weights=weights, bias=bias)


def save_model_to_file(model: ToyLogisticModel, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    np.savez(path, weights=model.weights, bias=model.bias)


def load_model_from_file(path: Path) -> Optional[ToyLogisticModel]:
    if not path.exists():
        return None
    data = np.load(path, allow_pickle=False)
    weights = np.array(data["weights"], dtype=float)
    bias = float(data["bias"])
    return ToyLogisticModel(weights=weights, bias=bias)