"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [picture, setPicture] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && pin.trim().length > 0 && !submitting;
  }, [email, pin, submitting]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          pin: pin.trim(),
          profile: { name: name.trim(), about: about.trim(), picture: picture.trim() },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Login failed");
      }
      toast.success("Logged in");
      router.replace("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b141a] text-zinc-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6">
        <div className="rounded-2xl border border-zinc-800 bg-[#111b21] p-6 shadow-xl">
          <div className="text-xl font-semibold">Login</div>
          <div className="mt-1 text-sm text-zinc-400">Enter your details to continue.</div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block">
              <div className="text-xs font-medium text-zinc-300">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-[#0b141a] px-3 py-2 text-sm outline-none focus:border-emerald-500"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <div className="text-xs font-medium text-zinc-300">PIN</div>
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-[#0b141a] px-3 py-2 text-sm outline-none focus:border-emerald-500"
                placeholder="4+ digits"
                autoComplete="one-time-code"
                inputMode="numeric"
              />
              <div className="mt-1 text-[11px] text-zinc-500">
                Use the same PIN next time to log in.
              </div>
            </label>

            <div className="my-1 h-px w-full bg-zinc-800" />

            <div className="text-xs font-medium text-zinc-400">
              Profile (optional)
            </div>

            <label className="block">
              <div className="text-xs font-medium text-zinc-300">Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-[#0b141a] px-3 py-2 text-sm outline-none focus:border-emerald-500"
                placeholder="Your name"
                autoComplete="name"
              />
            </label>

            <label className="block">
              <div className="text-xs font-medium text-zinc-300">About</div>
              <input
                value={about}
                onChange={(e) => setAbout(e.target.value.slice(0, 33))}
                maxLength={33}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-[#0b141a] px-3 py-2 text-sm outline-none focus:border-emerald-500"
                placeholder="Hey there! I am using WhatsApp."
              />
            </label>

            <label className="block">
              <div className="text-xs font-medium text-zinc-300">Picture URL (optional)</div>
              <input
                value={picture}
                onChange={(e) => setPicture(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-[#0b141a] px-3 py-2 text-sm outline-none focus:border-emerald-500"
                placeholder="https://..."
                autoComplete="url"
              />
            </label>

            {error ? <div className="text-sm text-red-400">{error}</div> : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <div className="mt-4 text-center text-xs text-zinc-500">
          This is a simple demo email + PIN login (cookie-based).
        </div>
      </div>
    </div>
  );
}
