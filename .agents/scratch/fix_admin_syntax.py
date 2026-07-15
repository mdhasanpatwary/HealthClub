import re

def fix_syntax():
    admin_file = '/Users/patwary/Projects/HealthClub/src/app/admin/page.tsx'
    
    with open(admin_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find patterns like placeholder=t("admin.dashboard.something") or label=t("...")
    # and replace with placeholder={t("admin.dashboard.something")}
    # Regex: =t("...") or =t('...') or =t(`...`)
    # We look for = followed by t( and double/single quotes or backticks, ending with )
    
    # Let's match: =\s*t\(\s*("[^"]+"|\'[^\']+\'|`[^`]+`)\s*\)
    # But wait, it must not already have a curly brace!
    # So we look for = (not preceded by { or followed by {)
    
    # A simple regex pattern:
    pattern = re.compile(r'=\s*t\(\s*("admin\.dashboard\.[^"]+"|\'admin\.dashboard\.[^\']+\')\s*\)')
    
    content, count = pattern.subn(r'={t(\1)}', content)
    print(f"Fixed {count} JSX attribute syntax errors.")
    
    with open(admin_file, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    fix_syntax()
