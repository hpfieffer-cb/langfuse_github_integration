# Langfuse GitHub Integration

This repository contains integration examples and helpers for using Langfuse with GitHub workflows and prompt management.

Relevant documentation and features are available at:

https://langfuse.com/docs/prompt-management/features/github-integration

## Features

- ✨ **Automated Prompt Synchronization**: Automatically trigger GitHub workflows when Langfuse prompts are updated
- 🔄 **Repository Dispatch Integration**: Use GitHub's repository_dispatch API to receive real-time prompt change notifications
- 💾 **Type-safe Prompt Compilation**: Helper functions for fetching and compiling Langfuse prompts with TypeScript support
- 🏷️ **Environment-aware Prompt Management**: Support for production vs staging prompt versions using labels

## Prerequisites

- Node.js 16+ 
- A Langfuse account with API access
- GitHub repository with Actions enabled
- GitHub Personal Access Token with `repo` scope

## Quick Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd langfuse_GH_integration-main
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
LANGFUSE_PUBLIC_KEY=your_public_key_here
LANGFUSE_SECRET_KEY=your_secret_key_here
LANGFUSE_BASE_URL=https://us.cloud.langfuse.com
OPENAI_KEY=your_openai_key_here  # Optional: for AI model integrations
```

### 3. GitHub Webhook Configuration

Configure Langfuse to send webhook notifications to your GitHub repository:

1. In your Langfuse project settings, add a webhook endpoint
2. Set the URL to: `https://api.github.com/repos/{owner}/{repo}/dispatches`
3. Include the following headers:
   - `Accept: application/vnd.github+json`
   - `Authorization: Bearer YOUR_GITHUB_TOKEN`
4. Set the event type to `langfuse-prompt-update`

## Usage

### Fetching and Compiling Prompts

The main utility function allows you to fetch and compile prompts with variables:

```typescript
import { getCompiledPrompt } from './src/langfuse/prompts';

// Fetch and compile a prompt with variables
const compiledPrompt = await getCompiledPrompt('summarize_text', {
  text: 'Your content to summarize here...'
});

console.log(compiledPrompt);
```

### GitHub Actions Workflow

The included workflow (`.github/workflows/langfuse.yml`) automatically responds to prompt updates:

```yaml
name: Langfuse CI

on:
  repository_dispatch:
    types: [langfuse-prompt-update]

jobs:
  log:
    runs-on: ubuntu-latest
    steps:
      - name: Process prompt update
        run: |
          echo "Prompt: ${{ github.event.client_payload.prompt.name }}"
          echo "Version: ${{ github.event.client_payload.prompt.version }}"
```

## Project Structure

```
├── .github/
│   └── workflows/
│       └── langfuse.yml         # GitHub Actions workflow
├── src/
│   └── langfuse/
│       └── prompts.ts           # Prompt management utilities
├── notes/
│   ├── api_notes.md            # GitHub API documentation
│   └── payload_notes.md        # Webhook payload examples
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## Webhook Payload Structure

When Langfuse sends a prompt update, the webhook payload includes:

```json
{
  "event_type": "langfuse-prompt-update",
  "client_payload": {
    "action": "created",
    "apiVersion": "v1",
    "id": "unique-event-id",
    "timestamp": "2026-01-15T14:56:27.831Z",
    "type": "prompt-version",
    "prompt": {
      "id": "prompt-id",
      "name": "prompt_name", 
      "version": 14,
      "labels": ["latest"],
      "prompt": "Your prompt content...",
      "type": "text",
      "projectId": "project-id"
    }
  }
}
```

## Advanced Configuration

### Using Different Environments

The prompt fetching supports environment labels for staging vs production:

```typescript
// Fetch production version
const prompt = await langfuse.getPrompt(promptName, undefined, { label: "production" });

// Fetch staging version  
const prompt = await langfuse.getPrompt(promptName, undefined, { label: "staging" });
```

### Custom Workflow Actions

Extend the GitHub workflow to perform additional actions on prompt updates:

```yaml
- name: Deploy updated prompts
  run: |
    # Add your deployment logic here
    echo "Deploying prompt ${{ github.event.client_payload.prompt.name }} v${{ github.event.client_payload.prompt.version }}"
    
- name: Run tests
  run: |
    # Run integration tests with new prompts
    npm test

- name: Commit prompt changes
  run: |
    # Configure git user
    git config --local user.email "action@github.com"
    git config --local user.name "GitHub Action"
    
    # Create or update prompt files based on webhook data
    echo "Updated prompt: ${{ github.event.client_payload.prompt.name }}" >> PROMPT_UPDATES.md
    echo "Version: ${{ github.event.client_payload.prompt.version }}" >> PROMPT_UPDATES.md
    echo "Timestamp: ${{ github.event.client_payload.timestamp }}" >> PROMPT_UPDATES.md
    echo "---" >> PROMPT_UPDATES.md
    
    # Add and commit changes
    git add .
    git commit -m "chore: update prompts - ${{ github.event.client_payload.prompt.name }} v${{ github.event.client_payload.prompt.version }}" || echo "No changes to commit"
    git push
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Langfuse ecosystem. Please refer to the main Langfuse repository for licensing information.