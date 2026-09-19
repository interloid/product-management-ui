import { productCategories } from "@/lib/product-options";

export type CategoryTone = {
  label: string;
  badge: string;
};

export const CATEGORY_TONES: CategoryTone[] = [
  {
    label: "Indigo",
    badge:
      "border-transparent bg-indigo-50 text-indigo-700 dark:border-transparent dark:bg-indigo-950/50 dark:text-indigo-300",
  },
  {
    label: "Amber",
    badge:
      "border-transparent bg-amber-50 text-amber-700 dark:border-transparent dark:bg-amber-950/50 dark:text-amber-300",
  },
  {
    label: "Emerald",
    badge:
      "border-transparent bg-emerald-50 text-emerald-700 dark:border-transparent dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  {
    label: "Rose",
    badge:
      "border-transparent bg-rose-50 text-rose-700 dark:border-transparent dark:bg-rose-950/50 dark:text-rose-300",
  },
  {
    label: "Sky",
    badge:
      "border-transparent bg-sky-50 text-sky-700 dark:border-transparent dark:bg-sky-950/50 dark:text-sky-300",
  },
  {
    label: "Fuchsia",
    badge:
      "border-transparent bg-fuchsia-50 text-fuchsia-700 dark:border-transparent dark:bg-fuchsia-950/50 dark:text-fuchsia-300",
  },
  {
    label: "Green",
    badge:
      "border-transparent bg-green-50 text-green-700 dark:border-transparent dark:bg-green-950/50 dark:text-green-300",
  },
  {
    label: "Cyan",
    badge:
      "border-transparent bg-cyan-50 text-cyan-700 dark:border-transparent dark:bg-cyan-950/50 dark:text-cyan-300",
  },
  {
    label: "Violet",
    badge:
      "border-transparent bg-violet-50 text-violet-700 dark:border-transparent dark:bg-violet-950/50 dark:text-violet-300",
  },
  {
    label: "Red",
    badge:
      "border-transparent bg-red-50 text-red-700 dark:border-transparent dark:bg-red-950/50 dark:text-red-300",
  },
  {
    label: "Orange",
    badge:
      "border-transparent bg-orange-50 text-orange-700 dark:border-transparent dark:bg-orange-950/50 dark:text-orange-300",
  },
  {
    label: "Pink",
    badge:
      "bg-pink-50 text-pink-700 dark:border-transparent dark:bg-pink-950/50 dark:text-pink-300",
  },
];

const KNOWN_CATEGORY_KEYS = productCategories.map((category) =>
  category.value.toLowerCase(),
);

export function categoryToneFor(name: string): CategoryTone {
  const key = (name ?? "").trim().toLowerCase();

  if (key) {
    const knownIndex = KNOWN_CATEGORY_KEYS.indexOf(key);

    if (knownIndex !== -1) {
      return CATEGORY_TONES[knownIndex % CATEGORY_TONES.length];
    }
  }

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }

  return CATEGORY_TONES[hash % CATEGORY_TONES.length];
}
