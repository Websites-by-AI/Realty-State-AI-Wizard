import { Link } from "wouter";
import { Building2, MessageSquare, Calculator, PenTool, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Building2 className="h-6 w-6 text-secondary" />
          <span>املاک AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/price-estimator" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            تخمین قیمت
          </Link>
          <Link href="/ad-writer" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            آگهی‌ساز
          </Link>
          <Link href="/chatbot" className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            مشاور هوشمند
          </Link>
          <Link href="/tools" className="transition-colors hover:text-foreground/80 text-foreground/60">
            همه ابزارها
          </Link>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="text-lg font-semibold">صفحه اصلی</Link>
              <Link href="/price-estimator" className="text-lg font-semibold flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                تخمین قیمت
              </Link>
              <Link href="/ad-writer" className="text-lg font-semibold flex items-center gap-2">
                <PenTool className="h-5 w-5" />
                آگهی‌ساز
              </Link>
              <Link href="/chatbot" className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                مشاور هوشمند
              </Link>
              <Link href="/tools" className="text-lg font-semibold">همه ابزارها</Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}