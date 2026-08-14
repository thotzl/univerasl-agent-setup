#!/usr/bin/env python3
import sys
import json

# ==============================================================================
#                 Universal Ticket/JSON Parser (extract-ticket.py)
# ==============================================================================
# This script extracts titles, descriptions, and comments from JSON files.
# It prevents the AI agent from loading massive JSON dumps directly into the chat.

def parse_json_ticket(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        tickets = data if isinstance(data, list) else [data]
        
        for ticket in tickets:
            key = ticket.get('key', ticket.get('id', 'N/A'))
            title = ticket.get('title', ticket.get('summary', 'N/A'))
            description = ticket.get('description', '')
            
            print(f"==========================================")
            print(f"TICKET: {key}")
            print(f"TITLE:  {title}")
            print(f"==========================================\n")
            print("--- DESCRIPTION ---")
            print(f"{description.strip()}\n")
            
            comments = ticket.get('comments', ticket.get('comment', []))
            if comments:
                print("--- COMMENTS ---")
                if isinstance(comments, list):
                    for comment in comments:
                        if isinstance(comment, dict):
                            author = comment.get('author', comment.get('name', 'Unknown'))
                            text = comment.get('body', comment.get('text', ''))
                            print(f"[{author}]: {text}\n")
                        else:
                            print(f"[Comment]: {comment}\n")
                elif isinstance(comments, dict):
                     for key, val in comments.items():
                         print(f"[{key}]: {val}\n")
                         
    except Exception as e:
        print(f"Error parsing JSON: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract-ticket.py <path_to_json>")
        sys.exit(1)
    parse_json_ticket(sys.argv[1])
