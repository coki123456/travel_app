/**
 * Constantes compartidas de la aplicación
 * Centraliza valores que se usan en múltiples lugares
 */

// Bloques de tiempo del día
export const BLOCKS = [
  { value: "ALL_DAY", label: "Todo el día" },
  { value: "MORNING", label: "Mañana" },
  { value: "AFTERNOON", label: "Tarde" },
  { value: "EVENING", label: "Noche" },
] as const;

// Tipos de items/actividades
export const ITEM_TYPES = [
  { value: "HOTEL", label: "Hotel" },
  { value: "FLIGHT", label: "Vuelo" },
  { value: "ATTRACTION", label: "Atraccion" },
  { value: "FOOD", label: "Comida" },
  { value: "TRANSFER", label: "Traslado" },
  { value: "NOTE", label: "Nota" },
] as const;

// Tipos TypeScript derivados
export type BlockValue = typeof BLOCKS[number]["value"];
export type ItemTypeValue = typeof ITEM_TYPES[number]["value"];

/**
 * Obtiene el label legible de un tipo de item
 */
export function getTypeLabel(value: string): string {
  return ITEM_TYPES.find((type) => type.value === value)?.label ?? value;
}

/**
 * Obtiene el label legible de un bloque
 */
export function getBlockLabel(value: string): string {
  return BLOCKS.find((block) => block.value === value)?.label ?? value;
}

/**
 * Valida si un valor es un bloque válido
 */
export function isValidBlock(value: unknown): value is BlockValue {
  return BLOCKS.some((block) => block.value === value);
}

/**
 * Valida si un valor es un tipo de item válido
 */
export function isValidItemType(value: unknown): value is ItemTypeValue {
  return ITEM_TYPES.some((type) => type.value === value);
}
