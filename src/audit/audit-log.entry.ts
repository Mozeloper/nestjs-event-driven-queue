export interface AuditLogEntry {
  orderId: string;
  eventNameSpace: string;
  capturedAt: Date;
  summary: string;
}
