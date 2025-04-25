import { variantShapes } from "./VariantShapes";

type VariantKey = keyof typeof variantShapes;

/**
 * Normalize a value based on its variant to a compatible shape.
 * @param value The raw value to normalize.
 * @param variant The variant type to use for normalization.
 * @returns Normalized value.
 */
export function normalizeValue<T = any>(value: any, variant: VariantKey): T {
  const normalizer = variantShapes[variant];
  return normalizer ? normalizer(value) : value;
}
