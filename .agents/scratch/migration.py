import os
import re

# String literal pattern (handles single/double quotes, newlines, and escapes)
string_literal_pat = r'(?:"(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\')'

# Matches: t( "bn", "en" )
t_pattern = re.compile(
    r'\bt\(\s*(' + string_literal_pat + r')\s*,\s*(' + string_literal_pat + r')\s*\)',
    re.DOTALL
)

# Matches: tServer( locale, "bn", "en" )
tserver_pattern = re.compile(
    r'\btServer\(\s*([^,]+)\s*,\s*(' + string_literal_pat + r')\s*,\s*(' + string_literal_pat + r')\s*\)',
    re.DOTALL
)

def clean_string(s):
    if (s.startswith('"') and s.endswith('"')) or (s.startswith("'") and s.endswith("'")):
        s = s[1:-1]
    # Manually unescape typical JS string escapes to prevent encoding corruption
    s = s.replace('\\"', '"').replace("\\'", "'").replace('\\n', '\n').replace('\\t', '\t')
    s = s.replace('\\\\', '\\')
    return s

def escape_typescript_string(s):
    return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')

def get_file_key(filepath):
    rel_path = os.path.relpath(filepath, '/Users/patwary/Projects/HealthClub/src')
    base, _ = os.path.splitext(rel_path)
    base = base.replace('app/', '').replace('components/', '')
    parts = base.split(os.sep)
    flat_parts = []
    for p in parts:
        p_sub = p.replace('-', '_').split('_')
        if p_sub:
            part_name = p_sub[0].lower() + "".join(w.capitalize() for w in p_sub[1:])
            flat_parts.append(part_name)
    return ".".join(flat_parts)

def make_key(file_key, en_text):
    clean = re.sub(r'[^a-zA-Z0-9\s]', '', en_text)
    words = clean.split()
    if not words:
        return f"{file_key}.key"
    
    key_words = words[:5]
    camel = key_words[0].lower() + "".join(w.capitalize() for w in key_words[1:])
    return f"{file_key}.{camel}"

