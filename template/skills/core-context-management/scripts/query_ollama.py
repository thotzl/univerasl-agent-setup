#!/usr/bin/env python3
import sys
import json
import urllib.request
import urllib.error
import argparse

def main():
    parser = argparse.ArgumentParser(description="Query local Ollama server.")
    parser.add_argument("--model", type=str, default="qwen2.5-coder:7b", help="Model name (e.g. qwen2.5-coder:7b, llama3.2:3b)")
    parser.add_argument("--prompt", type=str, required=True, help="Prompt to send to the model")
    parser.add_argument("--system", type=str, default="", help="Optional system instructions")
    parser.add_argument("--host", type=str, default="http://localhost:11434", help="Ollama API host URL")
    
    args = parser.parse_args()
    
    url = f"{args.host}/api/generate"
    
    # Construct the API payload
    payload = {
        "model": args.model,
        "prompt": args.prompt,
        "stream": False
    }
    if args.system:
        payload["system"] = args.system
        
    data = json.dumps(payload).encode("utf-8")
    
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode("utf-8")
            res_json = json.loads(res_data)
            output = res_json.get("response", "")
            print(output)
    except urllib.error.URLError as e:
        print(f"Error connecting to Ollama at {args.host}: {e.reason}", file=sys.stderr)
        print("Please ensure Docker container is running and accessible.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
