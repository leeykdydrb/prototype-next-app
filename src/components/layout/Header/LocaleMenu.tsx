"use client";

import { Button } from "@/components/framework/form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/framework/dropdown";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Check, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function LocaleMenu() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("LocaleMenu");
  const href = pathname || "/";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("aria")}
          className="shrink-0"
        >
          <Languages className="h-4 w-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={"max-h-[340px] overflow-y-auto"}>
        <DropdownMenuLabel>{t("menuTitle")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {routing.locales.map((lo) => (
          <DropdownMenuItem
            key={lo}
            className={cn(
              "cursor-pointer",
              locale === lo && "bg-accent focus:bg-accent"
            )}
            onClick={() => {
              if (lo !== locale) {
                router.push(href, { locale: lo });
              }
            }}
          >
            <span className="flex w-4 shrink-0 justify-center">
              {locale === lo ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : null}
            </span>
            {t(`lang.${lo}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
