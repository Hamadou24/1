from fastapi import APIRouter
from ..schemas import ChatRequest, ChatResponse
from ..services.llm import LLMService

router = APIRouter(tags=["chat"])
llm_service = LLMService()


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest) -> ChatResponse:
    reply = await llm_service.generate_reply(prompt=payload.prompt, context=payload.context)
    return ChatResponse(answer=reply)