export type InventoryMovementType = 'purchase' | 'sale' | 'manual' | 'minor_cash' | 'adjustment';

export interface InventoryMovementDTO {
  id?: number;
  id_producto: number;
  producto?: string;
  reference?: string;
  movement_type: InventoryMovementType;
  initial_quantity: number;
  input_quantity: number;
  output_quantity: number;
  final_quantity: number;
  origin_type?: string;
  origin_id?: number | string;
  created_at?: string;
  responsable?: string;
}
