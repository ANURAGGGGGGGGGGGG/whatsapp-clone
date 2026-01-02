"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import SettingsScreen from "./components/SettingsScreen";
import { toast } from "react-toastify";

function Icon({ name, className }) {
  const paths = {
    list: "M4 5h16M4 10h16M4 15h16",
    status: "M12 4a8 8 0 1 1 0 16a8 8 0 0 1 0-16",
    message: "M4 5h16v10H9l-5 4z",
    group: "M8 11a3 3 0 1 0 0-6M16 11a3 3 0 1 0 0-6M4 20c0-3 4-5 8-5s8 2 8 5",
    settings:
      "M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8M12 3v3M12 18v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M3 12h3M18 12h3M4.9 19.1l2.1-2.1M17 7l2.1-2.1",
    search:
      "M11 19a8 8 0 1 1 5.3-13.9A8 8 0 0 1 11 19zm10.7 3.3-5.4-5.4",
    filter: "M3 5h18M6 12h12M10 19h4",
    more: "M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4",
    phone: "M6 2h3l2 5-2 2c1 2.5 3.5 5 6 6l2-2 5 2v3c0 1.1-.9 2-2 2C11.4 20.9 3.1 12.6 2 4c0-1.1.9-2 2-2z",
    video: "M3 6h10v12H3zm10 6 6 4V8z",
    emoji:
      "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-4 8h0m8 0h0M7 14c1.3 1.6 3 2.5 5 2.5s3.7-.9 5-2.5",
    attach: "M7 12c0-3.9 3.1-7 7-7s7 3.1 7 7v6a5 5 0 0 1-10 0V9a3 3 0 0 1 6 0v9",
    mic: "M12 17a4 4 0 0 0 4-4V6a4 4 0 1 0-8 0v7a4 4 0 0 0 4 4zm-7-4a7 7 0 0 0 14 0M12 21v2",
    send: "M3 11l19-8-8 19-3-7-7-4z",
    check: "M5 13l4 4L19 7",
  };
  const d = paths[name];
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

function Avatar({ name, src }) {
  const hue = useMemo(() => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
    return h;
  }, [name]);
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  if (src?.trim()) {
    return (
      <Image
        src={src}
        alt={name}
        width={40}
        height={40}
        unoptimized
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold text-white"
      style={{
        background:
          `radial-gradient(circle at 30% 30%, hsl(${hue} 70% 55%) 0, hsl(${hue} 80% 45%) 60%, hsl(${hue} 80% 35%) 100%)`,
      }}
    >
      {initials}
    </div>
  );
}

function ChatItem({ chat, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        active ? "bg-zinc-800" : "hover:bg-zinc-800/60"
      }`}
    >
      <Avatar name={chat.name} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="truncate text-sm font-medium text-zinc-100">
            {chat.name}
          </span>
          <span className="text-[11px] text-zinc-400">{chat.time}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="truncate text-xs text-zinc-400">
            {chat.lastMessage}
          </span>
          {chat.unread ? (
            <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-600 px-2 text-[11px] font-semibold text-white">
              {chat.unread}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

function MessageBubble({ m }) {
  const isMe = m.sender === "me";
  const base = isMe ? "self-end bg-emerald-900/40" : "self-start bg-zinc-800";
  return (
    <div className={`max-w-[72%] ${base} rounded-lg px-3 py-2 text-sm text-zinc-100`}>
      {m.type === "image" ? (
        <Image
          src={m.src}
          alt="Attachment"
          width={144}
          height={144}
          className="mb-2 h-36 w-36 rounded-md object-cover"
        />
      ) : (
        <span className="leading-relaxed">{m.text}</span>
      )}
      <div className="mt-1 flex items-center justify-end gap-1">
        <span className="text-[10px] text-zinc-400">{m.time}</span>
        {isMe ? (
          <Icon name="check" className="h-3 w-3 text-white" />
        ) : null}
      </div>
    </div>
  );
}

function DateChip({ label }) {
  return (
    <div className="mx-auto my-3 inline-flex items-center rounded-full bg-zinc-800 px-3 py-1 text-[11px] text-zinc-300">
      {label}
    </div>
  );
}

function PeerCallPanel() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerRef = useRef(null);
  const currentCallRef = useRef(null);

  const [myPeerId, setMyPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [incomingCall, setIncomingCall] = useState(null);
  const [status, setStatus] = useState("Initializing…");
  const [inCall, setInCall] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const setLocalVideoStream = (stream) => {
    const video = localVideoRef.current;
    if (!video) return;
    video.srcObject = stream;
    video.muted = true;
    video.play().catch(() => {});
  };

  const setRemoteVideoStream = (stream) => {
    const video = remoteVideoRef.current;
    if (!video) return;
    video.srcObject = stream;
    video.play().catch(() => {});
  };

  const clearRemoteVideoStream = () => {
    const video = remoteVideoRef.current;
    if (!video) return;
    video.srcObject = null;
  };

  const closeCurrentCall = (nextStatus = "Ready") => {
    const call = currentCallRef.current;
    if (call) {
      try {
        call.close();
      } catch {}
    }
    currentCallRef.current = null;
    setIncomingCall(null);
    clearRemoteVideoStream();
    setInCall(false);
    setStatus(nextStatus);
  };

  const bindCall = (call) => {
    currentCallRef.current = call;
    setInCall(true);
    setStatus("Connecting…");

    call.on("stream", (remoteStream) => {
      setRemoteVideoStream(remoteStream);
      setStatus("In call");
    });
    call.on("close", () => closeCurrentCall("Ready"));
    call.on("error", (err) => {
      setStatus(err?.message ? `Call error: ${err.message}` : "Call error");
    });
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        setStatus("Requesting camera/mic…");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        setAudioEnabled(stream.getAudioTracks().some((t) => t.enabled));
        setVideoEnabled(stream.getVideoTracks().some((t) => t.enabled));
        setLocalVideoStream(stream);

        setStatus("Connecting to PeerJS…");
        const mod = await import("peerjs");
        const Peer = mod.default;
        const peer = new Peer();
        peerRef.current = peer;

        peer.on("open", (id) => {
          setMyPeerId(id);
          setStatus("Ready");
        });

        peer.on("call", (call) => {
          setIncomingCall(call);
          setStatus(`Incoming call from ${call.peer}`);
        });

        peer.on("disconnected", () => setStatus("Disconnected"));
        peer.on("close", () => setStatus("Closed"));
        peer.on("error", (err) => {
          setStatus(err?.message ? `Peer error: ${err.message}` : "Peer error");
        });
      } catch (err) {
        setStatus(err?.message ? err.message : "Failed to initialize");
      }
    };

    init();

    return () => {
      cancelled = true;
      closeCurrentCall("Closed");
      const peer = peerRef.current;
      if (peer) {
        try {
          peer.destroy();
        } catch {}
        peerRef.current = null;
      }
      const stream = localStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
    };
  }, []);

  const startCall = () => {
    const peer = peerRef.current;
    const stream = localStreamRef.current;
    const target = remotePeerId.trim();
    if (!peer || !stream || !target) return;
    if (target === myPeerId) return;
    closeCurrentCall(`Calling ${target}…`);
    try {
      const call = peer.call(target, stream);
      bindCall(call);
    } catch (err) {
      setStatus(err?.message ? err.message : "Could not start call");
    }
  };

  const answerCall = () => {
    const call = incomingCall;
    const stream = localStreamRef.current;
    if (!call || !stream) return;
    setIncomingCall(null);
    try {
      call.answer(stream);
      bindCall(call);
    } catch (err) {
      setStatus(err?.message ? err.message : "Could not answer call");
    }
  };

  const rejectCall = () => {
    const call = incomingCall;
    if (call) {
      try {
        call.close();
      } catch {}
    }
    setIncomingCall(null);
    setStatus("Ready");
  };

  const toggleAudio = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !audioEnabled;
    stream.getAudioTracks().forEach((t) => (t.enabled = next));
    setAudioEnabled(next);
  };

  const toggleVideo = () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !videoEnabled;
    stream.getVideoTracks().forEach((t) => (t.enabled = next));
    setVideoEnabled(next);
  };

  return (
    <section className="flex min-h-screen flex-1 flex-col bg-[#0b141a]">
      <div className="flex h-14 items-center justify-between border-b border-zinc-800 bg-[#202c33] px-4">
        <div className="text-sm font-semibold">WebRTC Call (PeerJS)</div>
        <div className="text-[11px] text-zinc-400">{status}</div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-[#111b21] p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-zinc-200">Local</div>
              <div className="text-[11px] text-zinc-400">
                {audioEnabled ? "Mic on" : "Mic off"} · {videoEnabled ? "Cam on" : "Cam off"}
              </div>
            </div>
            <video
              ref={localVideoRef}
              playsInline
              autoPlay
              className="aspect-video w-full rounded-lg bg-black object-cover"
            />
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#111b21] p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-zinc-200">Remote</div>
              <div className="text-[11px] text-zinc-400">{inCall ? "Live" : "Waiting"}</div>
            </div>
            <video
              ref={remoteVideoRef}
              playsInline
              autoPlay
              className="aspect-video w-full rounded-lg bg-black object-cover"
            />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-[#111b21] p-3 lg:col-span-1">
            <div className="text-xs font-semibold text-zinc-200">Your Peer ID</div>
            <div className="mt-2 flex items-center gap-2">
              <input
                readOnly
                value={myPeerId || "Generating…"}
                className="w-full rounded-lg bg-[#2a3942] px-3 py-2 text-xs text-zinc-100 outline-none"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!myPeerId) return;
                  try {
                    await navigator.clipboard.writeText(myPeerId);
                    setStatus("Peer ID copied");
                    window.setTimeout(() => setStatus("Ready"), 900);
                  } catch {}
                }}
                className="rounded-lg bg-zinc-800 px-3 py-2 text-xs text-zinc-100 hover:bg-zinc-700"
              >
                Copy
              </button>
            </div>
            <div className="mt-3 text-[11px] text-zinc-400">
              Open this page in another browser/device and paste the ID to call.
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-[#111b21] p-3 lg:col-span-2">
            <div className="flex flex-col gap-3 md:flex-row md:items-end">
              <div className="flex-1">
                <div className="text-xs font-semibold text-zinc-200">Remote Peer ID</div>
                <input
                  value={remotePeerId}
                  onChange={(e) => setRemotePeerId(e.target.value)}
                  placeholder="Enter remote Peer ID"
                  className="mt-2 w-full rounded-lg bg-[#2a3942] px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={startCall}
                  disabled={!myPeerId || !remotePeerId.trim() || Boolean(incomingCall)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    myPeerId && remotePeerId.trim() && !incomingCall
                      ? "bg-emerald-500 text-black hover:bg-emerald-400"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  Call
                </button>
                <button
                  type="button"
                  onClick={() => closeCurrentCall("Ready")}
                  className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-black hover:bg-rose-400"
                >
                  End
                </button>
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-700"
                >
                  {audioEnabled ? "Mute" : "Unmute"}
                </button>
                <button
                  type="button"
                  onClick={toggleVideo}
                  className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-700"
                >
                  {videoEnabled ? "Video off" : "Video on"}
                </button>
              </div>
            </div>

            {incomingCall ? (
              <div className="mt-4 rounded-lg border border-zinc-800 bg-[#0e181e] p-3">
                <div className="text-sm text-zinc-100">
                  Incoming call from <span className="font-semibold">{incomingCall.peer}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={answerCall}
                    className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
                  >
                    Answer
                  </button>
                  <button
                    type="button"
                    onClick={rejectCall}
                    className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [section, setSection] = useState("chats");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [userId, setUserId] = useState("");
  const [settingsActive, setSettingsActive] = useState(null);
  const [chats, setChats] = useState([]);

  const [activeId, setActiveId] = useState(chats[0]?.id || "");
  const [messages, setMessages] = useState({});

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeId),
    [chats, activeId]
  );

  const filtered = useMemo(() => {
    let list = chats;
    const effectiveFilter = section === "groups" ? "Groups" : filter;
    if (effectiveFilter === "Unread") list = chats.filter((c) => c.unread > 0);
    if (effectiveFilter === "Favorites") list = chats.slice(0, 2);
    if (effectiveFilter === "Groups") list = chats.filter((c) => c.name.includes("Family"));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)
      );
    }
    return list;
  }, [chats, filter, query, section]);

  if (section === "groups" && filtered.length > 0 && !filtered.some((c) => c.id === activeId)) {
    setActiveId(filtered[0].id);
  }

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setUserProfile(null);
          return;
        }
        setUserId(typeof data?.userId === "string" ? data.userId : "");
        setUserProfile(data?.profile || null);
      } catch {
        setUserProfile(null);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const [draft, setDraft] = useState("");
  const [peopleQuery, setPeopleQuery] = useState("");
  const [peopleResults, setPeopleResults] = useState([]);
  const [peopleLoading, setPeopleLoading] = useState(false);
  const [peopleError, setPeopleError] = useState("");
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);

  const refreshRequests = async () => {
    setRequestsLoading(true);
    setRequestsError("");
    try {
      const res = await fetch("/api/requests?kind=all");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Failed to load requests");
      }
      const list = Array.isArray(data?.requests) ? data.requests : [];
      if (!userId) {
        setIncomingRequests([]);
        setOutgoingRequests([]);
        return;
      }
      setIncomingRequests(list.filter((r) => r?.toUserId === userId));
      setOutgoingRequests(list.filter((r) => r?.fromUserId === userId));
    } catch (err) {
      setIncomingRequests([]);
      setOutgoingRequests([]);
      setRequestsError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    if (section !== "people") return;
    if (!userId) return;
    refreshRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, userId]);

  useEffect(() => {
    if (section !== "people") return;
    const q = peopleQuery.trim();
    if (q.length < 2) {
      setPeopleResults([]);
      setPeopleError("");
      setPeopleLoading(false);
      return;
    }

    const controller = new AbortController();
    const t = window.setTimeout(async () => {
      setPeopleLoading(true);
      setPeopleError("");
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(typeof data?.error === "string" ? data.error : "Search failed");
        }
        setPeopleResults(Array.isArray(data?.results) ? data.results : []);
      } catch (err) {
        if (controller.signal.aborted) return;
        setPeopleResults([]);
        setPeopleError(err instanceof Error ? err.message : "Search failed");
      } finally {
        if (!controller.signal.aborted) setPeopleLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(t);
    };
  }, [peopleQuery, section]);

  const sendRequest = async (toUserId) => {
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ toUserId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data?.error === "string" ? data.error : "Failed to send request");
      setPeopleResults((prev) =>
        prev.map((p) =>
          p.userId === toUserId
            ? { ...p, requestStatus: data?.status || "outgoing", requestId: data?.requestId || p.requestId }
            : p
        )
      );
      refreshRequests();
      toast.success("Request sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send request");
    }
  };

  const updateRequest = async (requestId, action) => {
    try {
      const res = await fetch("/api/requests", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(typeof data?.error === "string" ? data.error : "Failed to update request");
      refreshRequests();
      setPeopleResults((prev) =>
        prev.map((p) =>
          p.requestId === requestId
            ? { ...p, requestStatus: data?.status === "accepted" ? "friends" : "none" }
            : p
        )
      );
      if (action === "accept") toast.success("Request accepted");
      else if (action === "decline") toast.success("Request declined");
      else if (action === "cancel") toast.success("Request cancelled");
      else toast.success("Request updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update request");
    }
  };

  function sendDraft() {
    if (!draft.trim() || !activeId) return;
    const item = {
      id: Math.random().toString(36).slice(2),
      sender: "me",
      type: "text",
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), item],
    }));
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, lastMessage: item.text, time: "Now", unread: 0 } : c
      )
    );
    setDraft("");
  }

  return (
    <div className="flex min-h-screen bg-[#0b141a] text-zinc-100">
      <div className="flex w-[64px] flex-col justify-between border-r border-zinc-800 bg-[#0e181e] py-3">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => {
              setSection("chats");
              setFilter("All");
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              section === "chats" ? "bg-[#202c33] text-white" : "text-zinc-300 hover:bg-[#24323a]"
            }`}
            aria-label="Chats"
          >
            <svg
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
              className="h-5 w-5"
              fill="none"
              aria-hidden="true"
            >
              <title>chat-filled-refreshed</title>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22.0002 6.66667C22.0002 5.19391 20.8062 4 19.3335 4H1.79015C1.01286 4 0.540213 4.86348 0.940127 5.53L3.00016 9V17.3333C3.00016 18.8061 4.19406 20 5.66682 20H19.3335C20.8062 20 22.0002 18.8061 22.0002 17.3333V6.66667ZM7.00016 10C7.00016 9.44772 7.44787 9 8.00016 9H17.0002C17.5524 9 18.0002 9.44772 18.0002 10C18.0002 10.5523 17.5524 11 17.0002 11H8.00016C7.44787 11 7.00016 10.5523 7.00016 10ZM8.00016 13C7.44787 13 7.00016 13.4477 7.00016 14C7.00016 14.5523 7.44787 15 8.00016 15H14.0002C14.5524 15 15.0002 14.5523 15.0002 14C15.0002 13.4477 14.5524 13 14.0002 13H8.00016Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              setSection("groups");
              setFilter("Groups");
            }}
            className={`flex h-10 w-10 items-center text-white justify-center rounded-full ${
              section === "groups" ? "bg-[#202c33]" : "hover:bg-[#24323a]"
            }`}
            aria-label="Groups"
          >
            <Image src="/group.gif" alt="Groups" width={20} height={20} className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setSection("people");
              setFilter("All");
              setPeopleQuery("");
              setPeopleResults([]);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              section === "people" ? "bg-[#202c33] text-white" : "text-zinc-300 hover:bg-[#24323a]"
            }`}
            aria-label="Find people"
          >
            <Image src="/add-user.svg" alt="Find people" width={20} height={20} className="h-5 w-5" />
          </button>
          <div className="my-2 h-px w-8 bg-zinc-800" />
          <button
            onClick={() => setSection("ai")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#0ea5e9] via-[#7c3aed] to-[#22d3ee]"
            aria-label="Meta AI"
          />
        </div>
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => {
              setSection("settings");
              setSettingsActive(null);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              section === "settings" ? "bg-[#202c33] text-white" : "text-zinc-300 hover:bg-[#24323a]"
            }`}
            aria-label="Settings"
          >
            <Image src="/setting.png" alt="Settings" width={20} height={20} className="h-5 w-5" />
          </button>
          <div className="relative group">
            <button
              type="button"
              onClick={() => {
                setSection("settings");
                setSettingsActive("profile");
              }}
              aria-label="Profile"
              className="rounded-full"
            >
              <Avatar name={userProfile?.name || "You"} src={userProfile?.picture || ""} />
            </button>
            <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 w-72 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="rounded-xl border border-zinc-800 bg-[#111b21] p-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <Avatar name={userProfile?.name || "You"} src={userProfile?.picture || ""} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-zinc-100">
                      {userProfile?.name || "You"}
                    </div>
                    <div className="truncate text-xs text-zinc-400">
                      {userProfile?.about || "Hey there! I am using WhatsApp."}
                    </div>
                  </div>
                </div>
                {userProfile?.phone ? (
                  <div className="mt-3 text-xs text-zinc-300">{userProfile.phone}</div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
      {section === "settings" ? (
        <SettingsScreen
          userId={userId}
          initialActive={settingsActive}
          onProfileChange={setUserProfile}
          profileName={userProfile?.name || "You"}
          profileSubtitle={userProfile?.about || "Hey there! I am using WhatsApp."}
        />
      ) : (
        <>
          <aside className="w-[360px] border-r border-zinc-800 bg-[#111b21]">
            {section === "people" ? (
              <>
                <div className="flex h-14 items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src="https://i.pinimg.com/564x/9a/9f/15/9a9f15138998651cc789a4654ccce6a4.jpg"
                      alt="WhatsApp icon"
                      width={24}
                      height={24}
                      className="rounded-sm"
                    />
                    <span className="text-sm font-semibold">Add people</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Icon name="more" className="h-5 w-5" />
                  </div>
                </div>
                <div className="px-3">
                  <div className="group relative flex items-center rounded-lg bg-[#202c33] px-3 py-2 text-sm text-zinc-300">
                    <Icon name="search" className="h-4 w-4 text-zinc-400" />
                    <input
                      value={peopleQuery}
                      onChange={(e) => setPeopleQuery(e.target.value)}
                      placeholder="Search by name or email"
                      className="ml-2 w-full bg-transparent outline-none placeholder:text-zinc-500"
                    />
                  </div>
                  {peopleError ? <div className="mt-2 text-xs text-red-400">{peopleError}</div> : null}
                </div>
                <div className="mt-2 space-y-1 px-3 pb-3">
                  {peopleLoading ? (
                    <div className="px-1 py-4 text-xs text-zinc-500">Searching...</div>
                  ) : peopleResults.length ? (
                    peopleResults.map((p) => (
                      <div
                        key={p.userId}
                        className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-zinc-800/60"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar name={p.name || p.email || "User"} src={p.picture || ""} />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-zinc-100">
                              {p.name || p.email || "User"}
                            </div>
                            <div className="truncate text-xs text-zinc-400">
                              {p.email || p.about || ""}
                            </div>
                          </div>
                        </div>
                        {p.requestStatus === "friends" ? (
                          <button
                            type="button"
                            disabled
                            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 opacity-70"
                          >
                            Added
                          </button>
                        ) : p.requestStatus === "outgoing" ? (
                          <button
                            type="button"
                            onClick={() => updateRequest(p.requestId, "cancel")}
                            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-100 hover:bg-zinc-700"
                          >
                            Cancel
                          </button>
                        ) : p.requestStatus === "incoming" ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateRequest(p.requestId, "decline")}
                              className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-100 hover:bg-zinc-700"
                            >
                              Decline
                            </button>
                            <button
                              type="button"
                              onClick={() => updateRequest(p.requestId, "accept")}
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                            >
                              Accept
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => sendRequest(p.userId)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                          >
                            Send
                          </button>
                        )}
                      </div>
                    ))
                  ) : peopleQuery.trim().length >= 2 ? (
                    <div className="px-1 py-4 text-xs text-zinc-500">No users found</div>
                  ) : (
                    <div className="px-1 py-4 text-xs text-zinc-500">Type at least 2 characters</div>
                  )}
                </div>

                <div className="border-t border-zinc-800 px-3 py-3">
                  <div className="text-[11px] uppercase tracking-wide text-zinc-500">Requests</div>
                  {requestsError ? <div className="mt-2 text-xs text-red-400">{requestsError}</div> : null}
                  {requestsLoading ? (
                    <div className="mt-2 text-xs text-zinc-500">Loading...</div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      <div>
                        <div className="text-xs font-medium text-zinc-300">Incoming</div>
                        {incomingRequests.length ? (
                          <div className="mt-1 space-y-1">
                            {incomingRequests.map((r) => (
                              <div
                                key={r.id}
                                className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-zinc-800/60"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <Avatar
                                    name={r.other?.name || r.other?.email || "User"}
                                    src={r.other?.picture || ""}
                                  />
                                  <div className="min-w-0">
                                    <div className="truncate text-sm text-zinc-100">
                                      {r.other?.name || r.other?.email || "User"}
                                    </div>
                                    <div className="truncate text-xs text-zinc-400">{r.other?.email || ""}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => updateRequest(r.id, "decline")}
                                    className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-100 hover:bg-zinc-700"
                                  >
                                    Decline
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateRequest(r.id, "accept")}
                                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                                  >
                                    Accept
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-1 text-xs text-zinc-500">No incoming requests</div>
                        )}
                      </div>

                      <div>
                        <div className="text-xs font-medium text-zinc-300">Outgoing</div>
                        {outgoingRequests.length ? (
                          <div className="mt-1 space-y-1">
                            {outgoingRequests.map((r) => (
                              <div
                                key={r.id}
                                className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-zinc-800/60"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <Avatar
                                    name={r.other?.name || r.other?.email || "User"}
                                    src={r.other?.picture || ""}
                                  />
                                  <div className="min-w-0">
                                    <div className="truncate text-sm text-zinc-100">
                                      {r.other?.name || r.other?.email || "User"}
                                    </div>
                                    <div className="truncate text-xs text-zinc-400">{r.other?.email || ""}</div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => updateRequest(r.id, "cancel")}
                                  className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs text-zinc-100 hover:bg-zinc-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-1 text-xs text-zinc-500">No outgoing requests</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex h-14 items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <Image
                      src="https://i.pinimg.com/564x/9a/9f/15/9a9f15138998651cc789a4654ccce6a4.jpg"
                      alt="WhatsApp icon"
                      width={24}
                      height={24}
                      className="rounded-sm"
                    />
                    <span className="text-sm font-semibold">WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Icon name="filter" className="h-5 w-5" />
                    <Icon name="more" className="h-5 w-5" />
                  </div>
                </div>
                <div className="px-3">
                  <div className="group relative flex items-center rounded-lg bg-[#202c33] px-3 py-2 text-sm text-zinc-300">
                    <Icon name="search" className="h-4 w-4 text-zinc-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask Meta AI or Search"
                      className="ml-2 w-full bg-transparent outline-none placeholder:text-zinc-500"
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 px-3 text-xs">
                  {["All", "Unread", "Favorites", "Groups"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilter(t)}
                      className={`rounded-full px-3 py-1 ${
                        filter === t
                          ? "bg-emerald-700 text-white"
                          : "bg-[#202c33] text-zinc-300 hover:bg-[#24323a]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="mt-2 space-y-1 px-3 pb-3">
                  {filtered.length ? (
                    filtered.map((c) => (
                      <ChatItem
                        key={c.id}
                        chat={c}
                        active={c.id === activeId}
                        onClick={() => setActiveId(c.id)}
                      />
                    ))
                  ) : (
                    <div className="px-1 py-6 text-center text-xs text-zinc-500">No chats yet</div>
                  )}
                </div>
              </>
            )}
          </aside>

          {section === "people" ? (
            <section className="flex min-h-screen flex-1 flex-col bg-[#0b141a]">
              <div className="flex h-14 items-center justify-between border-b border-zinc-800 bg-[#202c33] px-4">
                <div className="text-sm font-medium">Global search</div>
              </div>
              <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
                Search for users and send requests
              </div>
            </section>
          ) : section === "ai" ? (
            <PeerCallPanel />
          ) : (
            <section className="flex min-h-screen flex-1 flex-col bg-[#0b141a]">
              {activeChat ? (
                <>
                  <div className="flex h-14 items-center justify-between border-b border-zinc-800 bg-[#202c33] px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={activeChat.name} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{activeChat.name}</span>
                        <span className="text-[11px] text-zinc-400">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-300">
                      <Icon name="phone" className="h-5 w-5" />
                      <Icon name="video" className="h-5 w-5" />
                      <Icon name="more" className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="flex-1 bg-[url('/vercel.svg')] bg-[length:400px] bg-center bg-no-repeat p-4">
                    <div className="mx-auto flex max-w-3xl flex-col gap-2">
                      <DateChip label="Yesterday" />
                      {(messages[activeId] || []).map((m) => (
                        <MessageBubble key={m.id} m={m} />
                      ))}
                      <DateChip label="Today" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-zinc-800 bg-[#202c33] p-3">
                    <button className="rounded-md p-2 text-zinc-300 hover:bg-[#24323a]">
                      <Icon name="emoji" className="h-5 w-5" />
                    </button>
                    <button className="rounded-md p-2 text-zinc-300 hover:bg-[#24323a]">
                      <Icon name="attach" className="h-5 w-5" />
                    </button>
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type a message"
                      className="flex-1 rounded-lg bg-[#2a3942] px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendDraft();
                        }
                      }}
                    />
                    <button
                      onClick={sendDraft}
                      className="rounded-md p-2 text-white hover:bg-[#24323a]"
                    >
                      <Icon name="send" className="h-5 w-5" />
                    </button>
                    <button className="rounded-md p-2 text-zinc-300 hover:bg-[#24323a]">
                      <Icon name="mic" className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
                  Select a chat to start messaging
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
