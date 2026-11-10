"use client";
import { useState } from "react";
import CompleteButton from "./CompleteButton";

// Tombol buka formulir + tombol konfirmasi. Konfirmasi baru aktif setelah formulir dibuka.
// "Sudah dibuka" dicatat di server (kunci "<aktivitas>-dibuka"), sehingga tidak bisa dilewati.
export default function FormStep({ activityKey, url, openLabel, doneLabel, note, initiallyOpened }: {
  activityKey: string; url: string; openLabel: string; doneLabel: string; note?: string; initiallyOpened: boolean;
}) {
  const [opened, setOpened] = useState(initiallyOpened);

  function onOpen() {
    setOpened(true);
    fetch(`/api/user/aktivitas/${activityKey}-dibuka/complete`, { method: "POST", keepalive: true }).catch(() => {});
  }

  return (
    <>
      <a href={url} target="_blank" rel="noopener noreferrer" onClick={onOpen} className="btn-merah !min-h-[4.5rem] !px-12 !text-2xl">{openLabel}</a>
      {note && <p className="text-base opacity-70">{note}</p>}
      <div className="border-t-4 border-dotted border-langit pt-5">
        <p className="mb-3 font-bold" aria-live="polite">
          {opened ? "Formulir sudah dibuka. Setelah selesai mengisi, tekan tombol di bawah." : "Buka formulir dulu, ya. Tombol di bawah baru aktif setelah itu. 🔒"}
        </p>
        <CompleteButton activityKey={activityKey} label={doneLabel} disabled={!opened} />
      </div>
    </>
  );
}
