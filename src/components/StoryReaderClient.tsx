"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { Story } from "@/types/story";
import { listenStoryBySlug } from "@/lib/stories";

// Optional: tiny Markdown renderer without extra deps
function renderParagraphs(text?: string) {
  if (!text) return null;
  return text
    .split(/\n{2,}/g)
    .map((para, i) => (
      <p key={i} className="leading-7 tracking-wide text-white/90">
        {para}
      </p>
    ));
}

export default function StoryReaderClient({ slug }: { slug: string }) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  // Realtime read
  useEffect(() => {
    const unsub = listenStoryBySlug(slug, (s) => {
      setStory(s);
      setLoading(false);
    });
    return () => unsub();
  }, [slug]);

  const title = useMemo(() => {
    if (story?.title) return story.title;
    return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }, [slug, story?.title]);

  if (loading) {
    return (
      <main className="min-h-[80vh] bg-neutral-950 grid place-items-center text-white">
        <div className="animate-pulse text-white/70">Loading story…</div>
      </main>
    );
  }

  if (!story) {
    return (
      <main className="min-h-[80vh] bg-neutral-950 grid place-items-center text-white">
        <div className="text-white/80">Story not found.</div>
      </main>
    );
  }

  return (
    <main className="min-h-[100vh] bg-neutral-950 text-white">
      {/* Hero */}
      <header className="relative">
        {story.image ? (
          <div className="relative h-[36vh] w-full overflow-hidden">
            <Image
              src={story.image}
              alt={title}
              fill
              sizes="100vw"
              className="object-cover"
              unoptimized={true}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
        ) : (
          <div className="h-20" />
        )}
        <div className="max-w-3xl mx-auto px-5 -mt-10 relative">
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          {story.author && (
            <p className="text-white/60 mt-1">by {story.author}</p>
          )}
        </div>
      </header>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-5 pb-24 pt-8">
        {story.excerpt && (
          <p className="text-white/80 italic border-l-4 border-white/20 pl-4 mb-6">
            {story.excerpt}
          </p>
        )}

        <div className="prose prose-invert max-w-none">
          {renderParagraphs(story.content) || (
            <p className="text-white/70">
              No content yet. You can fill the <code>content</code> field in Firestore to show the story here.
            </p>
          )}
        </div>
      </article>

      {/* Footer nav (next/prev placeholders for later) */}
      <div className="border-t border-white/10 py-6 text-center text-white/60">
        Happy reading ✨
      </div>
    </main>
  );
}
