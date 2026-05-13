export interface ShoppingItemDTO {
  id?: number;
  id_producto: number;
  producto?: string;
  type?: number;
  cantidad: number;
  valor_unitario: number;
  discount?: number;
  subtotal?: number;
  taxes?: import('./tax').AppliedTaxDTO[];
  total_impuesto?: number;
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
