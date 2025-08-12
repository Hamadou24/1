import asyncio
from typing import Optional
import os


class LLMService:
    def __init__(self) -> None:
        self.api_key = os.environ.get("OPENAI_API_KEY")

    async def generate_reply(self, prompt: str, context: Optional[str] = None) -> str:
        base = f"Prompt: {prompt.strip()}"
        if context:
            base += f" | Context: {context.strip()}"
        await asyncio.sleep(0)
        return f"[stubbed-answer] {base}"