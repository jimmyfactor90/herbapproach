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

// Strain types
export const STRAIN_TYPES = [
  { value: "INDICA", label: "Indica", icon: "🌙" },
  { value: "SATIVA", label: "Sativa", icon: "☀️" },
  { value: "HYBRID", label: "Hybrid", icon: "🌗" },
] as const;

// Potency options
export const POTENCY_LEVELS = [
  { value: "HIGH_THC", label: "High Dose THC", icon: "🔴" },
  { value: "LOW_THC", label: "Low Dose THC", icon: "🟡" },
  { value: "BALANCED", label: "Balanced 1:1", icon: "⚖️" },
  { value: "CBD", label: "CBD", icon: "🟢" },
] as const;

// Growth method (Flowers/Pre-Rolls sourcing)
export const GROWTH_METHODS = [
  { value: "INDOOR", label: "Indoor" },
  { value: "OUTDOOR", label: "Outdoor" },
  { value: "BOTH", label: "Greenhouse" },
] as const;

// Flower quality grade
export const FLOWER_GRADES = [
  { value: "SMALL", label: "AAA" },
  { value: "MEDIUM", label: "AAAA" },
  { value: "LARGE", label: "AAAA+" },
  { value: "EXTRA_LARGE", label: "Craft" },
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
