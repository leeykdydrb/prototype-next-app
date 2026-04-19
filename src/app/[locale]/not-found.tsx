"use client";

import { Button } from "@/components/framework/form";
import { Card, CardContent } from "@/components/framework/layout";
import { useRouter } from "@/i18n/navigation";
import { Home, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const router = useRouter();
  const t = useTranslations("NotFound");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-8">
      <div className="mb-8">
        <h1 className="text-8xl md:text-10rem font-bold leading-none mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
          404
        </h1>
      </div>

      <h2 className="text-2xl sm:text-3xl font-medium text-foreground mb-4">
        {t("title")}
      </h2>

      <p className="text-muted-foreground mb-8 max-w-lg">{t("description")}</p>

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-8">
        <Button
          size="lg"
          onClick={() => router.push("/")}
          className="min-w-40 cursor-pointer"
        >
          <Home className="mr-2 h-4 w-4" />
          {t("home")}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          className="min-w-40 cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("back")}
        </Button>
      </div>

      <Card className="max-w-sm">
        <CardContent className="text-sm text-muted-foreground">
          {t("help")}
        </CardContent>
      </Card>
    </div>
  );
}
