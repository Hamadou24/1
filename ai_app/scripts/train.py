from pathlib import Path

from app.services.model import ToyLogisticModel, save_model_to_file


def main() -> None:
    model = ToyLogisticModel.initialize_default(num_features=4)
    output_path = Path("models/weights.npz")
    save_model_to_file(model, output_path)
    print(f"Model weights saved to {output_path}")


if __name__ == "__main__":
    main()