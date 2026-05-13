export type ShiftStatus = 'open' | 'closed';

export interface ShiftDTO {
  id?: number;
  status: ShiftStatus;
  responsable?: string;
  opening_amount: number;
  expected_cash?: number;
  counted_cash?: number;
  sales_total?: number;
  expenses_total?: number;
  minor_cash_total?: number;
  difference?: number;
  opened_at?: string;
  closed_at?: string;
  notes?: string;
}
