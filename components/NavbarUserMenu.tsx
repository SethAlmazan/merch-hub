"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type Profile = {
  id: string;
  role: "student" | "instructor";
  full_name: string | null;
  avatar_url: string | null;
};

export default function NavbarUserMenu() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        // ✅ Fast: reads session locally (no network)
        const { data } = await supabase.auth.getSession();
        const u = data.session?.user ?? null;

        if (cancelled) return;
        setUser(u);

        if (u) {
          // ✅ maybeSingle() won't throw if 0 rows
          const { data: p, error } = await supabase
            .from("profiles")
            .select("id, role, full_name, avatar_url")
            .eq("id", u.id)
            .maybeSingle();

          if (!cancelled) {
            if (error) {
              console.error("profiles select error:", error);
              setProfile(null);
            } else {
              setProfile((p as Profile) ?? null);
            }
          }
        } else {
          if (!cancelled) setProfile(null);
        }
      } catch (err) {
        console.error("NavbarUserMenu load error:", err);
        if (!cancelled) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // ✅ safety timeout so it never "hangs forever"
    const timer = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 2500);

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/login");
    router.refresh();
  };

  // ✅ While checking session, just show Login button (so UI never blocks)
  if (loading) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-black px-4 py-2 text-xs md:text-sm font-medium text-white hover:bg-gray-800"
      >
        Login
      </Link>
    );
  }

  // ✅ Not logged in
  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-black px-4 py-2 text-xs md:text-sm font-medium text-white hover:bg-gray-800"
      >
        Login
      </Link>
    );
  }

  const displayName =
    profile?.full_name ??
    (user.user_metadata?.full_name as string | undefined) ??
    (user.email?.split("@")[0] ?? "Account");

  const initial = displayName?.trim()?.[0]?.toUpperCase() ?? "U";

  const googleAvatar =
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined);

  const avatarUrl = profile?.avatar_url ?? googleAvatar ?? null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-gray-100"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="avatar"
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold">
            {initial}
          </div>
        )}

        <span className="hidden sm:block text-sm font-medium">{displayName}</span>
        <span className="text-xs text-gray-500">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg overflow-hidden">
          <div className="px-4 py-3 border-b">
            <p className="text-xs text-gray-500">My Account</p>
            <p className="text-sm font-semibold truncate">{user.email}</p>
            <p className="mt-1 text-xs text-gray-500">
              Role:{" "}
              <span className="font-medium text-gray-700">
                {profile?.role ?? "student"}
              </span>
            </p>
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm hover:bg-gray-50"
          >
            Profile
          </Link>

          <Link
            href="/orders"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm hover:bg-gray-50"
          >
            My Orders
          </Link>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm hover:bg-gray-50"
          >
            Account Settings
          </Link>

          <button
            type="button"
            onClick={signOut}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-t"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
