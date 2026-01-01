"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type Profile = {
  id: string;
  role: "student" | "instructor";
  full_name: string | null;
  student_id: string | null;
  phone_number: string | null;
  department: string | null;
  year_level: string | null;
  program: string | null;
  avatar_url: string | null;
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 border px-4 py-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/login");
        return;
      }

      setUser(data.user);

      const { data: p } = await supabase
        .from("profiles")
        .select(
          "id, role, full_name, student_id, phone_number, department, year_level, program, avatar_url"
        )
        .eq("id", data.user.id)
        .single();

      setProfile((p as Profile) ?? null);
      setLoading(false);
    };

    load();
  }, [router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user || !profile) return <div className="p-6">No profile found.</div>;

  const displayName =
    profile.full_name ??
    (user.user_metadata?.full_name as string | undefined) ??
    (user.email?.split("@")[0] ?? "User");

  const googleAvatar =
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined);

  const avatarUrl = profile.avatar_url ?? googleAvatar ?? null;

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl bg-white border shadow-sm p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="text-gray-700">My Profile</span>
          </div>

          <div className="mt-6 flex flex-col items-center text-center">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="avatar"
                className="h-20 w-20 rounded-full object-cover border"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold">
                {displayName[0]?.toUpperCase()}
              </div>
            )}

            <p className="mt-3 text-lg font-semibold">{displayName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>

            <span className="mt-2 inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold">
              {profile.role === "instructor" ? "Instructor" : "Student"}
            </span>

            <div className="w-full my-5 border-t" />
          </div>

          <div className="space-y-3">
            <Field label="Full Name" value={profile.full_name ?? displayName} />
            <Field label="Student ID" value={profile.student_id ?? "—"} />
            <Field label="Email" value={user.email ?? "—"} />
            <Field label="Phone Number" value={profile.phone_number ?? "—"} />
            <Field label="Department" value={profile.department ?? "—"} />
            <Field label="Year Level" value={profile.year_level ?? "—"} />
            <Field label="Program" value={profile.program ?? "—"} />
          </div>

          <button
            onClick={() => router.push("/profile/edit")}
            className="mt-5 w-full rounded-xl border bg-white hover:bg-gray-50 py-2 text-sm font-medium"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </main>
  );
}
