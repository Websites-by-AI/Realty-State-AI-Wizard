import { Link } from "wouter";
import { Calculator, PenTool, MessageSquare, ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Tools() {
  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-12 space-y-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Building2 className="h-8 w-8 text-secondary" />
          ابزارهای هوش مصنوعی املاک
        </h1>
        <p className="text-muted-foreground text-lg">
          مجموعه‌ای از ابزارهای پیشرفته مبتنی بر هوش مصنوعی برای کمک به شما در بازار املاک ایران.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="group hover:border-secondary/50 transition-colors overflow-hidden flex flex-col">
          <div className="h-2 w-full bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="p-8 flex flex-col flex-1 space-y-6">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <Calculator className="h-7 w-7" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-2xl font-bold">تخمین قیمت هوشمند</h3>
              <p className="text-muted-foreground leading-relaxed">
                با وارد کردن مشخصات ملک خود، ارزش واقعی آن را بر اساس تحلیل داده‌های بازار و هوش مصنوعی تخمین بزنید.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full group-hover:bg-secondary group-hover:text-primary group-hover:border-secondary transition-colors mt-auto">
              <Link href="/price-estimator" className="flex items-center justify-between">
                <span>تخمین قیمت</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:border-secondary/50 transition-colors overflow-hidden flex flex-col">
          <div className="h-2 w-full bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="p-8 flex flex-col flex-1 space-y-6">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <PenTool className="h-7 w-7" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-2xl font-bold">آگهی‌ساز خودکار</h3>
              <p className="text-muted-foreground leading-relaxed">
                متن‌های جذاب و حرفه‌ای برای آگهی‌های املاک خود در دیوار و شیپور تنها با چند کلیک و با کمک هوش مصنوعی بسازید.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full group-hover:bg-secondary group-hover:text-primary group-hover:border-secondary transition-colors mt-auto">
              <Link href="/ad-writer" className="flex items-center justify-between">
                <span>ساخت آگهی</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:border-secondary/50 transition-colors overflow-hidden flex flex-col">
          <div className="h-2 w-full bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <CardContent className="p-8 flex flex-col flex-1 space-y-6">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
              <MessageSquare className="h-7 w-7" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="text-2xl font-bold">مشاور هوشمند</h3>
              <p className="text-muted-foreground leading-relaxed">
                یک مشاور املاک مجازی و ۲۴ ساعته که به تمام سوالات شما درباره بازار مسکن، قوانین و شرایط پاسخ می‌دهد.
              </p>
            </div>
            <Button asChild variant="outline" className="w-full group-hover:bg-secondary group-hover:text-primary group-hover:border-secondary transition-colors mt-auto">
              <Link href="/chatbot" className="flex items-center justify-between">
                <span>شروع گفتگو</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}