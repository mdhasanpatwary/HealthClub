import json
import os

def migrate_admin():
    json_path = '/Users/patwary/Projects/HealthClub/.agents/scratch/admin_translations.json'
    translations_file = '/Users/patwary/Projects/HealthClub/src/lib/translations.ts'
    admin_file = '/Users/patwary/Projects/HealthClub/src/app/admin/page.tsx'
    
    with open(json_path, 'r', encoding='utf-8') as f:
        new_translations = json.load(f)
        
    with open(translations_file, 'r', encoding='utf-8') as f:
        ts_content = f.read()
        
    # Merge translations into translations.ts
    en_start = ts_content.find('en: {') + 5
    bn_start = ts_content.find('bn: {') + 5
    
    en_lines = ""
    for k, v in sorted(new_translations.items()):
        val = v['en'].replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
        # Check if already in translations.ts to prevent duplication
        if f'"admin.dashboard.{k}"' not in ts_content:
            en_lines += f'    "admin.dashboard.{k}": "{val}",\n'
            
    bn_lines = ""
    for k, v in sorted(new_translations.items()):
        val = v['bn'].replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
        if f'"admin.dashboard.{k}"' not in ts_content:
            bn_lines += f'    "admin.dashboard.{k}": "{val}",\n'
            
    # Reconstruct translations.ts
    ts_content = ts_content[:en_start] + "\n" + en_lines + ts_content[en_start:bn_start] + "\n" + bn_lines + ts_content[bn_start:]
    
    with open(translations_file, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    print("Merged admin translations in translations.ts")
    
    # Now read admin/page.tsx
    with open(admin_file, 'r', encoding='utf-8') as f:
        admin_content = f.read()
        
    # 1. Update imports in admin/page.tsx
    import_stmt = 'import { useState, useEffect } from "react";'
    import_replacement = 'import { useState, useEffect } from "react";\nimport { useLanguage } from "@/components/layout/LanguageProvider";\nimport { formatNum } from "@/lib/i18n";'
    admin_content = admin_content.replace(import_stmt, import_replacement)
    
    # 2. Inject useLanguage hook in AdminDashboardPage component
    hook_injection_point = 'export default function AdminDashboardPage() {\n  const router = useRouter();'
    hook_replacement = 'export default function AdminDashboardPage() {\n  const router = useRouter();\n  const { t, locale } = useLanguage();'
    admin_content = admin_content.replace(hook_injection_point, hook_replacement)
    
    # 3. Sort translation map by length of the Bangla string descending to prevent nested substring replacement errors
    sorted_mappings = []
    for k, v in new_translations.items():
        sorted_mappings.append((v['bn'], f'admin.dashboard.{k}'))
    sorted_mappings.sort(key=lambda x: len(x[0]), reverse=True)
    
    # 4. Perform replacements
    # We will replace string usages in quotes, in backticks, and raw JSX children
    for bn_str, key in sorted_mappings:
        # Avoid templates like ${name} in literal replacements unless handled specifically
        if "${name}" in bn_str:
            # Handle confirm alerts
            if "সদস্যকে ডিলিট" in bn_str:
                target = 'confirm(`আপনি কি নিশ্চিতভাবে "${name}" সদস্যকে ডিলিট করতে চান? ডিলিট করলে তার সকল ডিসকাউন্ট ট্রানজেকশনও মুছে যাবে।`)'
                replacement = 'confirm(t("admin.dashboard.confirmDeleteMember").replace("${name}", name))'
                admin_content = admin_content.replace(target, replacement)
            elif "পার্টনারটি ডিলিট" in bn_str:
                target = 'confirm(`আপনি কি নিশ্চিতভাবে "${name}" পার্টনারটি ডিলিট করতে চান?`)'
                replacement = 'confirm(t("admin.dashboard.confirmDeletePartner").replace("${name}", name))'
                admin_content = admin_content.replace(target, replacement)
            continue
            
        if "${saved}" in bn_str:
            # Handle toast transaction success template
            target = 'setTxSuccess(`৳${saved} ডিসকাউন্ট সফলভাবে লগ করা হয়েছে।`);'
            replacement = 'setTxSuccess(t("admin.dashboard.txLoggedSuccess").replace("${saved}", formatNum(saved, locale)));'
            admin_content = admin_content.replace(target, replacement)
            continue
            
        # Replace JS string variables or toast alerts in double quotes
        admin_content = admin_content.replace(f'"{bn_str}"', f't("{key}")')
        # Replace JS string variables or toast alerts in single quotes
        admin_content = admin_content.replace(f"'{bn_str}'", f't("{key}")')
        # Replace JS template literals if no interpolations
        admin_content = admin_content.replace(f'`{bn_str}`', f't("{key}")')
        
        # Replace raw JSX text
        admin_content = admin_content.replace(f'>{bn_str}<', f'>{{t("{key}")}}<')
        # Handle trailing/leading spaces inside tags
        admin_content = admin_content.replace(f'> {bn_str} <', f'> {{t("{key}")}} <')
        admin_content = admin_content.replace(f'>{bn_str} <', f'>{{t("{key}")}} <')
        admin_content = admin_content.replace(f'> {bn_str}<', f'> {{t("{key}")}}<')
        
    # 5. Replace stats numeric formats using toLocaleString("bn-BD")
    admin_content = admin_content.replace('{stats.totalMembers}', '{formatNum(stats.totalMembers, locale)}')
    admin_content = admin_content.replace('{stats.activeMembers}', '{formatNum(stats.activeMembers, locale)}')
    admin_content = admin_content.replace('{stats.partnerCount}', '{formatNum(stats.partnerCount, locale)}')
    admin_content = admin_content.replace('{stats.totalTransactions}', '{formatNum(stats.totalTransactions, locale)}')
    
    admin_content = admin_content.replace('৳{stats.totalSaved.toLocaleString("bn-BD")}', '৳{formatNum(stats.totalSaved, locale)}')
    admin_content = admin_content.replace('৳{stats.revenue.toLocaleString("bn-BD")}', '৳{formatNum(stats.revenue, locale)}')
    
    admin_content = admin_content.replace('৳{(m.totalSaved || 0).toLocaleString("bn-BD")}', '৳{formatNum(m.totalSaved || 0, locale)}')
    admin_content = admin_content.replace('৳{(viewingMember.totalSaved || 0).toLocaleString("bn-BD")}', '৳{formatNum(viewingMember.totalSaved || 0, locale)}')
    
    # 6. Resolve conflict in transactions loop where the map variable is 't' which shadows translation helper 't'
    # We will rename the map variable 't' to 'tx' in the transaction loop
    tx_loop_target = '''                      {transactions.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-semibold text-secondary whitespace-nowrap">
                            {t.memberName}
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">{t.memberId}</span>
                          </TableCell>
                          <TableCell className="text-secondary whitespace-nowrap">{t.partnerName}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{t.date}</TableCell>
                          <TableCell className="text-right font-mono whitespace-nowrap">৳{t.amount.toLocaleString("bn-BD")}</TableCell>
                          <TableCell className="text-right font-mono text-primary font-bold whitespace-nowrap">৳{t.saved.toLocaleString("bn-BD")}</TableCell>
                        </TableRow>
                      ))}'''
                      
    tx_loop_replacement = '''                      {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-semibold text-secondary whitespace-nowrap">
                            {tx.memberName}
                            <span className="block text-[10px] text-muted-foreground font-mono font-normal">{tx.memberId}</span>
                          </TableCell>
                          <TableCell className="text-secondary whitespace-nowrap">{tx.partnerName}</TableCell>
                          <TableCell className="text-muted-foreground whitespace-nowrap">{tx.date}</TableCell>
                          <TableCell className="text-right font-mono whitespace-nowrap">৳{formatNum(tx.amount, locale)}</TableCell>
                          <TableCell className="text-right font-mono text-primary font-bold whitespace-nowrap">৳{formatNum(tx.saved, locale)}</TableCell>
                        </TableRow>
                      ))}'''
                      
    admin_content = admin_content.replace(tx_loop_target, tx_loop_replacement)
    
    # Write back modified admin file
    with open(admin_file, 'w', encoding='utf-8') as f:
        f.write(admin_content)
        
    print("Successfully migrated admin/page.tsx")

if __name__ == '__main__':
    migrate_admin()