def migrate():
    src_dir = '/Users/patwary/Projects/HealthClub/src'
    all_translations = {}
    file_replacements = {}
    
    # Pre-populate translations for profile.page since they were already replaced in profile/page.tsx
    # and we want to recover their Bengali strings correctly:
    profile_recoveries = {
        "profile.page.address": {"bn": "ঠিকানা", "en": "Address"},
        "profile.page.backToDashboard": {"bn": "ড্যাশবোর্ডে ফিরে যান", "en": "Back to Dashboard"},
        "profile.page.dateOfBirth": {"bn": "জন্ম তারিখ", "en": "Date of Birth"},
        "profile.page.egMdAbdurRahman": {"bn": "যেমন: মোঃ আব্দুর রহমান", "en": "e.g., Md. Abdur Rahman"},
        "profile.page.egMizanRoadFeni": {"bn": "যেমন: মিজান রোড, ফেনী", "en": "e.g., Mizan Road, Feni"},
        "profile.page.egServiceBusinessStudent": {"bn": "যেমন: চাকরি, ব্যবসা, ছাত্র", "en": "e.g., Service, Business, Student"},
        "profile.page.emailAddress": {"bn": "ইমেইল ঠিকানা", "en": "Email Address"},
        "profile.page.failedToUpdateProfile": {"bn": "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।", "en": "Failed to update profile."},
        "profile.page.loading": {"bn": "লোড হচ্ছে...", "en": "Loading..."},
        "profile.page.memberId": {"bn": "মেম্বার আইডি", "en": "Member ID"},
        "profile.page.mobileNumber": {"bn": "মোবাইল নম্বর *", "en": "Mobile Number *"},
        "profile.page.plan": {"bn": "প্ল্যান", "en": "Plan"},
        "profile.page.profession": {"bn": "পেশা", "en": "Profession"},
        "profile.page.profilePicture": {"bn": "প্রোফাইল ছবি", "en": "Profile Picture"},
        "profile.page.profileSettings": {"bn": "প্রোফাইল সেটিংস", "en": "Profile Settings"},
        "profile.page.profileUpdatedSuccessfully": {"bn": "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!", "en": "Profile updated successfully!"},
        "profile.page.saveChanges": {"bn": "পরিবর্তন সংরক্ষণ করুন", "en": "Save Changes"},
        "profile.page.saving": {"bn": "সংরক্ষণ করা হচ্ছে...", "en": "Saving..."},
        "profile.page.serverError": {"bn": "সার্ভার ত্রুটি।", "en": "Server error."},
        "profile.page.yourName": {"bn": "আপনার নাম *", "en": "Your Name *"},
    }
    all_translations.update(profile_recoveries)
    
    # 1. First pass: Collect all translations and plan replacements
    for root, dirs, files in os.walk(src_dir):
        if 'generated' in root or '.agents' in root:
            continue
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                
                # Skip profile page as it is already migrated
                if 'profile/page.tsx' in filepath:
                    continue
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                file_key = get_file_key(filepath)
                matches = []
                
                # Extract t(bn, en)
                for m in t_pattern.finditer(content):
                    bn = clean_string(m.group(1))
                    en = clean_string(m.group(2))
                    key = make_key(file_key, en)
                    
                    # Ensure uniqueness within all_translations
                    original_key = key
                    counter = 1
                    while key in all_translations and (all_translations[key]['bn'] != bn or all_translations[key]['en'] != en):
                        key = f"{original_key}{counter}"
                        counter += 1
                        
                    all_translations[key] = {'bn': bn, 'en': en}
                    matches.append({
                        'start': m.start(),
                        'end': m.end(),
                        'replacement': f't("{key}")'
                    })
                
                # Extract tServer(locale, bn, en)
                for m in tserver_pattern.finditer(content):
                    locale_var = m.group(1).strip()
                    bn = clean_string(m.group(2))
                    en = clean_string(m.group(3))
                    key = make_key(file_key, en)
                    
                    original_key = key
                    counter = 1
                    while key in all_translations and (all_translations[key]['bn'] != bn or all_translations[key]['en'] != en):
                        key = f"{original_key}{counter}"
                        counter += 1
                        
                    all_translations[key] = {'bn': bn, 'en': en}
                    matches.append({
                        'start': m.start(),
                        'end': m.end(),
                        'replacement': f'tServer({locale_var}, "{key}")'
                    })
                
                if matches:
                    # Sort matches in descending order of start index to safely replace in reverse
                    matches.sort(key=lambda x: x['start'], reverse=True)
                    file_replacements[filepath] = {
                        'content': content,
                        'matches': matches
                    }
                    
    # 2. Write src/lib/translations.ts
    translations_filepath = '/Users/patwary/Projects/HealthClub/src/lib/translations.ts'
    
    # Sort keys for consistent output
    sorted_keys = sorted(all_translations.keys())
    
    ts_content = 'export const translations = {\n  en: {\n'
    for k in sorted_keys:
        val = escape_typescript_string(all_translations[k]['en'])
        ts_content += f'    "{k}": "{val}",\n'
    ts_content += '  },\n  bn: {\n'
    for k in sorted_keys:
        val = escape_typescript_string(all_translations[k]['bn'])
        ts_content += f'    "{k}": "{val}",\n'
    ts_content += '  }\n} as const;\n\nexport type TranslationKey = keyof typeof translations.en;\n'
    
    with open(translations_filepath, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    print(f"Created {translations_filepath} with {len(sorted_keys)} keys.")
    
    # 3. Apply replacements to files
    for filepath, data in file_replacements.items():
        content = data['content']
        for m in data['matches']:
            content = content[:m['start']] + m['replacement'] + content[m['end']:]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Migrated {filepath}")

if __name__ == '__main__':
    migrate()
