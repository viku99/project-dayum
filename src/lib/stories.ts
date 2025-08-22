import { db } from "@/lib/firebase";
import {
  QueryConstraint, collection, getDocs, limit, onSnapshot,
  orderBy, query, where
} from "firebase/firestore";
import type { Story } from "@/types/story";

// Realtime list for carousels etc.
export function listenStories(cb: (stories: Story[]) => void, ...extra: QueryConstraint[]) {
  const q = query(
    collection(db, "stories"),
    orderBy("createdAt", "desc"),
    ...extra
  );
  return onSnapshot(q, (snap) => {
    const out: Story[] = [];
    snap.forEach((d) => {
      const data = d.data() as Partial<Story>;
      if (!data.slug || !data.title) return;
      out.push({ id: d.id, slug: data.slug, title: data.title, image: data.image, excerpt: data.excerpt, content: data.content, author: data.author, createdAt: data.createdAt, updatedAt: data.updatedAt, published: data.published });
    });
    cb(out);
  });
}

// Realtime single story by slug
export function listenStoryBySlug(slug: string, cb: (story: Story | null) => void) {
  const q = query(collection(db, "stories"), where("slug", "==", slug), limit(1));
  return onSnapshot(q, (snap) => {
    if (snap.empty) return cb(null);
    const d = snap.docs[0];
    const data = d.data() as Partial<Story>;
    cb({
      id: d.id,
      slug: data.slug!,
      title: data.title ?? "",
      image: data.image,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      published: data.published,
    });
  });
}

// One-shot fetch by slug (optional)
export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const q = query(collection(db, "stories"), where("slug", "==", slug), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  const data = d.data() as Partial<Story>;
  return {
    id: d.id,
    slug: data.slug!,
    title: data.title ?? "",
    image: data.image,
    excerpt: data.excerpt,
    content: data.content,
    author: data.author,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    published: data.published,
  };
}

// Used only to *suggest* params during SSG/export. Avoid hard dependency at build time.
export async function fetchAllSlugs(max = 50): Promise<string[]> {
  // On server/build, don't touch Firestore (prevents export build issues).
  if (typeof window === "undefined") return [];
  const q = query(collection(db, "stories"), orderBy("createdAt", "desc"), limit(max));
  const snap = await getDocs(q);
  const slugs = new Set<string>();
  snap.forEach((d) => {
    const s = (d.data() as any).slug;
    if (s) slugs.add(s);
  });
  return Array.from(slugs);
}
