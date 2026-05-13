export class ComponentPermissionDTO {
  id?: number;
  id_rol?: number;
  id_modulo?: number;
  id_componente?: number | null;
  accion?: string;
  permitido?: boolean;
  id_estado?: number;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}
