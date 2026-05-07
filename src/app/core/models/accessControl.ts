export interface AccessSummaryDTO {
  subscribers: number;
  users: number;
  roles: number;
  modules: number;
}

export interface PlanDTO {
  id?: number;
  tipo?: string;
  duracion?: number;
  precio?: number;
  descripcion?: string;
  unidad?: string;
}

export interface SubscriberDTO {
  id?: number;
  responsable?: string;
  contacto_n?: string;
  correo?: string;
  codigo?: string;
  id_plan?: number;
  fecha_finalizacion?: string;
  id_estado?: number;
  nit?: string;
  imagen?: string;
}

export interface AccessUserDTO {
  id?: number;
  usuario?: string;
  password?: string;
  nombre?: string;
  colaborador?: string;
  cargo?: string;
  cedula?: number;
  id_rol?: number;
  rol?: string;
  id_suscrito?: number;
  suscrito?: string;
  id_pais?: number;
  id_estado?: number;
}

export interface RoleDTO {
  id?: number;
  rol?: string;
  descripcion?: string;
  id_estado?: number;
}

export interface AccessModuleDTO {
  id?: number;
  modulo?: string;
  descripcion?: string;
  ruta?: string;
  icono?: string;
  position_module?: number;
}

export interface RoleModuleDTO {
  id_rol?: number;
  id_modulo?: number;
  id_estado?: number;
}

export interface AuditEventDTO {
  id?: number;
  id_usuario?: number;
  id_suscrito?: number;
  id_modulo?: number;
  entidad?: string;
  id_entidad?: string;
  accion?: string;
  descripcion?: string;
  valor_anterior?: any;
  valor_nuevo?: any;
  ip?: string;
  user_agent?: string;
  id_estado?: number;
  fecha_creacion?: string;
}

export interface AccessCatalogsDTO {
  plans: PlanDTO[];
  roles: RoleDTO[];
  modules: AccessModuleDTO[];
  subscribers: SubscriberDTO[];
  roleModules: RoleModuleDTO[];
}
