"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Helper to get the correct URL (Local vs Vercel)
const getURL = () => {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";

  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;

  // Make sure to remove trailing slash
  url = url.charAt(url.length - 1) === "/" ? url.slice(0, -1) : url;

  return url;
};

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/login?error=true");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/login?error=signup_failed");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function loginWithGoogle() {
  const supabase = await createClient();

  // Use the helper to get the dynamic URL
  const redirectUrl = `${getURL()}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
}
