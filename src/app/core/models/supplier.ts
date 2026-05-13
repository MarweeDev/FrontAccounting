export interface SupplierDTO {
  id?: number;
  proveedor: string;
  descripcion: string;
  nit: string;
  contacto: string;
  fecha?: Date | string;
  id_estado?: number;
}
