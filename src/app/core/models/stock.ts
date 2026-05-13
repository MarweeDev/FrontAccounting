export interface StockDTO {
  id?: number;
  id_producto: number;
  cantidad: number;
  producto?: string;
  referencia?: string;
  id_categoria?: number;
  categoria?: string;
  precio?: number;
  id_estado?: number;
  image?: string;
}
