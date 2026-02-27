# Setup: Vercel deployment secrets and permissions

This repository uses GitHub Actions to build and deploy to Vercel. To enable automatic deployments you must add the following repository Secrets (Settings → Secrets and variables → Actions):

- `VERCEL_TOKEN` — A Vercel personal token with deploy permissions. Create at https://vercel.com/account/tokens.
- `VERCEL_ORG_ID` — The Vercel Organization / Team ID (if applicable).
- `VERCEL_PROJECT_ID` — The Vercel Project ID for this project.

Recommended workflow permissions (Repository Settings → Actions → General → Workflow permissions):
- Keep the default GITHUB_TOKEN permissions. The workflow in this PR only needs read access to contents.

Important notes:
- Secrets are not forwarded to workflows triggered by pull requests from forks. If you need to test PRs from forks, push a branch to this repository or open a draft PR from a branch inside this repository.
- You can also add non-secret Repository Variables (Settings → Secrets and variables → Actions → Variables) for values that are safe to print in logs.

How to test locally:
- Create a local `.env` file with the needed env vars (do not commit it):

```
VERCEL_TOKEN=your_token_here
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```
