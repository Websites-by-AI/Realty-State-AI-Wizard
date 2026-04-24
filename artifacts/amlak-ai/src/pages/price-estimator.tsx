import { useState } from "react";
import { Calculator, AlertCircle, Building2, MapPin, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEstimatePrice } from "@workspace/api-client-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

type PropertyType = "apartment" | "villa" | "office" | "commercial";

export default function PriceEstimator() {
  const [area, setArea] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");
  const [yearBuilt, setYearBuilt] = useState("");
  const [rooms, setRooms] = useState("");
  const [floor, setFloor] = useState("");
  const [hasParking, setHasParking] = useState(false);
  const [hasElevator, setHasElevator] = useState(false);
  const [hasStorage, setHasStorage] = useState(false);

  const estimateMutation = useEstimatePrice();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!area || !neighborhood || !propertyType) return;

    estimateMutation.mutate({
      data: {
        area: Number(area),
        neighborhood,
        propertyType,
        yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
        rooms: rooms ? Number(rooms) : undefined,
        floor: floor ? Number(floor) : undefined,
        hasParking,
        hasElevator,
        hasStorage,
      }
    });
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "medium": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "low": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getConfidenceLabel = (confidence: string) => {
    switch (confidence) {
      case "high": return "دقت بالا";
      case "medium": return "دقت متوسط";
      case "low": return "دقت پایین";
      default: return "نامشخص";
    }
  };

  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Calculator className="h-8 w-8 text-secondary" />
          تخمین قیمت هوشمند
        </h1>
        <p className="text-muted-foreground text-lg">
          مشخصات ملک خود را وارد کنید تا هوش مصنوعی املاک AI قیمت دقیق آن را تخمین بزند.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>مشخصات ملک</CardTitle>
              <CardDescription>اطلاعات دقیق‌تر = تخمین دقیق‌تر</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">نوع ملک</Label>
                    <Select value={propertyType} onValueChange={(v: PropertyType) => setPropertyType(v)}>
                      <SelectTrigger id="propertyType" dir="rtl">
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="apartment">آپارتمان</SelectItem>
                        <SelectItem value="villa">ویلایی</SelectItem>
                        <SelectItem value="office">اداری</SelectItem>
                        <SelectItem value="commercial">تجاری</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">محله</Label>
                    <Input 
                      id="neighborhood" 
                      placeholder="مثال: پونک" 
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">متراژ (متر مربع)</Label>
                    <Input 
                      id="area" 
                      type="number" 
                      placeholder="مثال: ۱۰۰" 
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      required
                      min="1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="yearBuilt">سال ساخت (شمسی)</Label>
                    <Input 
                      id="yearBuilt" 
                      type="number" 
                      placeholder="مثال: ۱۳۹۵" 
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rooms">تعداد اتاق</Label>
                    <Input 
                      id="rooms" 
                      type="number" 
                      placeholder="مثال: ۲" 
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="floor">طبقه</Label>
                    <Input 
                      id="floor" 
                      type="number" 
                      placeholder="مثال: ۳" 
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <Label>امکانات</Label>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Checkbox id="parking" checked={hasParking} onCheckedChange={(c) => setHasParking(c as boolean)} />
                      <Label htmlFor="parking" className="cursor-pointer">پارکینگ</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="elevator" checked={hasElevator} onCheckedChange={(c) => setHasElevator(c as boolean)} />
                      <Label htmlFor="elevator" className="cursor-pointer">آسانسور</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="storage" checked={hasStorage} onCheckedChange={(c) => setHasStorage(c as boolean)} />
                      <Label htmlFor="storage" className="cursor-pointer">انباری</Label>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={estimateMutation.isPending}>
                  {estimateMutation.isPending ? "در حال محاسبه..." : "تخمین قیمت"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          {estimateMutation.isPending ? (
            <Card className="h-full">
              <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-[400px] space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-xl bg-secondary/30 animate-pulse"></div>
                  <Calculator className="h-16 w-16 text-secondary animate-bounce relative z-10" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">هوش مصنوعی در حال تحلیل بازار است...</h3>
                  <p className="text-muted-foreground">بررسی صدها معامله اخیر در این منطقه</p>
                </div>
                <div className="w-full max-w-sm space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </CardContent>
            </Card>
          ) : estimateMutation.isSuccess && estimateMutation.data ? (
            <Card className="h-full border-secondary/30 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-8 text-center space-y-4 relative">
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getConfidenceColor(estimateMutation.data.confidence)}`}>
                    {getConfidenceLabel(estimateMutation.data.confidence)}
                  </span>
                </div>
                <p className="text-primary-foreground/80 font-medium">قیمت تخمینی</p>
                <h2 className="text-4xl md:text-5xl font-black text-secondary">
                  {estimateMutation.data.estimatedPrice.toLocaleString('fa-IR')} <span className="text-2xl font-normal text-primary-foreground/80">تومان</span>
                </h2>
                <p className="text-sm pt-2">
                  متری {estimateMutation.data.pricePerMeter.toLocaleString('fa-IR')} تومان
                </p>
              </div>
              <CardContent className="p-8 space-y-8">
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    تحلیل بازار در {neighborhood}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {estimateMutation.data.analysis}
                  </p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    روند بازار
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {estimateMutation.data.marketTrend}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
                  <div>
                    بازه قیمتی معقول: {estimateMutation.data.priceRange.min.toLocaleString('fa-IR')} تا {estimateMutation.data.priceRange.max.toLocaleString('fa-IR')} تومان
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.print()}>
                    چاپ گزارش
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : estimateMutation.isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>خطا در محاسبه</AlertTitle>
              <AlertDescription>
                متاسفانه در برقراری ارتباط با هوش مصنوعی مشکلی پیش آمد. لطفا دوباره تلاش کنید.
              </AlertDescription>
            </Alert>
          ) : (
            <Card className="h-full border-dashed bg-muted/20">
              <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground space-y-4">
                <Calculator className="h-16 w-16 opacity-20 mb-4" />
                <h3 className="text-xl font-medium text-foreground">منتظر اطلاعات شما هستیم</h3>
                <p className="max-w-xs">
                  فرم سمت راست را تکمیل کنید تا هوش مصنوعی املاک AI قیمت ملک شما را با بالاترین دقت تخمین بزند.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}