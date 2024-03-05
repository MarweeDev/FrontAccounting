export class OrderDTO {
  id?: number;
  codigo?: string;
  id_mesa?: number;
  id_usuario?: number;
  nombre_cliente?: string;
  fecha?: Date;
  id_estadoorden?: number;
  id_tipopago?: number | null;
  id_producto?: number | null;
  cantidad?: number | null;
}
