#!/usr/bin/env python3
import os
import re
import sys
from pathlib import Path

# ==============================================================================
#                 Universal Codebase Structure Scanner (gather-context.py)
# ==============================================================================
# This script scans target project folders for structural patterns (e.g. classes,
# controllers, modules) and outputs a clean markdown overview. It prevents the 
# agent from having to run heavy, token-intensive 'grep' or 'read' calls.

# Configurable Search Patterns
PATTERNS = {
    "Classes": re.compile(r"class\s+(\w+)\b"),
    "Interfaces": re.compile(r"interface\s+(\w+)\b"),
    "Decorator Modules": re.compile(r"@Module|@Controller|@Resolver"),
}

TARGET_DIRS = ["src", "lib", "packages", "platforms"]
EXTENSIONS = [".ts", ".js", ".py", ".rs", ".go"]

def scan_directory(root_dir):
    structure = {}
    for folder in TARGET_DIRS:
        path = root_dir / folder
        if not path.exists():
            continue
            
        for root, _, files in os.walk(path):
            for file in files:
                if any(file.endswith(ext) for ext in EXTENSIONS):
                    file_path = Path(root) / file
                    try:
                        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                            content = f.read()
                            
                        file_matches = []
                        for name, regex in PATTERNS.items():
                            matches = regex.findall(content)
                            if matches:
                                # Standardize matching format
                                formatted = [m if isinstance(m, str) else m[0] for m in matches]
                                file_matches.append(f"{name}: {', '.join(formatted[:10])}")
                                
                        if file_matches:
                            rel_path = file_path.relative_to(root_dir)
                            structure[str(rel_path)] = file_matches
                    except Exception as e:
                        pass
    return structure

def main():
    root = Path.cwd()
    print("# UNIVERSAL ARCHITECTURAL STRUCTURAL MAP")
    print(f"\nScanning: `{root}` for architectural decorators and class footprints.\n")
    
    struct = scan_directory(root)
    if not struct:
        print("No matches found. Configure TARGET_DIRS or PATTERNS in this script.")
        return
        
    for file, findings in sorted(struct.items()):
        print(f"### `{file}`")
        for f in findings:
            print(f"- {f}")
        print()

if __name__ == "__main__":
    main()
