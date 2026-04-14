export const VALID_CATEGORY_SLUGS = [
  'clothing',
  'electronics',
  'home-garden',
  'sports-outdoors',
] as const;

export type CategorySlug = (typeof VALID_CATEGORY_SLUGS)[number];

export function isValidCategorySlug(value: string): value is CategorySlug {
  return VALID_CATEGORY_SLUGS.includes(value as CategorySlug);
}

export function parseCategorySlug(value: string | null): CategorySlug | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return isValidCategorySlug(normalized) ? normalized : null;
}
