"use client";

import { useState } from "react";

export function YouTube({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  if (play) {
    return (
      <div className="video-frame" style={{ borderRadius: 16 }}>
        <iframe
          src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <button
      type="button"
      className="video-frame video-poster"
      style={{ borderRadius: 16 }}
      onClick={() => setPlay(true)}
      aria-label={`Play ${title}`}
    >
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" />
      <span className="play" />
    </button>
  );
}
