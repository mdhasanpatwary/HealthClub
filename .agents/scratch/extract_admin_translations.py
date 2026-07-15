import re

def extract_bangla_from_admin():
    filepath = '/Users/patwary/Projects/HealthClub/src/app/admin/page.tsx'
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Match string literals containing Bangla characters: "...", '...', `...`
    # We must support escaped characters
    string_pat = re.compile(r'(?:"([^"\n]*?[\u0980-\u09ff]+[^"\n]*?)"|\'([^\'\n]*?[\u0980-\u09ff]+[^\'\n]*?)\'|`([^`\n]*?[\u0980-\u09ff]+[^`\n]*?)`)')
    
    # Match raw text in JSX: >...[\u0980-\u09ff]...<
    # We only match text that is not inside script/style tags, and is between > and <
    jsx_pat = re.compile(r'>\s*([^<>{}\n]*?[\u0980-\u09ff]+[^<>{}\n]*?)\s*<')
    
    strings = set()
    
    # Extract from string literals
    for m in string_pat.finditer(content):
        # find the matched group that is not None
        val = next(g for g in m.groups() if g is not None)
        strings.add(val.strip())
        
    # Extract from JSX text
    for m in jsx_pat.finditer(content):
        strings.add(m.group(1).strip())
        
    print(f"Found {len(strings)} unique Bangla strings in admin/page.tsx:")
    for idx, s in enumerate(sorted(strings)):
        print(f"{idx+1}: {s}")

if __name__ == '__main__':
    extract_bangla_from_admin()
