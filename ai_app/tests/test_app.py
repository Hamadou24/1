from fastapi.testclient import TestClient

from app.main import app


def test_health() -> None:
    with TestClient(app) as client:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"


def test_predict() -> None:
    with TestClient(app) as client:
        response = client.post("/api/predict", json={"features": [1, 2, 3, 4]})
        assert response.status_code == 200
        body = response.json()
        assert "prediction" in body
        assert isinstance(body["prediction"], float)


def test_chat() -> None:
    with TestClient(app) as client:
        response = client.post("/api/chat", json={"prompt": "Hello"})
        assert response.status_code == 200
        body = response.json()
        assert "answer" in body