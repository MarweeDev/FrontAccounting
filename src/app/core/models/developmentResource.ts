export class DevelopmentResourceDTO {
  id?: number;
  titulo?: string;
  descripcion?: string;
  tipo_recurso?: string;
  ruta?: string;
  version?: string;
  id_modulo?: number | null;
  visible?: boolean;
  id_estado?: number;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date;
}
