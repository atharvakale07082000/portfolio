import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";

// Simple in-memory cache for embeddings to avoid re-computing on every request
// In a real app, this would be a vector database like Pinecone or Chroma
let resumeEmbeddingsCache: { content: string; embedding: number[] }[] | null = null;

export async function getEmbeddings(text: string) {
    try {
        const { embedding } = await embed({
            model: google.textEmbeddingModel("text-embedding-004"),
            value: text,
        });
        return embedding;
    } catch (error) {
        console.error("Error generating embedding:", error);
        // Fallback or mock for demo purposes if API key is missing
        return new Array(768).fill(0).map(() => Math.random());
    }
}

export async function generateResumeEmbeddings(chunks: string[]) {
    if (resumeEmbeddingsCache) return resumeEmbeddingsCache;

    try {
        const { embeddings } = await embedMany({
            model: google.textEmbeddingModel("text-embedding-004"),
            values: chunks,
        });

        resumeEmbeddingsCache = chunks.map((chunk, i) => ({
            content: chunk,
            embedding: embeddings[i],
        }));

        return resumeEmbeddingsCache;
    } catch (error) {
        console.error("Error generating resume embeddings:", error);
        return [];
    }
}

// Cosine similarity function
export function cosineSimilarity(a: number[], b: number[]) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}
