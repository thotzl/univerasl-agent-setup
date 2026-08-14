import os
import re
import json
from pathlib import Path

# --- Configuration (Generic Defaults) ---
ROOT_DIR = Path.cwd()
# Look for common workspace/monorepo folders
COMMON_DIRS = [
    ROOT_DIR / "packages", 
    ROOT_DIR / "apps", 
    ROOT_DIR / "services", 
    ROOT_DIR / "platforms",
    ROOT_DIR / "src"
]

# Generic regex patterns for common frameworks (NestJS, Spring, etc.)
RE_CONTROLLER = re.compile(r"@(Controller|Resolver|RestController)\s*\(\s*['\"](.*?)['\"]")

def get_valid_dirs():
    dirs = []
    for base in COMMON_DIRS:
        if base.exists() and base.is_dir():
            dirs.append(base)
    if not dirs:
        dirs.append(ROOT_DIR)
    return dirs

def scan_packages(base_dirs):
    results = []
    for base in base_dirs:
        # Check if base itself is a package
        if (base / "package.json").exists():
             _add_package(base / "package.json", results)
        else:
            # Check subdirectories
            for item in base.iterdir():
                if item.is_dir():
                    pkg_json = item / "package.json"
                    if pkg_json.exists():
                        _add_package(pkg_json, results)
    return results

def _add_package(pkg_json, results):
    try:
        with open(pkg_json, 'r') as f:
            data = json.load(f)
            name = data.get('name', pkg_json.parent.name)
            desc = data.get('description', 'No description')
            results.append(f"- **{name}**: {desc} ({pkg_json.parent.relative_to(ROOT_DIR)})")
    except Exception:
        pass

def scan_api_structure(base_dirs):
    controllers = {}
    for base in base_dirs:
        for root, _, files in os.walk(base):
            if "node_modules" in root or "dist" in root or "build" in root:
                continue
            for file in files:
                if file.endswith((".ts", ".java")) and not file.endswith(".spec.ts"):
                    path = Path(root) / file
                    try:
                        with open(path, 'r', errors='ignore') as f:
                            content = f.read()
                            matches = RE_CONTROLLER.findall(content)
                            if matches:
                                rel_path = path.relative_to(ROOT_DIR)
                                controllers[str(rel_path)] = [m[1] for m in matches]
                    except Exception:
                        pass
    return controllers

def main():
    print("# WORKSPACE ARCHITECTURAL INVENTORY (STRUCTURAL ONLY)")
    print("\n> [NOTE] This report focuses on long-term structure.")
    
    base_dirs = get_valid_dirs()
    
    print(f"\n## Domain: Packages & Services")
    packages = scan_packages(base_dirs)
    if packages:
        for p in packages: print(p)
    else:
        print("No package.json files found in standard locations.")
    
    print(f"\n## Domain: API / Controllers")
    api_struct = scan_api_structure(base_dirs)
    if api_struct:
        for path, names in sorted(api_struct.items()):
            print(f"- `{path}`: {', '.join(names)}")
    else:
        print("No controllers or resolvers found.")

if __name__ == "__main__":
    main()
