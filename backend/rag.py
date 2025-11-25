import os
from typing import List
import google.generativeai as genai
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import numpy as np

# Configure Gemini
# Note: In production, use environment variables
GOOGLE_API_KEY = os.getenv("GOOGLE_GENERATIVE_AI_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

class RAGService:
    def __init__(self):
        self.chunks: List[str] = []
        self.embeddings: List[List[float]] = []
        self.model = "models/text-embedding-004"
        
    def load_resume(self, path: str = "data/resume.txt"):
        try:
            if not os.path.exists(path):
                print(f"Warning: Resume file not found at {path}")
                return

            with open(path, "r") as f:
                text = f.read()
                
            # Simple chunking by paragraphs or size
            self.chunks = [chunk.strip() for chunk in text.split('\n\n') if chunk.strip()]
            
            # Generate embeddings
            if GOOGLE_API_KEY:
                self._generate_embeddings()
            else:
                print("Warning: No API key found, skipping embeddings generation.")
                
        except Exception as e:
            print(f"Error loading resume: {e}")

    def _generate_embeddings(self):
        try:
            # Using google.generativeai directly for batch embeddings if possible, 
            # or loop through chunks. For simplicity with the SDK:
            self.embeddings = []
            for chunk in self.chunks:
                result = genai.embed_content(
                    model=self.model,
                    content=chunk,
                    task_type="retrieval_document",
                )
                self.embeddings.append(result['embedding'])
            print(f"Generated {len(self.embeddings)} embeddings.")
        except Exception as e:
            print(f"Error generating embeddings: {e}")

    def get_relevant_context(self, query: str, top_k: int = 3) -> str:
        if not self.embeddings or not GOOGLE_API_KEY:
            # Fallback keyword search
            query_lower = query.lower()
            relevant = [c for c in self.chunks if query_lower in c.lower()]
            return "\n\n".join(relevant[:top_k])

        try:
            # Embed query
            query_result = genai.embed_content(
                model=self.model,
                content=query,
                task_type="retrieval_query",
            )
            query_embedding = query_result['embedding']

            # Cosine similarity
            scores = []
            for doc_embedding in self.embeddings:
                dot_product = np.dot(query_embedding, doc_embedding)
                norm_a = np.linalg.norm(query_embedding)
                norm_b = np.linalg.norm(doc_embedding)
                score = dot_product / (norm_a * norm_b)
                scores.append(score)

            # Get top k indices
            top_indices = np.argsort(scores)[-top_k:][::-1]
            
            return "\n\n".join([self.chunks[i] for i in top_indices])

        except Exception as e:
            print(f"Error in retrieval: {e}")
            return ""

# Singleton instance
rag_service = RAGService()
