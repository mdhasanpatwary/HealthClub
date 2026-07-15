import os
import re
import json

# Regex to find t("...", "...") and tServer(locale, "...", "...")
# We need to support single quotes, double quotes, and escaped quotes.
# This regex matches t( "bn" , "en" ) and tServer( locale , "bn" , "en" )
# To handle commas inside strings, we look for matches of string literals.

# Helper to find string literals in a line or block
string_literal_pat = r'(?:"(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\')'

# Pattern for t(bn, en)
t_pattern = re.compile(
    r'\bt\(\s*(' + string_literal_pat + r')\s*,\s*(' + string_literal_pat + r')\s*\)'
)

# Pattern for tServer(locale, bn, en)
tserver_pattern = re.compile(
    r'\btServer\(\s*[^,]+\s*,\s*(' + string_literal_pat + r')\s*,\s*(' + string_literal_pat + r')\s*\)'
)

def clean_string(s):
    # Remove surrounding quotes and unescape
    if (s.startswith('"') and s.endswith('"')) or (s.startswith("'") and s.endswith("'")):
        s = s[1:-1]
    return s.encode('utf-8').decode('unicode_escape', errors='ignore')

def extract_from_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = []
    
    # Find t(bn, en)
    for m in t_pattern.finditer(content):
        matches.append({
            'type': 't',
            'raw': m.group(0),
            'bn': clean_string(m.group(1)),
            'en': clean_string(m.group(2)),
            'start': m.start(),
            'end': m.end()
        })
        
    # Find tServer(locale, bn, en)
    for m in tserver_pattern.finditer(content):
        matches.append({
            'type': 'tServer',
            'raw': m.group(0),
            'bn': clean_string(m.group(1)),
            'en': clean_string(m.group(2)),
            'start': m.start(),
            'end': m.end()
        })
        
    return matches

def main():
    src_dir = '/Users/patwary/Projects/HealthClub/src'
    all_translations = []
    
    for root, dirs, files in os.walk(src_dir):
        if 'generated' in root:
            continue
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                matches = extract_from_file(filepath)
                if matches:
                    print(f"File: {filepath} ({len(matches)} matches)")
                    for m in matches[:3]: # print first 3
                        print(f"  BN: {m['bn']} | EN: {m['en']}")
                    all_translations.extend(matches)
                    
    print(f"Total translations found: {len(all_translations)}")

if __name__ == '__main__':
    main()
