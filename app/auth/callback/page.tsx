"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get("code");

    // If no code, just go back to login
    if (!code) {
      router.replace("/login");
      return;
    }

    (async () => {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code);

      router.replace("/");
      router.refresh();
    })();
  }, [params, router]);

  return <p className="p-6 text-white">Signing you in...</p>;
}
