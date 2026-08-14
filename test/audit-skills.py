import os
import re
import yaml

SKILLS_DIR = "/home/torsten/projects/universal-agent-setup/template/skills"

def audit_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    errors = []
    
    # 1. Verify YAML frontmatter existence
    if not content.startswith("---"):
        errors.append("Missing YAML frontmatter separator at start.")
        return errors
        
    parts = content.split("---")
    if len(parts) < 3:
        errors.append("Invalid YAML frontmatter framing.")
        return errors
        
    yaml_block = parts[1].strip()
    body_block = "---".join(parts[2:]).strip()
    
    # 2. Parse and verify YAML keys
    try:
        data = yaml.safe_load(yaml_block)
        if not isinstance(data, dict):
            errors.append("YAML frontmatter is not a valid key-value mapping.")
            return errors
            
        allowed_keys = {"name", "description"}
        actual_keys = set(data.keys())
        
        extra_keys = actual_keys - allowed_keys
        missing_keys = allowed_keys - actual_keys
        
        if extra_keys:
            errors.append(f"Contains forbidden YAML keys: {', '.join(extra_keys)}. Only 'name' and 'description' are allowed.")
        if missing_keys:
            errors.append(f"Missing required YAML keys: {', '.join(missing_keys)}.")
            
        # 3. Verify description completeness
        if "description" in data:
            desc = data["description"]
            if not isinstance(desc, str):
                errors.append("Description is not a string.")
            else:
                # Check for single-line string
                if "\n" in desc.strip():
                    errors.append("Description must be a single-line string without line breaks.")
                
                # Heuristic: Description should be informative (length > 20)
                if len(desc.strip()) < 20:
                    errors.append("Description is too short/vague. It must outline both the action and trigger context.")
    except Exception as e:
        errors.append(f"Failed to parse YAML frontmatter: {e}")
        
    # 4. Search for placeholders or TODOs
    todo_matches = re.findall(r"\b(TODO|PLACEHOLDER|FIXME)\b", body_block, re.IGNORECASE)
    if todo_matches:
        errors.append(f"Contains unresolved placeholders/TODOs: {set(todo_matches)}")
        
    # 5. Check for German words in the markdown body (as assets must be strictly in English)
    german_keywords = [" und ", " oder ", " der ", " die ", " das ", " nicht ", " ist ", " sind ", " für ", " bei "]
    found_german = [w.strip() for w in german_keywords if w in f" {body_block.lower()} "]
    if found_german:
        errors.append(f"Contains suspected German language fragments: {found_german}. All templates must be strictly in English.")
        
    return errors

def main():
    print("=============================================")
    print("      AI Skill Template Audit Runner         ")
    print("=============================================\n")
    
    all_passed = True
    files = [f for f in os.listdir(SKILLS_DIR) if f.endswith(".md")]
    files.sort()
    
    for file in files:
        file_path = os.path.join(SKILLS_DIR, file)
        errors = audit_file(file_path)
        if errors:
            all_passed = False
            print(f"✗ AUDIT FAILED for {file}:")
            for err in errors:
                print(f"  - {err}")
            print()
        else:
            print(f"✓ {file}: PASSED")
            
    print("\n=============================================")
    if all_passed:
        print("      ALL SKILL TEMPLATES ARE COMPLIANT!      ")
    else:
        print("      AUDIT COMPLETED WITH DETECTED ERRORS    ")
    print("=============================================")
    
    if not all_passed:
        exit(1)

if __name__ == "__main__":
    main()
