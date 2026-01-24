#!/usr/bin/env bash
set -euo pipefail

# Sets GitHub Actions repository secrets using the GitHub CLI (`gh`).
# Usage:
#   1) Ensure `gh` is installed and you've run `gh auth login`.
#   2) From the repository root run: `./scripts/set-github-secrets.sh`
#   3) The script will read values from a local `.env` if present, or prompt interactively.

REPO_DIR=$(cd "$(dirname "$0")/.." && pwd)
cd "$REPO_DIR"

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI not found. Install from https://cli.github.com/ and run 'gh auth login' first." >&2
  exit 1
fi

ENVFILE="$REPO_DIR/.env"
declare -A values

read -r -p "Read values from .env if it exists? [Y/n]: " use_env
use_env=${use_env:-Y}

if [[ "$use_env" =~ ^[Yy] ]]; then
  if [[ -f "$ENVFILE" ]]; then
    echo "Loading values from $ENVFILE"
    while IFS='=' read -r key val; do
      # skip empty lines and comments
      [[ -z "$key" || "$key" == \#* ]] && continue
      key=$(echo "$key" | tr -d ' '\n)
      val=$(echo "$val" | sed -e 's/^"//' -e 's/"$//')
      values[$key]="$val"
    done < <(grep -E '^[A-Za-z0-9_]+=.*' "$ENVFILE" || true)
  else
    echo ".env not found, falling back to interactive prompts"
  fi
fi

prompt_secret() {
  local name="$1"
  if [[ -n "${values[$name]:-}" ]]; then
    echo "Using value for $name from .env"
    echo "${values[$name]}"
    return
  fi
  read -r -s -p "Enter value for $name: " input
  echo
  echo "$input"
}

set_secret() {
  local name="$1"
  local val="$2"
  if [[ -z "$val" ]]; then
    echo "Skipping $name (empty)"
    return
  fi
  echo "Setting secret $name..."
  gh secret set "$name" --body "$val"
}

echo "Preparing to set the following repository secrets:"
secrets=(PI_MAINNET_VALIDATION_KEY PI_TESTNET_VALIDATION_KEY VERCEL_TOKEN PI_API_KEY)
for s in "${secrets[@]}"; do echo " - $s"; done
read -r -p "Continue and set these secrets in this repository? [y/N]: " confirm
confirm=${confirm:-N}
if [[ ! "$confirm" =~ ^[Yy] ]]; then
  echo "Aborted by user."; exit 0
fi

for s in "${secrets[@]}"; do
  val=$(prompt_secret "$s")
  set_secret "$s" "$val"
done

echo "All requested secrets have been set (or skipped if empty)."
