/**
 * Utilidades para manejo de fechas
 * Centraliza toda la lógica de parsing, formateo y normalización de fechas
 */

/**
 * Parsea una fecha en formato string YYYY-MM-DD o ISO a objeto Date
 * @returns Date normalizado a medianoche o null si es inválido
 */
export function parseDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;

  // Extraer solo la parte de la fecha (ignorar hora si es ISO)
  const base = value.split("T")[0];
  const match = base.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day, 0, 0, 0);

  // Validar que la fecha sea válida
  if (
    Number.isNaN(date.valueOf()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

/**
 * Formatea una fecha como string YYYY-MM-DD
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Normaliza una fecha a medianoche (00:00:00)
 */
export function normalizeToDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0);
}

/**
 * Normaliza una fecha a mediodía (12:00:00)
 * Útil para evitar problemas de zona horaria en comparaciones
 */
export function normalizeToNoon(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12, 0, 0);
}

/**
 * Formatea una fecha de forma legible en español
 * Ejemplo: "lunes, 15 de enero de 2024"
 */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Genera un array de fechas entre dos fechas (inclusivo)
 */
export function buildDaysInRange(start: Date, end: Date): Date[] {
  const result: Date[] = [];
  const cursor = normalizeToNoon(start);
  const limit = normalizeToNoon(end);

  while (cursor <= limit) {
    result.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

/**
 * Obtiene el primer y último día del mes de una fecha
 */
export function getMonthRange(date: Date): { start: Date; end: Date } {
  const year = date.getFullYear();
  const month = date.getMonth();

  return {
    start: new Date(year, month, 1, 0, 0, 0),
    end: new Date(year, month + 1, 0, 23, 59, 59),
  };
}

/**
 * Comprueba si dos fechas son el mismo día
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDateKey(date1) === formatDateKey(date2);
}

/**
 * Obtiene el rango de fechas para el día siguiente
 * Útil para queries de BD
 */
export function getNextDayRange(date: Date): { start: Date; end: Date } {
  const start = normalizeToDay(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { start, end };
}
