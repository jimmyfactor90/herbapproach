// App constants
export const APP_NAME = "Herb Approach";
export const APP_DESCRIPTION =
  "Canada's Premium Online Dispensary - Top Shelf cannabis, edibles and concentrates delivered to your doorstep.";

// Roles
export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
} as const;

// Order statuses
export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

// Payment
export const PAYMENT_PROVIDERS = {
  RAZORPAY: "RAZORPAY",
  STRIPE: "STRIPE",
  COD: "COD",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

// Plant care levels
export const CARE_LEVELS = [
  { value: "EASY", label: "Easy", icon: "🟢" },
  { value: "MEDIUM", label: "Medium", icon: "🟡" },
  { value: "EXPERT", label: "Expert", icon: "🔴" },
] as const;

// Sunlight options
export const SUNLIGHT_OPTIONS = [
  { value: "FULL_SUN", label: "Full Sun", icon: "☀️" },
  { value: "PARTIAL_SUN", label: "Partial Sun", icon: "🌤️" },
  { value: "INDIRECT", label: "Indirect Light", icon: "🌥️" },
  { value: "LOW_LIGHT", label: "Low Light", icon: "🌙" },
] as const;

// Plant types
export const PLANT_TYPES = [
  { value: "INDOOR", label: "Indoor" },
  { value: "OUTDOOR", label: "Outdoor" },
  { value: "BOTH", label: "Indoor & Outdoor" },
] as const;

// Plant sizes
export const PLANT_SIZES = [
  { value: "SMALL", label: "Small (up to 30cm)" },
  { value: "MEDIUM", label: "Medium (30-60cm)" },
  { value: "LARGE", label: "Large (60-120cm)" },
  { value: "EXTRA_LARGE", label: "Extra Large (120cm+)" },
] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

// Notification types
export const NOTIFICATION_TYPES = {
  ORDER_UPDATE: "ORDER_UPDATE",
  PAYMENT_STATUS: "PAYMENT_STATUS",
  PROMOTION: "PROMOTION",
  SYSTEM: "SYSTEM",
  LOW_STOCK: "LOW_STOCK",
} as const;
