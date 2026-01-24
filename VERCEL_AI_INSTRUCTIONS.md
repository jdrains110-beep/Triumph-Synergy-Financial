# Vercel AI / VS Code Agent Integration

This project now exposes a minimal AI agent endpoint at `/api/ai-agent` that the VS Code extension or Vercel AI Agents can call to interact with the repository.

What the endpoint supports

- URL: `POST /api/ai-agent`
- Body: JSON `{ "prompt": "...", "context": { ... } }`
- Response: JSON `{ "reply": "...", "metadata": { ... } }`

Quick local test

```bash
curl -X POST http://localhost:3000/api/ai-agent \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Summarize repository files","context":{"path":"src/"}}'
```

Expected response: JSON with `reply` containing an echo of the prompt and `metadata`.

How to wire to Vercel AI Agents (high level)

1. Deploy this app to Vercel (or run it behind a publicly accessible HTTPS URL).
2. In Vercel Dashboard, create a new Agent and set its webhook target to `https://<your-deployment>/api/ai-agent`.
3. Configure any required environment variables in Vercel and redeploy.
4. In VS Code, ensure the Vercel AI extension is configured to use your Vercel account and the Agent.

Notes & next steps

- This endpoint is a minimal shim for testing and local VS Code integration. Replace the echo logic with real agent/LLM integration (OpenAI, Anthropic, or Vercel Agent hooks) as needed.
- If you want, I can implement an LLM connector (OpenAI/other) and add authentication and richer response handling.
