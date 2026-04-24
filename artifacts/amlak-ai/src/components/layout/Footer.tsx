import { Link } from "wouter";
import { Phone, Mail, MapPin, Building2, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
              <Building2 className="h-8 w-8 text-secondary" />
              <span>املاک AI</span>
            </Link>
            <p className="text-primary-foreground/80 leading-relaxed text-sm">
              اولین پلتفرم هوشمند املاک در ایران. با استفاده از هوش مصنوعی، ملک رویایی خود را در تهران، کرج و مشهد پیدا کنید.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-secondary hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-secondary hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-primary-foreground/10 p-2 rounded-full hover:bg-secondary hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-secondary">ابزارهای هوشمند</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/price-estimator" className="text-primary-foreground/80 hover:text-secondary transition-colors">تخمین قیمت هوشمند</Link></li>
              <li><Link href="/ad-writer" className="text-primary-foreground/80 hover:text-secondary transition-colors">آگهی‌ساز خودکار</Link></li>
              <li><Link href="/chatbot" className="text-primary-foreground/80 hover:text-secondary transition-colors">مشاور هوشمند املاک</Link></li>
              <li><Link href="/tools" className="text-primary-foreground/80 hover:text-secondary transition-colors">همه ابزارها</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-secondary">دسترسی سریع</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="text-primary-foreground/80 hover:text-secondary transition-colors">صفحه اصلی</Link></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">درباره ما</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">تماس با ما</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">قوانین و مقررات</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-secondary">ارتباط با ما</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary shrink-0" />
                <span className="text-primary-foreground/80">تهران، خیابان ولیعصر، بالاتر از میدان ونک، برج نگار، طبقه ۱۵</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary shrink-0" />
                <a href="tel:09334001881" className="text-primary-foreground/80 hover:text-secondary transition-colors" dir="ltr">0933 400 1881</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary shrink-0" />
                <a href="mailto:info@amlak.ai" className="text-primary-foreground/80 hover:text-secondary transition-colors">info@amlak.ai</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} املاک AI. تمامی حقوق محفوظ است.</p>
          <p className="mt-2 md:mt-0">توسعه یافته توسط: احمد حسینی</p>
        </div>
      </div>
    </footer>
  );
}