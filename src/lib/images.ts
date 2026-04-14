export const FALLBACK_PRODUCT_IMAGE = '/placeholder-product.svg';

export function parseImageList(value?: string | null) {
  if (!value) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((entry): entry is string => typeof entry === 'string' && entry.length > 0);
  } catch {
    return [];
  }
}

export function withFallbackImage(image?: string | null) {
  return image || FALLBACK_PRODUCT_IMAGE;
}