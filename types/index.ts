/**
 * Tipos compartidos de la aplicación
 * Centraliza todos los tipos TypeScript para evitar duplicación
 */

// ============================================
// TIPOS DE ENTIDADES
// ============================================

export type Trip = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  destinations: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TripSummary = Pick<Trip, "id" | "name">;

export type TripListItem = {
  id: string;
  name: string;
  destinations: string | null;
  dates: string;
};

export type Day = {
  id: string;
  date: Date;
  city: string | null;
  summary: string | null;
  journal: string | null;
  tripId: string;
};

export type DaySummary = Pick<Day, "id" | "date" | "city" | "summary">;

export type Item = {
  id: string;
  title: string;
  description: string | null;
  type: ItemType;
  block: BlockType;
  orderIndex: number;
  dayId: string;
  createdAt: Date;
};

export type ItemView = Pick<Item, "id" | "title" | "description" | "type" | "block">;

export type Attachment = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  path: string;
  dayId: string;
  createdAt: Date;
};

export type AttachmentView = Pick<Attachment, "id" | "fileName" | "mimeType" | "sizeBytes" | "path">;

export type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
};

// ============================================
// TIPOS DE CONSTANTES
// ============================================

export type BlockType = "ALL_DAY" | "MORNING" | "AFTERNOON" | "EVENING";

export type ItemType = "HOTEL" | "FLIGHT" | "ATTRACTION" | "FOOD" | "TRANSFER" | "NOTE";

export type BlockOption = {
  value: BlockType;
  label: string;
};

export type ItemTypeOption = {
  value: ItemType;
  label: string;
  icon: string;
};

// ============================================
// TIPOS DE FORMULARIOS
// ============================================

export type TripFormData = {
  id?: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  destinations: string | null;
};

export type DayFormData = {
  city: string | null;
  summary: string | null;
  journal: string | null;
};

export type ItemFormData = {
  title: string;
  description: string | null;
  type: ItemType;
  block: BlockType;
};

export type UserCredentials = {
  email: string;
  password: string;
  name?: string | null;
};

// ============================================
// TIPOS DE API RESPONSES
// ============================================

export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export type ApiError = {
  error: string;
  details?: unknown;
};

// ============================================
// TIPOS DE PROPS DE COMPONENTES
// ============================================

export type CalendarMonthCardProps = {
  monthDays: Date[];
  dayMap: Map<string, DaySummary>;
  tripStartDate: Date;
  tripEndDate: Date;
  today: Date;
};

export type DailyItineraryCardProps = {
  day: DaySummary | undefined;
  date: Date;
  dateKey: string;
};

export type TripSelectorProps = {
  trips: TripSummary[];
  currentTripId?: string;
};

// ============================================
// TIPOS DE UTILIDADES
// ============================================

export type DateRange = {
  start: Date;
  end: Date;
};

export type ValidationResult<T> = {
  isValid: boolean;
  errors: string[];
  data: T;
};
