import { useState } from "react";
import { Link } from "wouter";
import { Search, MapPin, Sparkles, ArrowLeft, Calculator, PenTool, MessageSquare, TrendingUp, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchProperty } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const TEHRAN_NEIGHBORHOODS = [
  "الهیه", "ولیعصر", "جردن", "زعفرانیه", "تهرانپارس", "پونک", 
  "شریعتی", "نیاوران", "فرمانیه", "ونک", "سعادت‌آباد", "یوسف‌آباد", "میرداماد", "دروس"
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchMutation = useSearchProperty();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    searchMutation.mutate({ data: { query: searchQuery } });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary"></div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded-full backdrop-blur-sm border border-primary-foreground/20 text-sm mb-4">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span>هوش مصنوعی در خدمت املاک ایران</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              آینده جستجوی ملک <br className="hidden md:block" />
              <span className="text-secondary">با هوش مصنوعی</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
              ملک رویایی خود را در تهران، کرج و مشهد پیدا کنید. با زبانی ساده بنویسید که چه می‌خواهید، هوش مصنوعی ما بهترین گزینه‌ها را برای شما پیدا می‌کند.
            </p>
            
            <div className="pt-8">
              <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <Input 
                  type="text" 
                  placeholder="مثال: یک آپارتمان ۱۰۰ متری در پونک با پارکینگ تا سقف ۵ میلیارد..."
                  className="w-full h-16 pl-16 pr-12 text-lg rounded-2xl bg-background text-foreground shadow-xl border-2 border-transparent focus-visible:border-secondary focus-visible:ring-0 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-2 left-2">
                  <Button 
                    type="submit" 
                    className="h-full rounded-xl px-6 bg-primary hover:bg-primary/90"
                    disabled={searchMutation.isPending}
                  >
                    {searchMutation.isPending ? "در حال جستجو..." : "جستجو"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchMutation.isSuccess && searchMutation.data && (
        <section className="py-12 bg-muted/30">
          <div className="container">
            <Card className="border-secondary/20 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/20 p-3 rounded-full text-secondary">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="space-y-4 flex-1">
                    <h3 className="text-xl font-bold">تحلیل هوش مصنوعی از جستجوی شما</h3>
                    <p className="text-muted-foreground leading-relaxed">{searchMutation.data.interpretation}</p>
                    
                    <div className="flex flex-wrap gap-2 pt-2">
                      {Object.entries(searchMutation.data.criteria).map(([key, value]) => {
                        if (!value || (Array.isArray(value) && value.length === 0)) return null;
                        
                        let displayValue = String(value);
                        let label = key;
                        
                        if (key === 'neighborhood') label = 'محله';
                        if (key === 'minArea') label = 'حداقل متراژ';
                        if (key === 'maxArea') label = 'حداکثر متراژ';
                        if (key === 'rooms') label = 'تعداد خواب';
                        if (key === 'maxPrice') {
                          label = 'حداکثر قیمت';
                          displayValue = Number(value).toLocaleString('fa-IR') + ' تومان';
                        }
                        if (key === 'propertyType') label = 'نوع ملک';
                        if (key === 'features') {
                          label = 'امکانات';
                          displayValue = Array.isArray(value) ? value.join('، ') : String(value);
                        }
                        
                        return (
                          <div key={key} className="bg-background border border-border px-3 py-1.5 rounded-md text-sm flex gap-2">
                            <span className="text-muted-foreground">{label}:</span>
                            <span className="font-semibold">{displayValue}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {searchMutation.data.suggestions && searchMutation.data.suggestions.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-border">
                        <h4 className="font-semibold mb-3">پیشنهادات هوشمند:</h4>
                        <ul className="space-y-2">
                          {searchMutation.data.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground before:content-[''] before:w-1.5 before:h-1.5 before:bg-secondary before:rounded-full">
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* AI Tools Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold">ابزارهای هوشمند املاک</h2>
            <p className="text-muted-foreground">
              با استفاده از جدیدترین تکنولوژی‌های هوش مصنوعی، فرآیند خرید، فروش و اجاره ملک را سریع‌تر و هوشمندانه‌تر تجربه کنید.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:border-secondary/50 transition-colors overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-8 space-y-6">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                  <Calculator className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold">تخمین قیمت هوشمند</h3>
                <p className="text-muted-foreground leading-relaxed">
                  با وارد کردن مشخصات ملک خود، ارزش واقعی آن را بر اساس تحلیل داده‌های بازار و هوش مصنوعی تخمین بزنید.
                </p>
                <Button asChild variant="outline" className="w-full group-hover:bg-secondary group-hover:text-primary group-hover:border-secondary transition-colors">
                  <Link href="/price-estimator" className="flex items-center justify-between">
                    <span>تخمین قیمت</span>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:border-secondary/50 transition-colors overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-8 space-y-6">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                  <PenTool className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold">آگهی‌ساز خودکار</h3>
                <p className="text-muted-foreground leading-relaxed">
                  متن‌های جذاب و حرفه‌ای برای آگهی‌های املاک خود در دیوار و شیپور تنها با چند کلیک و با کمک هوش مصنوعی بسازید.
                </p>
                <Button asChild variant="outline" className="w-full group-hover:bg-secondary group-hover:text-primary group-hover:border-secondary transition-colors">
                  <Link href="/ad-writer" className="flex items-center justify-between">
                    <span>ساخت آگهی</span>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:border-secondary/50 transition-colors overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-8 space-y-6">
                <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold">مشاور هوشمند</h3>
                <p className="text-muted-foreground leading-relaxed">
                  یک مشاور املاک مجازی و ۲۴ ساعته که به تمام سوالات شما درباره بازار مسکن، قوانین و شرایط پاسخ می‌دهد.
                </p>
                <Button asChild variant="outline" className="w-full group-hover:bg-secondary group-hover:text-primary group-hover:border-secondary transition-colors">
                  <Link href="/chatbot" className="flex items-center justify-between">
                    <span>شروع گفتگو</span>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Neighborhoods */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">محله‌های پرطرفدار تهران</h2>
              <p className="text-muted-foreground">جستجوی ملک در بهترین محله‌های پایتخت</p>
            </div>
            <Button variant="outline" className="hidden sm:flex">مشاهده همه محله‌ها</Button>
          </div>

          <div className="flex flex-wrap gap-3">
            {TEHRAN_NEIGHBORHOODS.map((neighborhood, i) => (
              <div 
                key={neighborhood} 
                className="bg-background border border-border hover:border-secondary hover:text-primary transition-colors px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <MapPin className="h-4 w-4 text-secondary" />
                <span className="font-medium">{neighborhood}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-x-reverse divide-primary-foreground/10">
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-black text-secondary">۱۵۰+</p>
              <p className="text-primary-foreground/80">محله تحت پوشش</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-black text-secondary">۹۸٪</p>
              <p className="text-primary-foreground/80">دقت تخمین قیمت</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-black text-secondary">۱۰k+</p>
              <p className="text-primary-foreground/80">کاربر فعال</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl md:text-5xl font-black text-secondary">۲۴/۷</p>
              <p className="text-primary-foreground/80">پشتیبانی هوشمند</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}