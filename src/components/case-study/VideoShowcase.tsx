"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * VideoShowcase — B-Roll Video Grid (GSAP-only)
 *
 * Muted autoplay, loop, IntersectionObserver play/pause.
 * GSAP scroll reveals instead of Framer Motion.
 */

export interface VideoClip {
  src: string;
  poster?: string;
  caption?: string;
  aspect?: string;
}

interface VideoShowcaseProps {
  videos: VideoClip[];
}

function VideoCard({ clip, index }: { clip: VideoClip; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Scroll-triggered play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // GSAP reveal
  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0.15 },
      {
        opacity: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
        },
      }
    );
  }, [index]);

  const aspect = clip.aspect || "16/9";

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden group"
      style={{ aspectRatio: aspect }}
    >
      <video
        ref={videoRef}
        src={clip.src}
        poster={clip.poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        style={{ backgroundColor: clip.poster ? undefined : "var(--color-surface)" }}
      />

      {clip.caption && (
        <div
          className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
          }}
        >
          <span
            className="font-mono uppercase"
            style={{
              fontSize: "var(--text-micro)",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            {clip.caption}
          </span>
        </div>
      )}
    </div>
  );
}

export default function VideoShowcase({ videos }: VideoShowcaseProps) {
  if (!videos || videos.length === 0) return null;

  if (videos.length === 1) {
    return <VideoCard clip={videos[0]} index={0} />;
  }

  if (videos.length === 2) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.map((clip, i) => (
          <VideoCard key={clip.src} clip={clip} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <VideoCard clip={videos[0]} index={0} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.slice(1).map((clip, i) => (
          <VideoCard key={clip.src} clip={clip} index={i + 1} />
        ))}
      </div>
    </div>
  );
}
