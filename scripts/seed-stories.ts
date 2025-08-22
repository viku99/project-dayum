// =============================================
// FILE: scripts/seed-stories.ts
// ---------------------------------------------
// Run with: npx ts-node scripts/seed-stories.ts
// Seeds demo stories into Firestore
// =============================================

import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Story } from "@/types/story";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const stories: Omit<Story, "id">[] = [
  {
    title: "The Haunted House",
    slug: generateSlug("The Haunted House"),
    image: "/images/haunted-house.jpg",
    excerpt: "A spooky story of an abandoned house...",
    createdAt: Date.now(),
  },
  {
    title: "Space Adventures",
    slug: generateSlug("Space Adventures"),
    image: "/images/space-adventures.jpg",
    excerpt: "Exploring the universe and beyond...",
    createdAt: Date.now(),
  },
  {
    title: "The Secret Garden",
    slug: generateSlug("The Secret Garden"),
    image: "/images/secret-garden.jpg",
    excerpt: "A magical place hidden from the world...",
    createdAt: Date.now(),
  },
];

async function seedStories() {
  for (const story of stories) {
    await addDoc(collection(db, "stories"), story);
    console.log(`✅ Added: ${story.title}`);
  }
}

seedStories()
  .then(() => console.log("🎉 Seeding complete!"))
  .catch(console.error);
