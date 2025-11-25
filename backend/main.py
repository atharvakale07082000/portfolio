import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from rag import rag_service

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG on startup
@app.on_event("startup")
async def startup_event():
    # Assuming resume.txt is mounted or copied to backend/data/resume.txt
    # We will handle file placement in Docker
    rag_service.load_resume("data/resume.txt")

class ChatRequest(BaseModel):
    messages: list

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        messages = request.messages
        last_message = messages[-1]['content']
        
        # Get context
        context = rag_service.get_relevant_context(last_message)
        
        system_prompt = f"""
        You are an AI assistant for Atharva Kale's portfolio website.
        Your role is to answer questions about Atharva's experience, skills, and projects based strictly on the provided context.
        
        Context from Resume:
        {context}
        
        Instructions:
        - Be professional, concise, and friendly.
        - If the answer is not in the context, say "I don't have that information in my current context, but you can contact Atharva directly."
        - Do not hallucinate information.
        - Highlight key skills or projects if relevant.
        - Keep answers under 3-4 sentences unless asked for details.
        """
        
        # Generate response using Gemini
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Construct chat history for Gemini if needed, or just send the prompt with context
        # For simplicity, we'll just generate content based on the system prompt + user query
        # A more advanced implementation would map the full message history
        
        response = model.generate_content(f"{system_prompt}\n\nUser: {last_message}")
        
        return response.text
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok"}
