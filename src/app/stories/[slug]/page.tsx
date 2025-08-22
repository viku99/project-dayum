// Story Page (Dynamic by Slug)
import type { Metadata } from "next";
import { fetchAllSlugs } from "@/lib/stories";
import StoryReaderWrapper from "@/components/StoryReaderWrapper";

// Allow dynamic routes
export const dynamicParams = true;

/**
 * ✅ Pre-generate params for SSG/ISR
 */
export async function generateStaticParams() {
  if (process.env.EXPORT_MODE === "true") {
    return ["coding", "writing", "virtual-art"].map((slug) => ({ slug }));
  }

  try {
    const slugs = await fetchAllSlugs(50);
    return slugs.map((slug) => ({ slug }));
  } catch (err) {
    console.error("⚠️ Error fetching slugs:", err);
    return [{ slug: "coding" }];
  }
}

/**
 * ✅ Dynamic SEO Metadata
 */
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const title = formatSlug(params.slug);

  return {
    title: `${title} | Project Dayum`,
    description: `Explore "${title}" — a unique story experience.`,
    openGraph: {
      title: `${title} | Project Dayum`,
      description: `Read the story "${title}" now.`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Project Dayum`,
      description: `Discover "${title}" on Project Dayum.`,
    },
  };
}

/**
 * ✅ Utility — converts "virtual-art" → "Virtual Art"
 */
function formatSlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * ✅ Page Component
 */
export default function Page({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-[85vh] bg-neutral-950 text-white">
      <StoryReaderWrapper slug={params.slug} />
    </main>
  );
}
