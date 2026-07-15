import os
import re

# String literal pattern (handles single/double quotes and escapes)
string_literal_pat = r'(?:"(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\')'

# Matches: t( "bn", "en" )
t_pattern = re.compile(
    r'\bt\(\s*(' + string_literal_pat + r')\s*,\s*(' + string_literal_pat + r')\s*\)'
)

# Matches: tServer( locale, "bn", "en" )
tserver_pattern = re.compile(
    r'\btServer\(\s*[^,]+\s*,\s*(' + string_literal_pat + r')\s*,\s*(' + string_literal_pat + r')\s*\)'
)

def clean_string(s):
    if (s.startswith('"') and s.endswith('"')) or (s.startswith("'") and s.endswith("'")):
        s = s[1:-1]
    # Unescape common characters
    s = s.replace('\\"', '"').replace("\\'", "'").replace('\\n', '\n')
    return s

def make_key(file_key, en_text):
    # Create key from English text
    # Keep only alphanumeric and spaces, then camelCase it
    clean = re.sub(r'[^a-zA-Z0-9\s]', '', en_text)
    words = clean.split()
    if not words:
        return f"{file_key}.key"
    
    # Camel case first few words
    key_words = words[:5] # limit to 5 words to avoid very long keys
    camel = key_words[0].lower() + "".join(w.capitalize() for w in key_words[1:])
    return f"{file_key}.{camel}"

def get_file_key(filepath):
    # Generate namespace/file key from path
    rel_path = os.path.relpath(filepath, '/Users/patwary/Projects/HealthClub/src')
    # Remove extension and replace separators
    base, _ = os.path.splitext(rel_path)
    base = base.replace('app/', '').replace('components/', '')
    parts = base.split(os.sep)
    # camelCase the parts
    parts = [p.replace('-', '_').split('_') for p in parts]
    flat_parts = []
    for p_list in parts:
        if p_list:
            part_name = p_list[0].lower() + "".join(w.capitalize() for w in p_list[1:])
            flat_parts.append(part_name)
    return ".".join(flat_parts)

def dry_run():
    src_dir = '/Users/patwary/Projects/HealthClub/src'
    all_extracted = {}
    
    for root, dirs, files in os.walk(src_dir):
        if 'generated' in root or '.agents' in root:
            continue
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                file_key = get_file_key(filepath)
                
                # Check matches
                matches = []
                # 1. t(bn, en)
                for m in t_pattern.finditer(content):
                    bn = clean_string(m.group(1))
                    en = clean_string(m.group(2))
                    key = make_key(file_key, en)
                    matches.append((m.group(0), f't("{key}")', bn, en, key))
                
                # 2. tServer(locale, bn, en)
                for m in tserver_pattern.finditer(content):
                    bn = clean_string(m.group(1))
                    en = clean_string(m.group(2))
                    key = make_key(file_key, en)
                    # Note: we need to replace tServer(locale, bn, en) with tServer(locale, key)
                    # Let's extract locale variable
                    # Find locale name
                    raw_call = m.group(0)
                    locale_var = raw_call.split('(')[1].split(',')[0].strip()
                    matches.append((raw_call, f'tServer({locale_var}, "{key}")', bn, en, key))
                
                if matches:
                    print(f"\n--- File: {filepath} (file_key: {file_key}) ---")
                    for raw, rep, bn, en, key in matches[:5]:
                        print(f"  {raw}  =>  {rep}")
                        print(f"    BN: {bn} | EN: {en}")
                        
                    # Add to central dictionary
                    for raw, rep, bn, en, key in matches:
                        if key not in all_extracted:
                            all_extracted[key] = {'bn': bn, 'en': en}
                            
    print(f"\nTotal unique keys to be generated: {len(all_extracted)}")

if __name__ == '__main__':
    dry_run()
