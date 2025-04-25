import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, searchParams } = request.nextUrl;

  const hasEmailInQuery = searchParams.has("email");

  // ❌ No user: allow only specific routes
  if (!user) {
    const isAuthRoute =
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      (pathname.startsWith("/verify-otp") && hasEmailInQuery);

    if (!isAuthRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // 🔐 User exists but email not confirmed → force to /verify-otp
  if (user && !user.email_confirmed_at) {
    if (!pathname.startsWith("/verify-otp")) {
      const url = request.nextUrl.clone();
      url.pathname = "/verify-otp";
      return NextResponse.redirect(url);
    }
  }

  // ✅ If user is confirmed, prevent going to login or signup
  if (
    user?.email_confirmed_at &&
    (pathname.startsWith("/login") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/verify-otp"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
