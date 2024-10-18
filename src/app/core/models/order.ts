import {DetailOrderDTO} from './detailOrder';

export class OrderDTO {
  id?: number;
  codigo?: string;
  id_usuario?: number;
  id_client?: number | null;
  id_tipopago?: number | null;
  id_subtipopago?: number | null;
  fecha_creacion?: Date;
  id_estadoorden?: number;
  detalle?: DetailOrderDTO;
}
