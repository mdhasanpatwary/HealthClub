import os
import json

def recover():
    log_path = '/Users/patwary/.gemini/antigravity-ide/brain/e1878f0e-feac-496c-a51f-d5fb2d7a2820/.system_generated/logs/transcript_full.jsonl'
    
    if not os.path.exists(log_path):
        print(f"Log path does not exist: {log_path}")
        return
        
    print("Reading past conversation logs...")
    steps = []
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            steps.append(json.loads(line))
            
    # Sort by step_index to ensure chronological order
    steps.sort(key=lambda x: x.get('step_index', 0))
    
    print(f"Found {len(steps)} steps. Applying file changes...")
    
    for step in steps:
        # Check if the step has tool calls
        calls = step.get('tool_calls', [])
        if not calls:
            continue
            
        for call in calls:
            name = call.get('name')
            args = call.get('args', {})
            
            if name == 'write_to_file':
                target = args.get('TargetFile')
                # Only restore files inside src/ (ignore implementation_plan, task.md)
                if target and 'HealthClub/src' in target:
                    content = args.get('CodeContent')
                    # Make parent directory if it doesn't exist
                    os.makedirs(os.path.dirname(target), exist_ok=True)
                    with open(target, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"write_to_file: Restored {target}")
                    
            elif name == 'replace_file_content':
                target = args.get('TargetFile')
                if target and 'HealthClub/src' in target:
                    target_content = args.get('TargetContent')
                    replacement_content = args.get('ReplacementContent')
                    
                    if not os.path.exists(target):
                        print(f"replace_file_content: File does not exist: {target}")
                        continue
                        
                    with open(target, 'r', encoding='utf-8') as f:
                        file_data = f.read()
                        
                    if target_content in file_data:
                        file_data = file_data.replace(target_content, replacement_content)
                        with open(target, 'w', encoding='utf-8') as f:
                            f.write(file_data)
                        print(f"replace_file_content: Applied replacement in {target}")
                    else:
                        # Sometimes spacing or quotes might slightly differ, let's report it
                        print(f"replace_file_content: WARNING: Target content not found in {target}")
                        
            elif name == 'multi_replace_file_content':
                target = args.get('TargetFile')
                if target and 'HealthClub/src' in target:
                    chunks = args.get('ReplacementChunks', [])
                    
                    if not os.path.exists(target):
                        print(f"multi_replace_file_content: File does not exist: {target}")
                        continue
                        
                    with open(target, 'r', encoding='utf-8') as f:
                        file_data = f.read()
                        
                    success_count = 0
                    for chunk in chunks:
                        tc = chunk.get('TargetContent')
                        rc = chunk.get('ReplacementContent')
                        if tc in file_data:
                            file_data = file_data.replace(tc, rc)
                            success_count += 1
                        else:
                            print(f"multi_replace_file_content: WARNING: Chunk not found in {target}")
                            
                    with open(target, 'w', encoding='utf-8') as f:
                        f.write(file_data)
                    print(f"multi_replace_file_content: Applied {success_count}/{len(chunks)} chunks in {target}")

if __name__ == '__main__':
    recover()
