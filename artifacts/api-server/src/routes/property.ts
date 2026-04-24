import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import {
  EstimatePriceBody,
  GenerateAdBody,
  SearchPropertyBody,
} from "@workspace/api-zod";

const router = Router();

router.post("/property/estimate-price", async (req, res) => {
  try {
    const parsed = EstimatePriceBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const {
      area,
      neighborhood,
      yearBuilt,
      rooms,
      floor,
      totalFloors,
      hasParking,
      hasElevator,
      hasStorage,
      propertyType,
    } = parsed.data;

    const prompt = `
شما یک کارشناس ارزیابی قیمت ملک در تهران هستید. با توجه به اطلاعات زیر، قیمت ملک را به تومان تخمین بزنید:

- نوع ملک: ${propertyType === "apartment" ? "آپارتمان" : propertyType === "villa" ? "ویلا" : propertyType === "office" ? "اداری" : "تجاری"}
- متراژ: ${area} متر مربع
- محله: ${neighborhood}
- سال ساخت: ${yearBuilt ? yearBuilt + " شمسی" : "نامشخص"}
- تعداد اتاق: ${rooms ?? "نامشخص"}
- طبقه: ${floor ?? "نامشخص"} از ${totalFloors ?? "نامشخص"} طبقه
- پارکینگ: ${hasParking ? "دارد" : "ندارد"}
- آسانسور: ${hasElevator ? "دارد" : "ندارد"}
- انباری: ${hasStorage ? "دارد" : "ندارد"}

لطفاً پاسخ را به صورت JSON با این فرمت بده:
{
  "estimatedPrice": <عدد به تومان>,
  "pricePerMeter": <عدد قیمت هر متر به تومان>,
  "priceRange": { "min": <عدد>, "max": <عدد> },
  "confidence": "<high|medium|low>",
  "analysis": "<تحلیل فارسی ۲-۳ جمله‌ای>",
  "marketTrend": "<توضیح روند بازار در این محله به فارسی>"
}

فقط JSON خروجی بده، هیچ توضیح اضافه‌ای نده.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
    const result = JSON.parse(cleaned);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error estimating price");
    res.status(500).json({ error: "Failed to estimate price" });
  }
});

router.post("/property/generate-ad", async (req, res) => {
  try {
    const parsed = GenerateAdBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const {
      propertyType,
      transactionType,
      area,
      rooms,
      neighborhood,
      floor,
      features,
      price,
      contactInfo,
      platform,
    } = parsed.data;

    const typeMap: Record<string, string> = {
      apartment: "آپارتمان",
      villa: "ویلا",
      office: "اداری",
      commercial: "تجاری",
    };
    const transMap: Record<string, string> = {
      sale: "فروش",
      rent: "اجاره",
      mortgage: "رهن",
    };
    const platformMap: Record<string, string> = {
      divar: "دیوار",
      sheypoor: "شیپور",
      general: "عمومی",
    };

    const prompt = `
شما یک کپی‌رایتر متخصص آگهی‌های ملک در ایران هستید. یک آگهی جذاب و حرفه‌ای برای پلتفرم ${platformMap[platform]} بنویس.

مشخصات ملک:
- نوع: ${typeMap[propertyType]}
- نوع معامله: ${transMap[transactionType]}
- متراژ: ${area} متر
- اتاق: ${rooms ?? "نامشخص"}
- محله: ${neighborhood}
- طبقه: ${floor ?? "نامشخص"}
- ویژگی‌ها: ${features?.join("، ") ?? "نامشخص"}
- قیمت: ${price ? price.toLocaleString() + " تومان" : "توافقی"}
- اطلاعات تماس: ${contactInfo ?? ""}

خروجی به صورت JSON:
{
  "title": "<عنوان جذاب آگهی>",
  "description": "<متن کامل آگهی به فارسی با جزئیات>",
  "tags": ["<تگ ۱>", "<تگ ۲>", "<تگ ۳>"]
}

فقط JSON بده.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
    const result = JSON.parse(cleaned);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error generating ad");
    res.status(500).json({ error: "Failed to generate ad" });
  }
});

router.post("/property/search", async (req, res) => {
  try {
    const parsed = SearchPropertyBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const { query } = parsed.data;

    const prompt = `
شما یک دستیار هوشمند جستجوی ملک در تهران هستید. کاربر این جستجو را نوشته:
"${query}"

اطلاعات را استخراج کن و پاسخ به فارسی بده. خروجی JSON:
{
  "interpretation": "<تفسیر فارسی درخواست کاربر>",
  "criteria": {
    "neighborhood": "<محله یا منطقه اگر مشخص شده>",
    "minArea": <حداقل متراژ یا null>,
    "maxArea": <حداکثر متراژ یا null>,
    "rooms": <تعداد اتاق یا null>,
    "propertyType": "<apartment|villa|office|commercial یا null>",
    "maxPrice": <حداکثر قیمت به تومان یا null>,
    "features": ["<ویژگی‌های مورد نظر>"]
  },
  "suggestions": ["<پیشنهاد جایگزین ۱>", "<پیشنهاد ۲>"]
}

فقط JSON.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content ?? "{}";
    const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
    const result = JSON.parse(cleaned);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error searching property");
    res.status(500).json({ error: "Failed to search property" });
  }
});

export default router;
