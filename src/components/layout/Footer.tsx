import Link from "next/link";
import { Heart, Phone, Mail, MapPin, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-slate-300 border-t border-slate-800" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">

          {/* Logo & Contact Info */}
          <div className="space-y-6 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 text-primary">
              <Heart className="h-6 w-6 fill-primary" />
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                হেলথ <span className="text-primary">ক্লাব</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs">
              স্বাস্থ্য সেবা হোক সহজ ও সাশ্রয়ী। হেলথ ক্লাব মেম্বারশিপের সাথে পান নির্ধারিত পার্টনার হাসপাতালে বিশেষ সুবিধা ও ডিসকাউন্ট।
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61591616953090"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </a>
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Group */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                লিঙ্কসমূহ
              </h3>
              <ul role="list" className="mt-4 space-y-3">
                <li>
                  <Link href="/" className="text-sm hover:text-white transition-colors">
                    হোম
                  </Link>
                </li>
                <li>
                  <Link href="/membership" className="text-sm hover:text-white transition-colors">
                    মেম্বারশিপ প্ল্যান
                  </Link>
                </li>
                <li>
                  <Link href="/partner-hospitals" className="text-sm hover:text-white transition-colors">
                    পার্টনার হাসপাতাল
                  </Link>
                </li>
                <li>
                  <Link href="/become-partner" className="text-sm hover:text-white transition-colors">
                    পার্টনার হোন
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="text-sm hover:text-white transition-colors">
                    আমাদের সম্পর্কে
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support and Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                যোগাযোগ ও ঠিকানা
              </h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 shrink-0 text-primary" />
                  <span>মিজান রোড, ফেনী - ৩৯০০</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href="tel:+8809612345678" className="hover:text-white transition-colors">
                    +৮৮০ ৯৬১২৩৪৫৬৭৮
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:support@healthclub.com.bd" className="hover:text-white transition-colors">
                    support@healthclub.com.bd
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} হেলথ ক্লাব। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex space-x-6 text-xs text-slate-500">
            <Link href="/privacy-policy" className="hover:text-slate-400 transition-colors">
              গোপনীয়তা নীতি
            </Link>
            <Link href="/terms-conditions" className="hover:text-slate-400 transition-colors">
              শর্তাবলী ও নিয়ম
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
