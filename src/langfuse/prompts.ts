import { Langfuse } from "langfuse";

const DEFAULT_LABEL = process.env.NODE_ENV === "prod" ? "prod" : "nonprod";

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  baseUrl: process.env.LANGFUSE_BASE_URL ?? "https://us.cloud.langfuse.com",
});

export async function getCompiledPrompt(promptName: string, promptVariables: Record<string, any>) {
  // Label lets you use "production" vs "staging" prompt versions
  // https://langfuse.com/docs/prompt-management/get-started

  const prompt = await langfuse.prompt.get(promptName, { label: DEFAULT_LABEL });
  return prompt.compile(promptVariables);
}

// Example usage - in the future, prompt name and version would be dynamic
const compiledPrompt = await getCompiledPrompt("summarize_text", { text: "Langfuse is a platform for monitoring and managing LLM applications." });

console.log("Compiled Prompt:", compiledPrompt);