import { NextRequest } from "next/server";
import { signIn } from "@/lib/auth-keycloak";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider?: string }> }
) {
  const { provider } = await params;
  
  if (!provider) {
    return new Response("Provider not specified", { status: 400 });
  }

  const url = new URL(req.url);
  const callbackUrl = url.searchParams.get("callbackUrl") ?? "/";

  return signIn(provider, { redirectTo: callbackUrl });
}