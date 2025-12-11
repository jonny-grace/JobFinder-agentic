import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // SUCCESS: Redirect to dashboard
      // We use 'origin' to ensure we stay on the same domain (localhost or vercel)
      const forwardedHost = request.headers.get("x-forwarded-host"); // helper for vercel
      const isLocal = origin.includes("localhost");

      if (isLocal) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else {
      console.error("Auth Callback Error:", error);
    }
  }

  // FAILURE: Redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_code_error`);
}
