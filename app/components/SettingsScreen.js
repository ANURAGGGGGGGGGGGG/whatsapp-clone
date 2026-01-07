"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import KeyboardShortcuts from "./KeyboardShortcuts";

function SmallIcon({ d, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}

function SettingsFilledIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      fill="none"
    >
      <title>settings-filled-refreshed</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.66248 21.55C9.98748 21.85 10.375 22 10.825 22H13.175C13.625 22 14.0125 21.85 14.3375 21.55C14.6625 21.25 14.8583 20.8833 14.925 20.45L15.15 18.8C15.35 18.7167 15.55 18.6167 15.75 18.5C15.95 18.3833 16.1416 18.2583 16.325 18.125L17.825 18.775C18.2416 18.9583 18.6583 18.975 19.075 18.825C19.4916 18.675 19.8166 18.4083 20.05 18.025L21.25 15.975C21.4833 15.5917 21.55 15.1833 21.45 14.75C21.35 14.3167 21.125 13.9583 20.775 13.675L19.45 12.675C19.4833 12.5583 19.5 12.4458 19.5 12.3375V11.6625C19.5 11.5542 19.4916 11.4417 19.475 11.325L20.8 10.325C21.15 10.0417 21.375 9.68333 21.475 9.25C21.575 8.81667 21.5083 8.40833 21.275 8.025L20.1 5.975C19.8666 5.59167 19.5416 5.325 19.125 5.175C18.7083 5.025 18.2916 5.04167 17.875 5.225L16.325 5.875C16.1416 5.74167 15.9541 5.61667 15.7625 5.5C15.5708 5.38333 15.3666 5.28333 15.15 5.2L14.925 3.55C14.8583 3.11667 14.6625 2.75 14.3375 2.45C14.0125 2.15 13.625 2 13.175 2H10.825C10.375 2 9.98748 2.15 9.66248 2.45C9.33748 2.75 9.14165 3.11667 9.07498 3.55L8.84998 5.2C8.64998 5.28333 8.44998 5.38333 8.24998 5.5C8.04998 5.61667 7.85831 5.74167 7.67498 5.875L6.12498 5.225C5.70831 5.04167 5.29165 5.025 4.87498 5.175C4.45831 5.325 4.13331 5.59167 3.89998 5.975L2.72498 8.025C2.49165 8.40833 2.42498 8.81667 2.52498 9.25C2.62498 9.68333 2.84998 10.0417 3.19998 10.325L4.52498 11.325C4.50831 11.4417 4.49998 11.5542 4.49998 11.6625V12.3375C4.49998 12.4458 4.50831 12.5583 4.52498 12.675L3.19998 13.675C2.84998 13.9583 2.62498 14.3167 2.52498 14.75C2.42498 15.1833 2.49165 15.5917 2.72498 15.975L3.89998 18.025C4.13331 18.4083 4.45831 18.675 4.87498 18.825C5.29165 18.975 5.70831 18.9583 6.12498 18.775L7.67498 18.125C7.85831 18.2583 8.04581 18.3833 8.23748 18.5C8.42915 18.6167 8.63331 18.7167 8.84998 18.8L9.07498 20.45C9.14165 20.8833 9.33748 21.25 9.66248 21.55ZM12 15C12.8286 15 13.5357 14.7071 14.1214 14.1214C14.7071 13.5357 15 12.8286 15 12C15 11.1714 14.7071 10.4643 14.1214 9.87857C13.5357 9.29286 12.8286 9 12 9C11.1571 9 10.4464 9.29286 9.86786 9.87857C9.28929 10.4643 9 11.1714 9 12C9 12.8286 9.28929 13.5357 9.86786 14.1214C10.4464 14.7071 11.1571 15 12 15Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InitialAvatar({ name }) {
  const initials = useMemo(() => {
    if (!name) return "";
    return name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [name]);

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700 text-sm font-semibold text-white">
      {initials}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-colors ${
        checked ? "bg-emerald-500" : "bg-zinc-700"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

const COUNTRIES = [
  { code: "US", name: "United States", dial: "+1", min: 10, max: 10 },
  { code: "CA", name: "Canada", dial: "+1", min: 10, max: 10 },
  { code: "GB", name: "United Kingdom", dial: "+44", min: 10, max: 11 },
  { code: "IN", name: "India", dial: "+91", min: 10, max: 10 },
  { code: "PK", name: "Pakistan", dial: "+92", min: 10, max: 10 },
  { code: "BD", name: "Bangladesh", dial: "+880", min: 10, max: 10 },
  { code: "NP", name: "Nepal", dial: "+977", min: 10, max: 10 },
  { code: "AU", name: "Australia", dial: "+61", min: 9, max: 9 },
  { code: "NZ", name: "New Zealand", dial: "+64", min: 8, max: 10 },
  { code: "DE", name: "Germany", dial: "+49", min: 7, max: 11 },
  { code: "FR", name: "France", dial: "+33", min: 9, max: 9 },
  { code: "ES", name: "Spain", dial: "+34", min: 9, max: 9 },
  { code: "IT", name: "Italy", dial: "+39", min: 6, max: 11 },
  { code: "BR", name: "Brazil", dial: "+55", min: 10, max: 11 },
  { code: "AE", name: "United Arab Emirates", dial: "+971", min: 8, max: 9 },
  { code: "SA", name: "Saudi Arabia", dial: "+966", min: 9, max: 9 },
];
const USER_ID_STORAGE_KEY = "whatsapp_clone.userId";

export default function SettingsScreen({
  userId: providedUserId = "",
  profileName = "You",
  profileSubtitle = "Hey there! I am using WhatsApp.",
  initialActive = null,
  onProfileChange,
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [active, setActive] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [privacyPrefs, setPrivacyPrefs] = useState({
    readReceipts: true,
    blockUnknownMessages: false,
    disableLinkPreviews: false,
  });
  const [chatPrefs, setChatPrefs] = useState({
    spellCheck: true,
    replaceWithEmoji: true,
    enterIsSend: true,
  });
  const [notificationPrefs, setNotificationPrefs] = useState({
    showPreviews: true,
    playSoundOutgoing: false,
    backgroundSync: false,
  });

  const [helpPrefs, setHelpPrefs] = useState({ joinBeta: false });

  const [showShortcuts, setShowShortcuts] = useState(false);
  const defaultProfile = useMemo(
    () => ({
      name: profileName,
      about: profileSubtitle,
      phone: "",
      picture: "",
    }),
    [profileName, profileSubtitle]
  );

  const [resolvedUserId, setResolvedUserId] = useState(() => String(providedUserId || ""));
  const [profile, setProfile] = useState(defaultProfile);
  const [profileReady, setProfileReady] = useState(false);
  const skipNextPersistRef = useRef(true);
  const defaultProfileRef = useRef(defaultProfile);
  const [editing, setEditing] = useState(null);
  const [draftValue, setDraftValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [phoneCountry, setPhoneCountry] = useState("US");
  const [phoneNational, setPhoneNational] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const selectedPhoneCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.code === phoneCountry) || COUNTRIES[0];
  }, [phoneCountry]);

  useEffect(() => {
    if (editing?.field !== "phone") return;
    const max = selectedPhoneCountry?.max ?? 15;
    setPhoneNational((prev) => prev.slice(0, max));
    setPhoneError("");
  }, [editing?.field, selectedPhoneCountry]);

  useEffect(() => {
    setActive(initialActive ?? null);
  }, [initialActive]);

  useEffect(() => {
    defaultProfileRef.current = defaultProfile;
  }, [defaultProfile]);

  useEffect(() => {
    if (!providedUserId && typeof window !== "undefined") {
      let nextId = "";
      try {
        nextId = window.localStorage.getItem(USER_ID_STORAGE_KEY) || "";
      } catch {}
      if (!nextId) {
        nextId =
          typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2) + Date.now().toString(36);
        try {
          window.localStorage.setItem(USER_ID_STORAGE_KEY, nextId);
        } catch {}
      }
      setResolvedUserId(nextId);
      return;
    }
    setResolvedUserId(String(providedUserId || ""));
  }, [providedUserId]);

  useEffect(() => {
    if (!resolvedUserId) return;
    skipNextPersistRef.current = true;
    setProfileReady(false);

    const controller = new AbortController();

    const load = async () => {
      try {
        const res = await fetch(`/api/profile/${encodeURIComponent(resolvedUserId)}`, {
          signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(typeof data?.error === "string" ? data.error : "Failed to load profile");
        }
        const incoming = data?.profile;
        if (incoming && typeof incoming === "object") {
          setProfile((prev) => ({
            ...prev,
            name: typeof incoming?.name === "string" ? incoming.name : prev.name,
            about: typeof incoming?.about === "string" ? incoming.about : prev.about,
            phone: typeof incoming?.phone === "string" ? incoming.phone : prev.phone,
            picture: typeof incoming?.picture === "string" ? incoming.picture : prev.picture,
          }));
        } else {
          setProfile(defaultProfileRef.current);
        }
      } catch {
        setProfile(defaultProfileRef.current);
      } finally {
        setProfileReady(true);
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, [resolvedUserId]);

  useEffect(() => {
    if (typeof onProfileChange === "function") {
      onProfileChange(profile);
    }
  }, [profile, onProfileChange]);

  useEffect(() => {
    if (!resolvedUserId || !profileReady) return;
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }

    const controller = new AbortController();

    const save = async () => {
      try {
        await fetch(`/api/profile/${encodeURIComponent(resolvedUserId)}`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ profile }),
          signal: controller.signal,
        });
      } catch {}
    };

    save();

    return () => {
      controller.abort();
    };
  }, [profile, profileReady, resolvedUserId]);

  const startEditing = (field, label) => {
    setEditing({ field, label });
    if (field === "phone") {
      const raw = String(profile.phone || "").trim();
      const match = raw.match(/^(\+\d{1,4})\s*(.*)$/);
      const dial = match?.[1] || "+1";
      const rest = match?.[2] || raw;
      const nationalDigits = rest.replace(/\D/g, "");
      const countryMatch = COUNTRIES.find((c) => c.dial === dial);
      setPhoneCountry(countryMatch?.code || "US");
      setPhoneNational(nationalDigits);
      setDraftValue("");
      return;
    }
    if (field === "about") {
      setDraftValue(profile.about?.trim() ? profile.about : defaultProfile.about);
      return;
    }
    setDraftValue(String(profile[field] ?? ""));
  };

  const cancelEditing = () => {
    setEditing(null);
    setDraftValue("");
    setPhoneNational("");
    setPhoneError("");
  };

  const saveEditing = () => {
    if (!editing) return;
    const savedField = editing.field;
    if (editing.field === "phone") {
      const nationalDigits = String(phoneNational || "").replace(/\D/g, "");
      const min = selectedPhoneCountry?.min ?? 1;
      const max = selectedPhoneCountry?.max ?? 15;
      if (nationalDigits.length < min || nationalDigits.length > max) {
        setPhoneError(`Number must be ${min === max ? `${min}` : `${min}-${max}`} digits`);
        return;
      }
      const dial = selectedPhoneCountry.dial;
      setProfile((prev) => ({ ...prev, phone: `${dial} ${nationalDigits}` }));
      cancelEditing();
      toast.success("Phone number updated successfully");
      return;
    }
    let nextValue = draftValue.trim();
    if (editing.field === "about" && !nextValue) {
      nextValue = defaultProfile.about;
    }
    if (editing.field === "about") {
      nextValue = nextValue.slice(0, 33);
    }
    if (editing.field === "picture" && nextValue && !/^https?:\/\//i.test(nextValue)) {
      nextValue = `https://${nextValue}`;
    }
    if (!nextValue && editing.field !== "about") {
      cancelEditing();
      return;
    }
    setProfile((prev) => ({ ...prev, [editing.field]: nextValue }));
    cancelEditing();
    if (savedField === "about") {
      toast.success("About edited successfully");
    }
    if (savedField === "name") {
      toast.success("Name updated successfully");
    }
    if (savedField === "picture") {
      toast.success("Profile photo changed");
    }
  };

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(profile.phone || "");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Logout failed");
      }
      try {
        window.localStorage.removeItem(USER_ID_STORAGE_KEY);
      } catch {}
      toast.success("Logged out");
      router.replace("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Logout failed");
      setLoggingOut(false);
    }
  };

  const items = useMemo(
    () => [
      {
        id: "account",
        title: "Account",
        subtitle: "Security notifications, account info",
        icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
      },
      {
        id: "privacy",
        title: "Privacy",
        subtitle: "Blocked contacts, disappearing messages",
        icon: "M12 2 20 6v6c0 5-3.3 9.6-8 10-4.7-.4-8-5-8-10V6l8-4z",
      },
      {
        id: "chats",
        title: "Chats",
        subtitle: "Theme, wallpaper, chat settings",
        icon: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z",
      },
      {
        id: "notifications",
        title: "Notifications",
        subtitle: "Messages, groups, sounds",
        icon: "M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7M13.7 21a2 2 0 0 1-3.4 0",
      },
      {
        id: "shortcuts",
        title: "Keyboard shortcuts",
        subtitle: "Quick actions",
        icon: "M7 6h10M7 10h6M7 14h10M7 18h6",
      },
      {
        id: "help",
        title: "Help and feedback",
        subtitle: "Help center, contact us, privacy policy",
        icon: "M12 18h0M9.1 9a3 3 0 1 1 4.4 2.6c-.8.4-1.5 1.1-1.5 2.4v.5",
      },
    ],
    []
  );

  const detailScreens = useMemo(
    () => ({
      account: {
        title: "Account",
        rows: [
          {
            id: "security",
            title: "Security notifications",
            icon: "M12 2 20 6v6c0 5-3.3 9.6-8 10-4.7-.4-8-5-8-10V6l8-4z",
          },
          {
            id: "request-info",
            title: "Request account info",
            icon: "M7 3h10v18H7zM9 7h6M9 11h6M9 15h6",
          },
          {
            id: "delete",
            title: "How to delete my account",
            icon: "M12 18h0M9.1 9a3 3 0 1 1 4.4 2.6c-.8.4-1.5 1.1-1.5 2.4v.5",
          },
        ],
      },
      privacy: {
        title: "Privacy",
        rows: [
          { id: "sec-personal", type: "section", title: "Who can see my personal info" },
          {
            id: "last-seen",
            type: "nav",
            title: "Last seen and online",
            subtitle: "Nobody",
          },
          { id: "profile-photo", type: "nav", title: "Profile photo", subtitle: "My contacts" },
          { id: "about", type: "nav", title: "About", subtitle: "My contacts" },
          {
            id: "read-receipts",
            type: "toggle",
            title: "Read receipts",
            description:
              "If turned off, you won't send or receive read receipts. Read receipts are always sent for group chats.",
            key: "readReceipts",
          },
          { id: "sec-disappearing", type: "section", title: "Disappearing messages" },
          { id: "default-timer", type: "nav", title: "Default message timer", subtitle: "Off" },
          { id: "groups", type: "nav", title: "Groups", subtitle: "195 contacts excluded" },
          { id: "blocked", type: "nav", title: "Blocked contacts", subtitle: "11" },
          { id: "app-lock", type: "nav", title: "App lock", subtitle: "Require password to unlock WhatsApp" },
          { id: "sec-advanced", type: "section", title: "Advanced" },
          {
            id: "block-unknown",
            type: "toggle",
            title: "Block unknown account messages",
            description:
              "To protect your account and improve device performance, WhatsApp will block messages from unknown accounts if they exceed a certain volume.",
            key: "blockUnknownMessages",
          },
          {
            id: "disable-previews",
            type: "toggle",
            title: "Disable link previews",
            description:
              "To help protect your IP address from being inferred by third-party websites, previews for the links you share in chats will no longer be generated.",
            key: "disableLinkPreviews",
          },
        ],
      },
      chats: {
        title: "Chats",
        rows: [
          { id: "sec-display", type: "section", title: "Display" },
          { id: "theme", type: "nav", title: "Theme", subtitle: "System default" },
          { id: "wallpaper", type: "nav", title: "Wallpaper" },
          { id: "sec-chat-settings", type: "section", title: "Chat settings" },
          { id: "media-upload", type: "nav", title: "Media upload quality" },
          { id: "media-download", type: "nav", title: "Media auto-download" },
          {
            id: "spell-check",
            type: "toggle",
            title: "Spell check",
            description: "Check spelling while typing",
            key: "spellCheck",
          },
          {
            id: "replace-emoji",
            type: "toggle",
            title: "Replace text with emoji",
            description: "Emoji will replace specific text as you type",
            key: "replaceWithEmoji",
          },
          {
            id: "enter-send",
            type: "toggle",
            title: "Enter is send",
            description: "Enter key will send your message",
            key: "enterIsSend",
          },
        ],
      },
      notifications: {
        title: "Notifications",
        rows: [
          {
            id: "messages",
            type: "nav",
            title: "Messages",
            subtitle: "Off",
            icon: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z",
          },
          {
            id: "groups",
            type: "nav",
            title: "Groups",
            subtitle: "Off",
            icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
          },
          { id: "sec-toggles", type: "section", title: "" },
          {
            id: "show-previews",
            type: "toggle",
            title: "Show previews",
            description: "Preview message text inside message notifications.",
            key: "showPreviews",
          },
          {
            id: "sound-outgoing",
            type: "toggle",
            title: "Play sound for outgoing messages",
            key: "playSoundOutgoing",
          },
          {
            id: "background-sync",
            type: "toggle",
            title: "Background sync",
            description: "Get faster performance by syncing messages in the background.",
            key: "backgroundSync",
          },
          {
            id: "footer",
            type: "footer",
            text: "To get notifications, make sure they're turned on in your browser and device settings.",
          },
        ],
      },
      help: {
        title: "Help and feedback",
        rows: [
          {
            id: "help-center",
            type: "nav",
            title: "Help Center",
            subtitle: "Frequently asked questions",
            icon: "M12 18h0M9.1 9a3 3 0 1 1 4.4 2.6c-.8.4-1.5 1.1-1.5 2.4v.5",
          },
          {
            id: "contact-us",
            type: "nav",
            title: "Contact us",
            subtitle: "Chat with support to get answers",
            icon: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z",
          },
          {
            id: "send-feedback",
            type: "nav",
            title: "Send feedback",
            subtitle: "Technical issues, suggestions",
            icon: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm7.4-2.6.8.5-1.6 2.8-.9-.3a7.9 7.9 0 0 1-1.9 1.1l-.1 1h-3.2l-.1-1a7.9 7.9 0 0 1-1.9-1.1l-.9.3-1.6-2.8.8-.5a7.8 7.8 0 0 1 0-2.2l-.8-.5 1.6-2.8.9.3a7.9 7.9 0 0 1 1.9-1.1l.1-1h3.2l.1 1a7.9 7.9 0 0 1 1.9 1.1l.9-.3 1.6 2.8-.8.5a7.8 7.8 0 0 1 0 2.2z",
          },
          {
            id: "terms",
            type: "nav",
            title: "Terms and Privacy Policy",
            icon: "M7 3h10v18H7zM9 7h6M9 11h6M9 15h6",
          },
          {
            id: "channels-reports",
            type: "nav",
            title: "Channels reports",
            icon: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
          },
          { id: "sec-beta", type: "section", title: "" },
          {
            id: "join-beta",
            type: "toggle",
            title: "Join the beta",
            description:
              "Get new features before they are released. Report bugs using the Contact us form above.",
            key: "joinBeta",
          },
          { id: "sec-version", type: "section", title: "" },
          {
            id: "version",
            type: "footer",
            text: "Version 2.3000.1031497908",
            centered: true,
          },
        ],
      },
    }),
    []
  );

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (x) => x.title.toLowerCase().includes(q) || x.subtitle.toLowerCase().includes(q)
    );
  }, [items, query]);

  const activeTitle = useMemo(() => {
    const hit = items.find((x) => x.id === active);
    return hit?.title || "Settings";
  }, [active, items]);

  const activeDetail = useMemo(() => {
    if (!active) return null;
    if (active === "profile") {
      return { title: "Profile" };
    }
    return detailScreens[active] || null;
  }, [active, detailScreens]);

  return (
    <>
      <aside className="w-[360px] border-r border-zinc-800 bg-[#111b21]">
        {activeDetail ? (
          <>
            <div className="flex h-14 items-center gap-2 border-b border-zinc-800 px-4">
              <button
                onClick={() => setActive(null)}
                className="rounded-full p-2 text-zinc-300 hover:bg-zinc-800/40"
                aria-label="Back"
              >
                <SmallIcon d="M15 18l-6-6 6-6" className="h-5 w-5" />
              </button>
              <div className="text-lg font-semibold text-zinc-100">{activeDetail.title}</div>
            </div>
            {active === "profile" ? (
              <div className="overflow-y-auto">
                <div className="flex flex-col items-center gap-4 px-4 py-8">
                  <div className="relative">
                    {profile.picture?.trim() ? (
                      <Image
                        src={profile.picture}
                        alt="Profile"
                        width={160}
                        height={160}
                        unoptimized
                        className="h-40 w-40 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-40 w-40 overflow-hidden rounded-full">
                        <div className="h-40 w-40">
                          <InitialAvatar name={profile.name} />
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => startEditing("picture", "Profile photo URL")}
                      className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white"
                      type="button"
                    >
                      <SmallIcon
                        d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                        className="h-4 w-4"
                      />
                    </button>
                  </div>
                </div>
                {editing ? (
                  <div className="px-6 pb-4">
                    <div className="rounded-xl border border-zinc-800 bg-[#0e181e] p-4">
                      <div className="text-sm font-semibold text-zinc-100">
                        Edit {editing.label}
                      </div>
                      {editing.field === "phone" ? (
                        <div className="mt-3 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <select
                              value={phoneCountry}
                              onChange={(e) => setPhoneCountry(e.target.value)}
                              className="w-full rounded-lg bg-[#111b21] px-3 py-2 text-sm text-zinc-100 outline-none ring-1 ring-zinc-800 focus:ring-emerald-500/60"
                            >
                              {COUNTRIES.map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                            <input
                              value={selectedPhoneCountry.dial}
                              readOnly
                              className="w-full rounded-lg bg-[#111b21] px-3 py-2 text-sm text-zinc-400 outline-none ring-1 ring-zinc-800"
                            />
                          </div>
                          <input
                            value={phoneNational}
                            inputMode="numeric"
                            maxLength={selectedPhoneCountry?.max ?? 15}
                            autoFocus
                            onChange={(e) => {
                              const max = selectedPhoneCountry?.max ?? 15;
                              const digits = e.target.value.replace(/[^\d]/g, "").slice(0, max);
                              setPhoneNational(digits);
                              setPhoneError("");
                            }}
                            placeholder="Phone number"
                            className="w-full rounded-lg bg-[#111b21] px-3 py-2 text-sm text-zinc-100 outline-none ring-1 ring-zinc-800 focus:ring-emerald-500/60"
                          />
                          {phoneError ? (
                            <div className="text-xs text-rose-400">{phoneError}</div>
                          ) : null}
                        </div>
                      ) : editing.field === "about" ? (
                        <textarea
                          value={draftValue}
                          autoFocus
                          maxLength={33}
                          onChange={(e) => setDraftValue(e.target.value.slice(0, 33))}
                          className="mt-3 h-24 w-full resize-none rounded-lg bg-[#111b21] px-3 py-2 text-sm text-zinc-100 outline-none ring-1 ring-zinc-800 focus:ring-emerald-500/60"
                        />
                      ) : (
                        <input
                          value={draftValue}
                          autoFocus
                          onChange={(e) => setDraftValue(e.target.value)}
                          className="mt-3 w-full rounded-lg bg-[#111b21] px-3 py-2 text-sm text-zinc-100 outline-none ring-1 ring-zinc-800 focus:ring-emerald-500/60"
                        />
                      )}
                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          onClick={cancelEditing}
                          className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800/40"
                          type="button"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEditing}
                          className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
                          type="button"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="space-y-4 bg-[#0b141a] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-emerald-400">Your name</div>
                      <div className="mt-1 text-zinc-100">{profile.name}</div>
                    </div>
                    <button
                      onClick={() => startEditing("name", "Name")}
                      className="text-zinc-400"
                      type="button"
                    >
                      <SmallIcon
                        d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                        className="h-5 w-5"
                      />
                    </button>
                  </div>
                  <div className="text-sm text-zinc-500">
                    This is not your username or PIN. This name will be visible to your WhatsApp
                    contacts.
                  </div>
                </div>
                <div className="space-y-4 bg-[#0b141a] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-emerald-400">About</div>
                      <div className="mt-1 text-zinc-100">{profile.about?.trim() ? profile.about : defaultProfile.about}</div>
                    </div>
                    <button
                      onClick={() => startEditing("about", "About")}
                      className="text-zinc-400"
                      type="button"
                    >
                      <SmallIcon
                        d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                        className="h-5 w-5"
                      />
                    </button>
                  </div>
                </div>
                <div className="space-y-4 bg-[#0b141a] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-emerald-400">Phone number</div>
                      <div className="mt-1 text-zinc-100">{profile.phone}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyPhone}
                        className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800/40"
                        type="button"
                        aria-label="Copy phone number"
                      >
                        <SmallIcon
                          d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 4h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z"
                          className="h-5 w-5"
                        />
                      </button>
                      <button
                        onClick={() => startEditing("phone", "Phone number")}
                        className="rounded-md p-1 text-zinc-400 hover:bg-zinc-800/40"
                        type="button"
                        aria-label="Edit phone number"
                      >
                        <SmallIcon
                          d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                          className="h-5 w-5"
                        />
                      </button>
                    </div>
                  </div>
                  {copied ? <div className="text-xs text-emerald-400">Copied</div> : null}
                </div>
              </div>
            ) : active === "privacy" ||
              active === "chats" ||
              active === "notifications" ||
              active === "help" ? (
              <div className="px-4 py-4">
                <div className="space-y-2">
                  {activeDetail.rows.map((row) => {
                    if (row.type === "section") {
                      if (!row.title) {
                        return <div key={row.id} className="pt-2" />;
                      }
                      return (
                        <div key={row.id} className="pt-6 pb-2 text-sm font-semibold text-zinc-400">
                          {row.title}
                        </div>
                      );
                    }
                    if (row.type === "nav") {
                      const highlighted = Boolean(row.highlight);
                      return (
                        <button
                          key={row.id}
                          className={`flex w-full items-center justify-between gap-4 py-4 text-left ${
                            highlighted
                              ? "rounded-xl bg-zinc-800/40 px-4"
                              : "border-b border-zinc-800/70"
                          }`}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            {row.icon ? (
                              <div className="flex h-6 w-6 items-center justify-center text-zinc-500">
                                <SmallIcon d={row.icon} className="h-5 w-5" />
                              </div>
                            ) : null}
                            <div className="min-w-0">
                              <div className="text-base font-semibold text-zinc-100">{row.title}</div>
                              {row.subtitle ? (
                                <div className="truncate text-sm text-zinc-500">{row.subtitle}</div>
                              ) : null}
                            </div>
                          </div>
                          <SmallIcon d="M9 18l6-6-6-6" className="h-5 w-5 text-zinc-600" />
                        </button>
                      );
                    }
                    if (row.type === "toggle") {
                      const prefs =
                        active === "privacy"
                          ? privacyPrefs
                          : active === "chats"
                            ? chatPrefs
                            : active === "notifications"
                              ? notificationPrefs
                              : helpPrefs;
                      const setPrefs =
                        active === "privacy"
                          ? setPrivacyPrefs
                          : active === "chats"
                            ? setChatPrefs
                            : active === "notifications"
                              ? setNotificationPrefs
                              : setHelpPrefs;
                      const checked = Boolean(prefs[row.key]);
                      return (
                        <div key={row.id} className="border-b border-zinc-800/70 py-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="text-base font-semibold text-zinc-100">{row.title}</div>
                              {row.description ? (
                                <div className="mt-1 text-sm leading-snug text-zinc-500">
                                  {row.description}
                                </div>
                              ) : null}
                            </div>
                            <div className="pt-1">
                              <ToggleSwitch
                                checked={checked}
                                onChange={(v) =>
                                  setPrefs((prev) => ({
                                    ...prev,
                                    [row.key]: v,
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }
                    if (row.type === "footer") {
                      return (
                        <div
                          key={row.id}
                          className={`pt-6 text-sm leading-snug text-zinc-500 ${
                            row.centered ? "text-center" : ""
                          }`}
                        >
                          {row.text}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ) : (
              <div className="px-2 py-3">
                <div className="space-y-2">
                  {activeDetail.rows.map((row) => (
                    <button
                      key={row.id}
                      className="flex w-full items-center gap-4 rounded-lg px-2 py-3 text-left hover:bg-zinc-800/30"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300">
                        <SmallIcon d={row.icon} className="h-5 w-5" />
                      </div>
                      <div className="text-sm font-semibold text-zinc-100">{row.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="px-4 pt-5 pb-3">
              <div className="text-xl font-semibold text-zinc-100">Settings</div>
              <div className="mt-3 flex items-center gap-2 rounded-full bg-[#202c33] px-4 py-2 text-sm text-zinc-300 ring-1 ring-emerald-500/70">
                <SmallIcon
                  d="M11 19a8 8 0 1 1 5.3-13.9A8 8 0 0 1 11 19zm10.7 3.3-5.4-5.4"
                  className="h-4 w-4 text-zinc-400"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search settings"
                  className="w-full bg-transparent outline-none placeholder:text-zinc-500"
                />
              </div>
            </div>

            {!dismissed ? (
              <div className="px-4">
                <div className="relative rounded-xl border border-zinc-800 bg-[#0e181e] p-4">
                  <button
                    onClick={() => setDismissed(true)}
                    className="absolute right-3 top-3 rounded-md p-1 text-zinc-400 hover:bg-zinc-800/40"
                    aria-label="Dismiss"
                  >
                    <SmallIcon d="M18 6 6 18M6 6l12 12" className="h-4 w-4" />
                  </button>
                  <div className="flex items-start gap-3 pr-8">
                    <div className="mt-0.5 rounded-full bg-zinc-800 p-2 text-zinc-300">
                      <SmallIcon
                        d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5l-2 2h16l-2-2z"
                        className="h-5 w-5"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-zinc-100">
                        Choose your notifications
                      </div>
                      <div className="mt-1 text-[12px] leading-snug text-zinc-400">
                        Get notifications for messages, groups or your status.{" "}
                        <span className="text-emerald-400">Choose now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-3 px-2">
              <button
                onClick={() => setActive("profile")}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left hover:bg-zinc-800/40"
              >
                {profile.picture?.trim() ? (
                  <Image
                    src={profile.picture}
                    alt="Profile picture"
                    width={48}
                    height={48}
                    unoptimized
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <InitialAvatar name={profile.name} />
                )}
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-zinc-100">{profile.name}</div>
                  <div className="truncate text-[12px] text-zinc-400">{profile.about}</div>
                </div>
              </button>
            </div>

            <div className="mt-1 px-2 pb-4">
              {filteredItems.map((x) => (
                <button
                  key={x.id}
                  onClick={() => {
                    if (x.id === "shortcuts") {
                      setShowShortcuts(true);
                    } else {
                      setActive(x.id);
                    }
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left hover:bg-zinc-800/40"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300">
                    <SmallIcon d={x.icon} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-zinc-100">{x.title}</div>
                    <div className="truncate text-[12px] text-zinc-400">{x.subtitle}</div>
                  </div>
                </button>
              ))}

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-2 flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left hover:bg-zinc-800/40 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-rose-400">
                  <SmallIcon d="M10 17l5-5-5-5M15 12H3M21 21V3" className="h-5 w-5" />
                </div>
                <div className="text-sm font-semibold text-rose-400">
                  {loggingOut ? "Logging out..." : "Log out"}
                </div>
              </button>
            </div>
          </>
        )}
      </aside>

      <section className="flex min-h-screen flex-1 items-center justify-center bg-[#0b141a]">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800/60 text-zinc-400">
            <SettingsFilledIcon className="h-10 w-10" />
          </div>
          <div className="mt-6 text-3xl font-medium text-zinc-200">Settings</div>
        </div>
      </section>

      {showShortcuts ? <KeyboardShortcuts onClose={() => setShowShortcuts(false)} /> : null}
    </>
  );
}
