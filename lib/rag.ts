import fs from "fs";
import path from "path";
import { generateResumeEmbeddings, getEmbeddings, cosineSimilarity } from "./embeddings";

// Function to split text into chunks
function chunkText(text: string, chunkSize: number = 500): string[] {
    const words = text.split(/\s+/);
    const chunks = [];
    let currentChunk: string[] = [];
    let currentLength = 0;

    for (const word of words) {
        if (currentLength + word.length > chunkSize) {
            chunks.push(currentChunk.join(" "));
            currentChunk = [word];
            currentLength = word.length;
        } else {
            currentChunk.push(word);
            currentLength += word.length + 1; // +1 for space
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(" "));
    }

    return chunks;
}

export async function getRelevantContext(query: string): Promise<string> {
    try {
        // 1. Load Resume Text
        const resumePath = path.join(process.cwd(), "data", "resume.txt");
        if (!fs.existsSync(resumePath)) {
            console.warn("Resume file not found at:", resumePath);
            return "";
        }
        const resumeText = fs.readFileSync(resumePath, "utf-8");

        // 2. Chunk the text
        const chunks = chunkText(resumeText);

        // 3. Generate Embeddings for chunks (cached in memory)
        const chunkEmbeddings = await generateResumeEmbeddings(chunks);

        if (chunkEmbeddings.length === 0) {
            // Fallback if embeddings fail (e.g. no API key)
            // Simple keyword matching
            const lowerQuery = query.toLowerCase();
            const relevantChunks = chunks.filter(chunk =>
                chunk.toLowerCase().includes(lowerQuery) ||
                lowerQuery.split(' ').some(word => word.length > 4 && chunk.toLowerCase().includes(word))
            );
            return relevantChunks.slice(0, 3).join("\n\n");
        }

        // 4. Generate Embedding for Query
        const queryEmbedding = await getEmbeddings(query);

        // 5. Calculate Similarity and Sort
        const scoredChunks = chunkEmbeddings.map((item) => ({
            content: item.content,
            score: cosineSimilarity(queryEmbedding, item.embedding),
        }));

        scoredChunks.sort((a, b) => b.score - a.score);

        // 6. Return top 3 chunks
        return scoredChunks
            .slice(0, 3)
            .map((item) => item.content)
            .join("\n\n");

    } catch (error) {
        console.error("Error in RAG pipeline:", error);
        return "";
    }
}
