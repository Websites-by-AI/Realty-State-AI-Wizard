import { useState } from "react";
import { PenTool, Copy, CheckCircle2, FileText, Smartphone, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateAd } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PropertyType = "apartment" | "villa" | "office" | "commercial";
type TransactionType = "sale" | "rent" | "mortgage";
type PlatformType = "divar" | "sheypoor" | "general";

export default function AdWriter() {
  const { toast } = useToast();
  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");
  const [transactionType, setTransactionType] = useState<TransactionType>("sale");
  const [platform, setPlatform] = useState<PlatformType>("divar");
  
  const [area, setArea] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [rooms, setRooms] = useState("");
  const [floor, setFloor] = useState("");
  const [features, setFeatures] = useState("");
  const [price, setPrice] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const [copied, setCopied] = useState(false);

  const generateMutation = useGenerateAd();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!area || !neighborhood || !propertyType || !transactionType || !platform) return;

    const featureList = features.split(/[،,-]/).map(f => f.trim()).filter(f => f.length > 0);

    generateMutation.mutate({
      data: {
        propertyType,
        transactionType,
        platform,
        area: Number(area),
        neighborhood,
        rooms: rooms ? Number(rooms) : undefined,
        floor: floor ? Number(floor) : undefined,
        features: featureList.length > 0 ? featureList : undefined,
        price: price ? Number(price) : undefined,
        contactInfo: contactInfo || undefined,
      }
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "کپی شد!",
      description: "متن آگهی در کلیپ‌بورد کپی شد.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-12 max-w-5xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <PenTool className="h-8 w-8 text-secondary" />
          آگهی‌ساز هوشمند
        </h1>
        <p className="text-muted-foreground text-lg">
          اطلاعات ملک خود را وارد کنید تا بهترین متن آگهی برای پلتفرم‌های مختلف با استفاده از هوش مصنوعی تولید شود.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>مشخصات آگهی</CardTitle>
              <CardDescription>جزئیات ملک را برای متن بهتر وارد کنید</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>پلتفرم هدف</Label>
                    <Tabs value={platform} onValueChange={(v) => setPlatform(v as PlatformType)} className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="divar">دیوار</TabsTrigger>
                        <TabsTrigger value="sheypoor">شیپور</TabsTrigger>
                        <TabsTrigger value="general">عمومی</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="transactionType">نوع معامله</Label>
                      <Select value={transactionType} onValueChange={(v: TransactionType) => setTransactionType(v)}>
                        <SelectTrigger id="transactionType" dir="rtl">
                          <SelectValue placeholder="انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent dir="rtl">
                          <SelectItem value="sale">فروش</SelectItem>
                          <SelectItem value="rent">اجاره</SelectItem>
                          <SelectItem value="mortgage">رهن کامل</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">محله</Label>
                      <Input 
                        id="neighborhood" 
                        placeholder="مثال: سعادت‌آباد" 
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="area">متراژ (متر)</Label>
                      <Input 
                        id="area" 
                        type="number" 
                        placeholder="مثال: ۱۲۰" 
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        required
                        min="1"
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
                        placeholder="مثال: ۴" 
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">قیمت کل یا رهن (تومان) - اختیاری</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      placeholder="مثال: 5000000000" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features">ویژگی‌های برجسته (با کاما جدا کنید)</Label>
                    <Textarea 
                      id="features" 
                      placeholder="مثال: نورگیر عالی، دسترسی به مترو، بالکن بزرگ، نوساز" 
                      value={features}
                      onChange={(e) => setFeatures(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactInfo">اطلاعات تماس (اختیاری)</Label>
                    <Input 
                      id="contactInfo" 
                      placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹ - مهندس محمدی" 
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={generateMutation.isPending}>
                  {generateMutation.isPending ? "در حال نوشتن آگهی..." : "تولید آگهی جادویی"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          {generateMutation.isPending ? (
            <Card className="h-full">
              <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-[500px] space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-xl bg-secondary/30 animate-pulse"></div>
                  <FileText className="h-16 w-16 text-secondary animate-pulse relative z-10" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">در حال نگارش آگهی جذاب...</h3>
                  <p className="text-muted-foreground">با استفاده از اصول کپی‌رایتینگ و روانشناسی فروش</p>
                </div>
                <div className="w-full space-y-3 pt-8">
                  <Skeleton className="h-6 w-3/4 mb-6" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6 mt-4" />
                </div>
              </CardContent>
            </Card>
          ) : generateMutation.isSuccess && generateMutation.data ? (
            <Card className="h-full border-secondary/30 shadow-md flex flex-col">
              <CardHeader className="bg-muted/50 border-b pb-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl leading-relaxed">{generateMutation.data.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Smartphone className="h-4 w-4" />
                      <span>آماده برای انتشار در {platform === 'divar' ? 'دیوار' : platform === 'sheypoor' ? 'شیپور' : 'همه پلتفرم‌ها'}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleCopy(`${generateMutation.data.title}\n\n${generateMutation.data.description}`)}
                    className="shrink-0"
                  >
                    {copied ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 flex-1">
                <div className="whitespace-pre-wrap leading-relaxed text-foreground/90 font-medium">
                  {generateMutation.data.description}
                </div>
                
                {generateMutation.data.tags && generateMutation.data.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
                      <Megaphone className="h-4 w-4" />
                      هشتگ‌های پیشنهادی:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {generateMutation.data.tags.map((tag, idx) => (
                        <span key={idx} className="bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium border border-secondary/20">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-muted/30 border-t p-4 flex justify-between items-center text-sm">
                <span className="text-muted-foreground">تولید شده توسط هوش مصنوعی املاک AI</span>
                <Button variant="ghost" size="sm" onClick={() => generateMutation.reset()}>
                  ساخت آگهی جدید
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-full border-dashed bg-muted/20">
              <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-[500px] text-center text-muted-foreground space-y-4">
                <PenTool className="h-16 w-16 opacity-20 mb-4" />
                <h3 className="text-xl font-medium text-foreground">متن آگهی شما اینجا نمایش داده می‌شود</h3>
                <p className="max-w-sm">
                  یک آگهی خوب می‌تواند سرعت فروش یا اجاره ملک شما را تا ۳ برابر افزایش دهد. فرم را پر کنید تا بهترین متن را برای شما آماده کنیم.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}