#!/bin/bash

# ==============================================================================
#                 Safe API cURL Wrapper (safe_curl.sh)
# ==============================================================================
# This script wraps curl API calls, loading credentials safely from .env without
# leaking sensitive environment tokens to the shell command history or agent chat logs.

ENV_FILE=".env"
API_URL=""
METHOD="GET"
HEADERS=()
PAYLOAD=""

usage() {
  echo "Usage: $0 --url <api_endpoint> [--method <GET|POST>] [--payload <json>] [--header <Header: Value>]" >&2
  exit 1
}

while [ $# -gt 0 ]; do
  case "$1" in
    --url)     [ $# -lt 2 ] && echo "Missing url value" >&2; API_URL=$2; shift 2 ;;
    --method)  [ $# -lt 2 ] && echo "Missing method value" >&2; METHOD=$2; shift 2 ;;
    --payload) [ $# -lt 2 ] && echo "Missing payload value" >&2; PAYLOAD=$2; shift 2 ;;
    --header)  [ $# -lt 2 ] && echo "Missing header value" >&2; HEADERS+=("$2"); shift 2 ;;
    *)         echo "Unknown parameter: $1" >&2; usage ;;
  esac
done

[ -z "$API_URL" ] && echo "Error: --url is required" >&2 && usage

# Load local environment files if present
if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

# Prepare cURL arguments
CURL_ARGS=("-s" "-X" "$METHOD")

for h in "${HEADERS[@]}"; do
  CURL_ARGS+=("-H" "$h")
done

if [ -n "$PAYLOAD" ]; then
  CURL_ARGS+=("-H" "Content-Type: application/json")
  CURL_ARGS+=("-d" "$PAYLOAD")
fi

# Perform safe API execution
curl "${CURL_ARGS[@]}" "$API_URL"
