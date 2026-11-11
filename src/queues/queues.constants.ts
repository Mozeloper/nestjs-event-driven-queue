export const QUEUE_NAMES = {
  ORDER_EVENTS: 'order-events',
  INVENTORY: 'inventory-events',
  NOTIFICATIONS: 'notifications-events',
  PAYMENTS: 'payments-events',
  AUDITS: 'audits-events',
} as const;

export const ALL_ORDER_QUEUES_NAMES = Object.values(QUEUE_NAMES);
