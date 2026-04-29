
export async function generateIntelligence(prompt: string, context?: string) {
  const response = await fetch("/api/intelligence/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, context }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error: any = new Error(errorData.error || "Backend failure");
    error.isApiKeyError = errorData.isApiKeyError;
    error.details = errorData.details;
    throw error;
  }
  
  const data = await response.json();
  return data.content;
}

export async function getIntelligenceHistory() {
  const response = await fetch("/api/intelligence/history");
  return response.json();
}

export async function clearIntelligenceHistory() {
  await fetch("/api/intelligence/history", { method: "DELETE" });
}
