
"use client";

function Key({ children }) {
  return (
    <div className="flex h-6 min-w-6 items-center justify-center rounded-md bg-zinc-700 px-1.5 text-sm font-semibold text-zinc-300">
      {children}
    </div>
  );
}

export default function KeyboardShortcuts({ onClose }) {
  const shortcuts = [
    { label: "Mark as unread", keys: ["Ctrl", "Alt", "Shift", "U"] },
    { label: "Mute", keys: ["Ctrl", "Alt", "Shift", "M"] },
    { label: "Archive chat", keys: ["Ctrl", "Alt", "Shift", "E"] },
    { label: "Pin chat", keys: ["Ctrl", "Alt", "Shift", "P"] },
    { label: "Search", keys: ["Ctrl", "Alt", "/"] },
    { label: "Search chat", keys: ["Ctrl", "Shift", "F"] },
    { label: "New chat", keys: ["Ctrl", "Alt", "N"] },
    { label: "Next chat", keys: ["Ctrl", "Alt", "Tab"] },
    { label: "Previous chat", keys: ["Ctrl", "Alt", "Shift", "Tab"] },
    { label: "Label chat", keys: ["Ctrl", "Alt", "Shift", "L"] },
    { label: "Close chat", keys: ["Escape"] },
    { label: "New group", keys: ["Ctrl", "Alt", "Shift", "N"] },
    { label: "Profile and About", keys: ["Ctrl", "Alt", "P"] },
    { label: "Increase speed of selected voice message", keys: ["Shift", "."] },
    { label: "Decrease speed of selected voice message", keys: ["Shift", ","] },
    { label: "Settings", keys: ["Ctrl", "Alt", ","] },
    { label: "Emoji panel", keys: ["Ctrl", "Alt", "E"] },
    { label: "GIF panel", keys: ["Ctrl", "Alt", "G"] },
    { label: "Sticker panel", keys: ["Ctrl", "Alt", "S"] },
    { label: "Extended search", keys: ["Alt", "K"] },
  ];

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/70">
      <div className="w-[720px] rounded-xl bg-[#202c33] pb-6 shadow-xl">
        <div className="px-6 pt-6 pb-4 text-lg font-semibold text-zinc-100">
          Keyboard shortcuts
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 px-6 pb-8">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.label} className="flex items-center justify-between">
              <div className="text-sm text-zinc-300">{shortcut.label}</div>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key) => (
                  <Key key={key}>{key}</Key>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end px-6">
          <button
            onClick={onClose}
            className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
