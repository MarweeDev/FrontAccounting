export interface PeripheralConfigDTO {
  id?: number;
  id_suscrito?: number;
  id_caja?: number | null;
  modo: 'local-agent' | 'web' | 'simulation';
  agent_url?: string | null;
  printer_name?: string | null;
  printer_type?: string | null;
  payment_terminal_enabled?: boolean;
  payment_provider?: string | null;
  auto_print_after_payment?: boolean;
  print_copies?: number;
  id_estado?: number;
  fecha_creacion?: Date | string;
  fecha_actualizacion?: Date | string;
}
