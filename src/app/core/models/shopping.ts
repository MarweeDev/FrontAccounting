export interface ShoppingItemDTO {
  id?: number;
  id_producto: number;
  producto?: string;
  cantidad: number;
  valor_unitario: number;
  total?: number;
}

export interface ShoppingDTO {
  id?: number;
  codigo?: string;
  id_proveedor: number;
  proveedor?: string;
  nit?: string;
  total_compra?: number;
  id_estado?: number;
  fecha_creacion?: Date | string;
  items: ShoppingItemDTO[];
}
