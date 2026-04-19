import { notFound } from "next/navigation";

/**
 * /ko/xxx 처럼 [locale] 아래에서 다른 라우트와 매칭되지 않는 경로는
 * Next.js가 기본 404를 쓰므로, 여기서 notFound()를 호출해
 * app/[locale]/not-found.tsx 가 렌더되도록 함.
 * @see https://next-intl.dev/docs/environments/error-files#not-foundjs
 */
export default function CatchAllUnknownLocaleRoute() {
  notFound();
}
