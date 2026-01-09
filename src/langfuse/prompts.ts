import { Langfuse } from "langfuse";

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
  secretKey: process.env.LANGFUSE_SECRET_KEY!,
  baseUrl: process.env.LANGFUSE_BASE_URL ?? "https://us.cloud.langfuse.com",
});

export async function getCompiledPrompt(promptName: string, vars: Record<string, any>) {
  // Label lets you use "production" vs "staging" prompt versions
  const prompt = await langfuse.getPrompt(promptName, undefined, { label: "production" });
  return prompt.compile(vars);
}
