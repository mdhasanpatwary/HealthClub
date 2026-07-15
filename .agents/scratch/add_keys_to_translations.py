import os

def merge_translations():
    translations_file = '/Users/patwary/Projects/HealthClub/src/lib/translations.ts'
    
    new_translations = {
        "en": {
            # terms-conditions
            "pages.termsConditions.metaTitle": "Terms & Conditions - Health Club",
            "pages.termsConditions.metaDesc": "Rules of using Health Club membership, partner hospital verification policy, and terms.",
            "pages.termsConditions.title": "Terms & Conditions",
            "pages.termsConditions.lastUpdated": "Last Updated: July 14, 2026",
            "pages.termsConditions.intro": "To receive membership services of Health Club, you must comply with the following terms and conditions. By completing registration as a member, you are deemed to accept these terms.",
            "pages.termsConditions.section1Title": "1. Membership Use & Misuse",
            "pages.termsConditions.section1Item1": "Individual membership cards can only be used by the cardholder. It cannot be transferred to anyone else.",
            "pages.termsConditions.section1Item2": "In the case of family cards, only family members listed in the agreement will receive the benefits.",
            "pages.termsConditions.section1Item3": "Health Club reserves the right to cancel any membership in case of misuse or provision of false information.",
            "pages.termsConditions.section2Title": "2. Partner Hospital Discount & Verification",
            "pages.termsConditions.section2Item1": "To receive discount benefits, the patient must show an active digital membership card at the billing counter before making payment. Showing the card after billing may not apply the discount.",
            "pages.termsConditions.section2Item2": "Partner hospitals may change or modify discount rates according to their policies, which will be updated on the official Health Club website.",
            "pages.termsConditions.section2Item3": "Health Club is only a membership and discount card service provider. Health Club shall not be held liable in any way for medical errors, negligence, or malpractice.",
            "pages.termsConditions.section3Title": "3. Payment & Refund Policy",
            "pages.termsConditions.section3Item1": "Membership is free for the 1st year for Founding members.",
            "pages.termsConditions.section3Item2": "Fees for other paid annual membership plans are non-refundable.",
            
            # privacy-policy
            "pages.privacyPolicy.metaTitle": "Privacy Policy - Health Club",
            "pages.privacyPolicy.metaDesc": "Detailed description of Health Club's privacy policy and how we keep your information secure.",
            "pages.privacyPolicy.title": "Privacy Policy",
            "pages.privacyPolicy.lastUpdated": "Last Updated: July 14, 2026",
            "pages.privacyPolicy.intro": "Protecting your privacy at Health Club is one of our top priorities. In this policy, we explain how we collect, use, and ensure the security of your personal information.",
            "pages.privacyPolicy.section1Title": "1. What information do we collect?",
            "pages.privacyPolicy.section1Intro": "We collect your basic personal information when creating a membership, such as:",
            "pages.privacyPolicy.section1Item1": "Name",
            "pages.privacyPolicy.section1Item2": "Phone Number",
            "pages.privacyPolicy.section1Item3": "Email Address",
            "pages.privacyPolicy.section1Item4": "Names and ages of added family members (in case of Family plan)",
            "pages.privacyPolicy.section2Title": "2. Why do we use your information?",
            "pages.privacyPolicy.section2Intro": "The collected information is used for the following purposes:",
            "pages.privacyPolicy.section2Item1": "To create a digital membership ID card for you.",
            "pages.privacyPolicy.section2Item2": "To verify membership at partner hospitals via QR code scanning.",
            "pages.privacyPolicy.section2Item3": "To display your savings history and transactions in the dashboard.",
            "pages.privacyPolicy.section2Item4": "To send notifications regarding emergency services and new offers.",
            "pages.privacyPolicy.section3Title": "3. Data Security",
            "pages.privacyPolicy.section3Desc": "We use state-of-the-art digital security measures to ensure the security of your personal information. Under no circumstances do we sell or leak your information to any third party.",
            "pages.privacyPolicy.section4Title": "4. Changes to the Policy",
            "pages.privacyPolicy.section4Desc": "Health Club reserves the right to change or modify this privacy policy at any time. Any changes will be published on this page.",
            
            # verify page
            "pages.verify.loading": "Verifying...",
            "pages.verify.verifiedMember": "VERIFIED MEMBER (VERIFIED)",
            "pages.verify.verifiedDatabase": "Health Club Membership Database Verified",
            "pages.verify.memberName": "Member Name",
            "pages.verify.memberId": "Member ID",
            "pages.verify.memberType": "Membership Type",
            "pages.verify.expiryDate": "Expiry Date",
            "pages.verify.membershipStatus": "Membership Status",
            "pages.verify.active": "Active (ACTIVE)",
            "pages.verify.todoAtHospital": "What to do at Hospital Billing Counter:",
            "pages.verify.todoStep1": "1. Enter the member ID in your billing system.",
            "pages.verify.todoStep2": "2. Apply the contracted discount rate to the bill.",
            "pages.verify.backToHome": "Back to Home Page",
            "pages.verify.invalidId": "INVALID MEMBER ID (INVALID)",
            "pages.verify.idNotFound": "Member ID not found in database",
            "pages.verify.sorry": "Sorry!",
            "pages.verify.notFoundMessage": "The provided member ID is not in the active member list.",
            "pages.verify.invalidDesc": "The card might have expired, or the QR code might be invalid/fake.",
            "pages.verify.goToHome": "Go to Home Page",
            "pages.verify.contactCustomerSupport": "Contact Customer Support"
        },
        "bn": {
            # terms-conditions
            "pages.termsConditions.metaTitle": "শর্তাবলী ও নিয়মাবলী - হেলথ ক্লাব",
            "pages.termsConditions.metaDesc": "হেলথ ক্লাবের মেম্বারশিপ ব্যবহারের নিয়ম, পার্টনার হাসপাতাল যাচাইকরণ নীতি এবং শর্তাবলী।",
            "pages.termsConditions.title": "শর্তাবলী ও নিয়মাবলী (Terms & Conditions)",
            "pages.termsConditions.lastUpdated": "সর্বশেষ আপডেট: ১৪ জুলাই, ২০২৬",
            "pages.termsConditions.intro": "হেলথ ক্লাব (হেলথ ক্লাব)-এর মেম্বারশিপ সেবা গ্রহণের জন্য আপনাকে নিম্নলিখিত শর্তাবলী মেনে চলতে হবে। মেম্বার হিসেবে রেজিস্ট্রেশন সম্পন্ন করার মাধ্যমে আপনি এই শর্তাবলী স্বীকার করছেন বলে গণ্য হবে।",
            "pages.termsConditions.section1Title": "১. মেম্বারশিপের ব্যবহার ও অপব্যবহার",
            "pages.termsConditions.section1Item1": "ব্যক্তিগত (Individual) মেম্বারশিপ কার্ড শুধুমাত্র কার্ডধারী ব্যক্তিই ব্যবহার করতে পারবেন। এটি অন্য কারো কাছে হস্তান্তর করা যাবে না।",
            "pages.termsConditions.section1Item2": "পারিবারিক (Family) কার্ডের ক্ষেত্রে শুধুমাত্র চুক্তিতে তালিকাভুক্ত পরিবারের সদস্যরা এর সুবিধা পাবেন।",
            "pages.termsConditions.section1Item3": "কার্ডের অপব্যবহার বা মিথ্যা তথ্য প্রদানের ক্ষেত্রে হেলথ ক্লাব যেকোনো মেম্বারশিপ বাতিল করার অধিকার রাখে।",
            "pages.termsConditions.section2Title": "২. পার্টনার হাসপাতালের ডিসকাউন্ট ও ভেরিফিকেশন",
            "pages.termsConditions.section2Item1": "ডিসকাউন্ট সুবিধা পেতে রোগীকে অবশ্যই বিলিং কাউন্টারে পেমেন্ট করার আগে সচল ডিজিটাল মেম্বারশিপ কার্ড দেখাতে হবে। বিল করার পর কার্ড দেখালে ডিসকাউন্ট কার্যকর নাও হতে পারে।",
            "pages.termsConditions.section2Item2": "পার্টনার হাসপাতাল তাদের নির্ধারিত নীতি অনুযায়ী ছাড়ের হার পরিবর্তন বা পরিবর্ধন করতে পারে, যা হেলথ ক্লাব অফিশিয়াল ওয়েবসাইটে আপডেট করা হবে।",
            "pages.termsConditions.section2Item3": "হেলথ ক্লাব শুধুমাত্র মেম্বারশিপ ও ডিসকাউন্ট কার্ড সার্ভিস প্রদানকারী প্রতিষ্ঠান। চিকিৎসাগত ত্রুটি, অবহেলা বা ভুল চিকিৎসার জন্য হেলথ ক্লাব কোনোভাবেই দায়ী থাকবে না।",
            "pages.termsConditions.section3Title": "৩. পেমেন্ট ও রিফান্ড নীতি",
            "pages.termsConditions.section3Item1": "প্রতিষ্ঠাতা (Founding) মেম্বারদের জন্য মেম্বারশিপ ১ম বছরের জন্য ফ্রী।",
            "pages.termsConditions.section3Item2": "অন্যান্য পেইড বাৎসরিক মেম্বারশিপ প্ল্যানগুলোর ফি অফেরতযোগ্য (Non-refundable)।",
            
            # privacy-policy
            "pages.privacyPolicy.metaTitle": "গোপনীয়তা নীতি - হেলথ ক্লাব",
            "pages.privacyPolicy.metaDesc": "হেলথ ক্লাবের গোপনীয়তা নীতি এবং কীভাবে আমরা আপনার তথ্য সুরক্ষিত রাখি তার বিস্তারিত বিবরণ।",
            "pages.privacyPolicy.title": "গোপনীয়তা নীতি (Privacy Policy)",
            "pages.privacyPolicy.lastUpdated": "সর্বশেষ আপডেট: ১৪ জুলাই, ২০২৬",
            "pages.privacyPolicy.intro": "হেলথ ক্লাব (হেলথ ক্লাব)-এ আপনার গোপনীয়তা রক্ষা করা আমাদের অন্যতম অগ্রাধিকার। আমাদের এই নীতিমালায় আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ করি, ব্যবহার করি এবং আপনার নিরাপত্তা নিশ্চিত করি তা ব্যাখ্যা করা হয়েছে।",
            "pages.privacyPolicy.section1Title": "১. কোন কোন তথ্য আমরা সংগ্রহ করি?",
            "pages.privacyPolicy.section1Intro": "মেম্বারশিপ তৈরি করার সময় আমরা আপনার মৌলিক ব্যক্তিগত তথ্য সংগ্রহ করি যেমন:",
            "pages.privacyPolicy.section1Item1": "নাম (Name)",
            "pages.privacyPolicy.section1Item2": "মোবাইল নম্বর (Phone Number)",
            "pages.privacyPolicy.section1Item3": "ইমেইল ঠিকানা (Email Address)",
            "pages.privacyPolicy.section1Item4": "যুক্ত করা পরিবারের সদস্যদের নাম ও বয়স (ফ্যামিলি প্ল্যানের ক্ষেত্রে)",
            "pages.privacyPolicy.section2Title": "২. আমরা কেন আপনার তথ্য ব্যবহার করি?",
            "pages.privacyPolicy.section2Intro": "সংগৃহীত তথ্য নিম্নলিখিত উদ্দেশ্যসমূহে ব্যবহৃত হয়:",
            "pages.privacyPolicy.section2Item1": "আপনার জন্য ডিজিটাল মেম্বারশিপ আইডি কার্ড তৈরি করতে।",
            "pages.privacyPolicy.section2Item2": "পার্টনার হাসপাতালগুলোতে কিউআর কোড স্ক্যানের মাধ্যমে মেম্বারশিপ যাচাই করতে।",
            "pages.privacyPolicy.section2Item3": "আপনার সেভিং হিস্ট্রি ও ট্রানজেকশন ড্যাশবোর্ডে দেখাতে।",
            "pages.privacyPolicy.section2Item4": "জরুরি সেবা এবং নতুন অফার সম্পর্কিত বিজ্ঞপ্তি পাঠাতে।",
            "pages.privacyPolicy.section3Title": "৩. তথ্য সুরক্ষা",
            "pages.privacyPolicy.section3Desc": "আমরা আপনার ব্যক্তিগত তথ্যের নিরাপত্তা নিশ্চিত করতে সর্বাধুনিক ডিজিটাল সুরক্ষা ব্যবস্থা ব্যবহার করি। আমরা কোনো অবস্থাতেই আপনার তথ্য কোনো তৃতীয় পক্ষের কাছে বিক্রি বা পাচার করি না।",
            "pages.privacyPolicy.section4Title": "৪. নীতিমালায় পরিবর্তন",
            "pages.privacyPolicy.section4Desc": "হেলথ ক্লাব যেকোনো সময় এই গোপনীয়তা নীতি পরিবর্তন বা পরিবর্ধন করার অধিকার রাখে। যেকোনো পরিবর্তন এই পেজে প্রকাশ করা হবে।",
            
            # verify page
            "pages.verify.loading": "যাচাই করা হচ্ছে...",
            "pages.verify.verifiedMember": "ভেরিফাইড মেম্বার (VERIFIED)",
            "pages.verify.verifiedDatabase": "হেলথ ক্লাব মেম্বারশিপ ডাটাবেজ ভেরিফাইড",
            "pages.verify.memberName": "সদস্যের নাম",
            "pages.verify.memberId": "মেম্বার আইডি",
            "pages.verify.memberType": "মেম্বারশিপ টাইপ",
            "pages.verify.expiryDate": "মেয়াদ উত্তীর্ণের তারিখ",
            "pages.verify.membershipStatus": "মেম্বারশিপ অবস্থা",
            "pages.verify.active": "সচল (ACTIVE)",
            "pages.verify.todoAtHospital": "হাসপাতাল কাউন্টারে করণীয়:",
            "pages.verify.todoStep1": "১. মেম্বারশিপ আইডি টি আপনার বিলিং সিস্টেমে এন্ট্রি করুন।",
            "pages.verify.todoStep2": "২. চুক্তি অনুযায়ী বিলে নির্ধারিত ডিসকাউন্ট রেট যোগ করুন।",
            "pages.verify.backToHome": "হোম পেজে ফিরে যান",
            "pages.verify.invalidId": "অবৈধ মেম্বার আইডি (INVALID)",
            "pages.verify.idNotFound": "মেম্বার আইডিটি ডাটাবেজে পাওয়া যায়নি",
            "pages.verify.sorry": "দুঃখিত!",
            "pages.verify.notFoundMessage": "প্রদত্ত মেম্বার আইডি সচল মেম্বার তালিকায় খুঁজে পাওয়া যায়নি।",
            "pages.verify.invalidDesc": "কার্ডের মেয়াদ উত্তীর্ণ হয়ে থাকতে পারে অথবা কিউআর কোডটি জাল হতে পারে।",
            "pages.verify.goToHome": "হোম পেজে যান",
            "pages.verify.contactCustomerSupport": "কাস্টমার সাপোর্টে কথা বলুন"
        }
    }
    
    with open(translations_file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # We want to insert the keys into translations.en and translations.bn
    # The file has:
    # export const translations = {
    #   en: {
    #     ...
    #   },
    #   bn: {
    #     ...
    #   }
    # }
    
    # Let's parse and reconstruct it
    # We can split the file, or just use string search
    en_start = content.find('en: {') + 5
    bn_start = content.find('bn: {') + 5
    
    # We will generate TS lines for the new translations
    en_lines = ""
    for k, v in sorted(new_translations['en'].items()):
        # Escape quotes
        val = v.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
        en_lines += f'    "{k}": "{val}",\n'
        
    bn_lines = ""
    for k, v in sorted(new_translations['bn'].items()):
        val = v.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
        bn_lines += f'    "{k}": "{val}",\n'
        
    # Reconstruct
    new_content = content[:en_start] + "\n" + en_lines + content[en_start:bn_start] + "\n" + bn_lines + content[bn_start:]
    
    with open(translations_file, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("Translations merged successfully!")

if __name__ == '__main__':
    merge_translations()
