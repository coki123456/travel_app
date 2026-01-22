/**
 * Utilidades de validación
 * Centraliza validaciones y normalización de datos
 */

import { isValidBlock, isValidItemType } from "./constants";

/**
 * Normaliza un texto: trim y validación de no vacío
 * @returns String normalizado o null si está vacío/inválido
 */
export function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Valida datos de un viaje
 */
export function validateTripData(data: {
  name?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  destinations?: unknown;
}) {
  const errors: string[] = [];

  const name = normalizeText(data.name);
  if (!name) {
    errors.push("El nombre del viaje es obligatorio");
  }

  if (!(data.startDate instanceof Date)) {
    errors.push("La fecha de inicio es inválida");
  }

  if (!(data.endDate instanceof Date)) {
    errors.push("La fecha de fin es inválida");
  }

  if (
    data.startDate instanceof Date &&
    data.endDate instanceof Date &&
    data.endDate < data.startDate
  ) {
    errors.push("La fecha de fin debe ser posterior a la fecha de inicio");
  }

  const destinations = normalizeText(data.destinations);

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      name,
      startDate: data.startDate instanceof Date ? data.startDate : null,
      endDate: data.endDate instanceof Date ? data.endDate : null,
      destinations,
    },
  };
}

/**
 * Valida datos de un item
 */
export function validateItemData(data: {
  date?: unknown;
  block?: unknown;
  type?: unknown;
  title?: unknown;
  description?: unknown;
}) {
  const errors: string[] = [];

  if (!(data.date instanceof Date)) {
    errors.push("La fecha es obligatoria e inválida");
  }

  if (!isValidBlock(data.block)) {
    errors.push("El bloque es inválido");
  }

  if (!isValidItemType(data.type)) {
    errors.push("El tipo es inválido");
  }

  const title = normalizeText(data.title);
  if (!title) {
    errors.push("El título es obligatorio");
  }

  const description = normalizeText(data.description);

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      date: data.date instanceof Date ? data.date : null,
      block: data.block,
      type: data.type,
      title,
      description,
    },
  };
}

/**
 * Valida datos de un día
 */
export function validateDayData(data: {
  date?: unknown;
  city?: unknown;
  summary?: unknown;
  journal?: unknown;
}) {
  const errors: string[] = [];

  if (!(data.date instanceof Date)) {
    errors.push("La fecha es obligatoria e inválida");
  }

  const city = normalizeText(data.city);
  const summary = normalizeText(data.summary);
  const journal = normalizeText(data.journal);

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      date: data.date instanceof Date ? data.date : null,
      city,
      summary,
      journal,
    },
  };
}

/**
 * Valida un email
 */
export function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida una contraseña (mínimo 6 caracteres)
 */
export function isValidPassword(password: unknown): password is string {
  if (typeof password !== "string") return false;
  return password.length >= 6;
}

/**
 * Valida credenciales de usuario
 */
export function validateUserCredentials(data: {
  email?: unknown;
  password?: unknown;
  name?: unknown;
}) {
  const errors: string[] = [];

  if (!isValidEmail(data.email)) {
    errors.push("Email inválido");
  }

  if (!isValidPassword(data.password)) {
    errors.push("La contraseña debe tener al menos 6 caracteres");
  }

  const name = data.name ? normalizeText(data.name) : null;

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      email: data.email,
      password: data.password,
      name,
    },
  };
}
