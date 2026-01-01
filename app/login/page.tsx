"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Mode = "login" | "register";
type Role = "student" | "instructor";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // Shared fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register-only
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>("student");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const buttonText = useMemo(() => {
    return mode === "login" ? "Login" : "Register";
  }, [mode]);

  const switchMode = (next: Mode) => {
    setMode(next);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const redirectByRole = async () => {
    // ✅ Fast: session is stored locally (no network)
    const { data: sessionRes } = await supabase.auth.getSession();
    const user = sessionRes.session?.user;

    if (!user) {
      router.replace("/");
      router.refresh();
      return;
    }

    // Fetch role from profiles
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    // If profiles query fails or role missing -> go home
    if (error || !profile?.role) {
      router.replace("/");
      router.refresh();
      return;
    }

    if (profile.role === "instructor") router.replace("/instructor");
    else router.replace("/student");

    router.refresh();
  };

  // ✅ If already logged in, don't show login page — redirect immediately
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!cancelled && data.session) {
          await redirectByRole();
          return;
        }
      } finally {
        if (!cancelled) setCheckingSession(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signInWithGoogle = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const origin = window.location.origin;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) setErrorMsg(error.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.push("/");
        router.refresh();

      } else {
        const origin = window.location.origin;

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: {
              full_name: username,
              role, // "student" | "instructor"
            },
          },
        });

        if (error) throw error;

        // If confirm email is ON, session is usually null here
        if (!data.session) {
          setSuccessMsg("Account created! Check your email to confirm, then login.");
          switchMode("login");
        } else {
          setSuccessMsg("Account created and signed in!");
        router.push("/");
        router.refresh();

        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Optional: show nothing (or a simple screen) while checking session
  if (checkingSession) {
    return (
      <main className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-900">
      {/* Background */}
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/vsu-bg.jpg')" }}
      >
        {/* Overlay */}
        <div className="min-h-screen bg-black/55 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-xl rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 shadow-xl p-6 md:p-8">
            {/* Title */}
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-4xl font-semibold">Welcome</h1>
              <p className="text-sm opacity-90 -mt-1">to VSU Merch Hub</p>
            </div>

            {/* Tabs */}
            <div className="mt-5 flex items-center justify-center">
              <div className="flex w-full max-w-md rounded-full bg-white/60 p-1">
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                  className={[
                    "flex-1 rounded-full py-2 text-sm font-medium transition",
                    mode === "login"
                      ? "bg-white text-black shadow"
                      : "text-black/70 hover:text-black",
                  ].join(" ")}
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => switchMode("register")}
                  className={[
                    "flex-1 rounded-full py-2 text-sm font-medium transition",
                    mode === "register"
                      ? "bg-white text-black shadow"
                      : "text-black/70 hover:text-black",
                  ].join(" ")}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {mode === "register" && (
                <>
                  <div>
                    <label className="block text-white text-sm mb-1">Username</label>
                    <input
                      className="w-full rounded-md bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/60"
                      placeholder="Your name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm mb-1">Role</label>
                    <select
                      className="w-full rounded-md bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/60"
                      value={role}
                      onChange={(e) => setRole(e.target.value as Role)}
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-white text-sm mb-1">Email</label>
                <input
                  className="w-full rounded-md bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/60"
                  placeholder="example@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-white text-sm mb-1">Password</label>
                <input
                  className="w-full rounded-md bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/60"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {errorMsg && <p className="text-sm text-red-200">{errorMsg}</p>}
              {successMsg && <p className="text-sm text-emerald-100">{successMsg}</p>}

              <button
                disabled={loading}
                className="w-full rounded-md bg-white text-black py-2 text-sm font-semibold shadow disabled:opacity-60"
              >
                {loading ? "Please wait..." : buttonText}
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="w-full rounded-md bg-white/90 hover:bg-white text-black py-2 text-sm font-medium shadow flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span className="text-lg">G</span>
                  Continue with Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
