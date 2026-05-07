import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AccessCatalogsDTO, AccessModuleDTO, AccessSummaryDTO, AccessUserDTO, RoleDTO, SubscriberDTO } from 'src/app/core/models/accessControl';
import { AccessControlService } from 'src/app/core/services/access-control/access-control.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

type AccessTab = 'empresas' | 'usuarios' | 'roles' | 'permisos';

@Component({
  selector: 'app-access-dashboard',
  templateUrl: './access-dashboard.component.html',
  styleUrls: ['./access-dashboard.component.css']
})
export class AccessDashboardComponent implements OnInit {
  activeTab: AccessTab = 'empresas';
  summary: AccessSummaryDTO = { subscribers: 0, users: 0, roles: 0, modules: 0 };
  catalogs: AccessCatalogsDTO = { plans: [], roles: [], modules: [], subscribers: [], roleModules: [] };
  subscribers: SubscriberDTO[] = [];
  users: AccessUserDTO[] = [];

  subscriberForm: SubscriberDTO = this.emptySubscriber();
  userForm: AccessUserDTO = this.emptyUser();
  roleForm: RoleDTO = this.emptyRole();
  editingSubscriberId: number | null = null;
  editingUserId: number | null = null;
  editingRoleId: number | null = null;
  selectedRoleId: number | null = null;
  selectedModules: Record<number, boolean> = {};
  isSaving = false;

  tabs = [
    { id: 'empresas' as AccessTab, label: 'Empresas', icon: 'fa-solid fa-building-user' },
    { id: 'usuarios' as AccessTab, label: 'Usuarios', icon: 'fa-solid fa-users' },
    { id: 'roles' as AccessTab, label: 'Roles', icon: 'fa-solid fa-user-tag' },
    { id: 'permisos' as AccessTab, label: 'Permisos', icon: 'fa-solid fa-table-cells' }
  ];

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
    private dataShared: DataSharedServicesService,
    private accessService: AccessControlService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.app.listNav = [
      { nombre: 'Refrescar', url: 'access-control/dashboard', icon: 'fa-solid fa-rotate-right', type: 'btn-success' }
    ];
    this.dataShared.OnSetNav(this.app.listNav);

    this.route.data.subscribe(data => {
      this.dataShared.OnSetBreadcrumb(data['breadcrumb']);
    });

    this.loadAll();
  }

  loadAll(): void {
    this.loadSummary();
    this.loadCatalogs();
    this.loadSubscribers();
    this.loadUsers();
  }

  setTab(tab: AccessTab): void {
    this.activeTab = tab;
  }

  loadSummary(): void {
    this.accessService.summary().subscribe({
      next: data => this.summary = data.result,
      error: error => this.showError(error, 'Error al cargar resumen')
    });
  }

  loadCatalogs(): void {
    this.accessService.catalogs().subscribe({
      next: data => {
        this.catalogs = data.result;
        if (!this.selectedRoleId && this.catalogs.roles.length > 0) {
          this.selectRole(this.catalogs.roles[0]);
        }
      },
      error: error => this.showError(error, 'Error al cargar catalogos')
    });
  }

  loadSubscribers(): void {
    this.accessService.getSubscribers().subscribe({
      next: data => this.subscribers = data.result || [],
      error: error => this.showError(error, 'Error al cargar empresas')
    });
  }

  loadUsers(): void {
    this.accessService.getUsers().subscribe({
      next: data => this.users = data.result || [],
      error: error => this.showError(error, 'Error al cargar usuarios')
    });
  }

  saveSubscriber(): void {
    if (!this.subscriberForm.responsable || !this.subscriberForm.correo || !this.subscriberForm.id_plan || this.isSaving) return;

    this.isSaving = true;
    const request = this.editingSubscriberId
      ? this.accessService.putSubscriber(this.editingSubscriberId, this.subscriberForm)
      : this.accessService.postSubscriber(this.subscriberForm);

    request.subscribe({
      next: () => {
        this.notify('Empresa guardada', 'La suscripcion fue actualizada correctamente.');
        this.cancelSubscriber();
        this.loadAll();
        this.isSaving = false;
      },
      error: error => this.fail(error, 'Error al guardar empresa')
    });
  }

  editSubscriber(item: SubscriberDTO): void {
    this.editingSubscriberId = item.id || null;
    this.subscriberForm = { ...item };
  }

  disableSubscriber(item: SubscriberDTO): void {
    if (!item.id || this.isSaving) return;
    this.isSaving = true;
    this.accessService.deleteSubscriber(item.id).subscribe({
      next: () => {
        this.notify('Empresa deshabilitada', 'El registro queda inactivo sin eliminarse.');
        this.loadAll();
        this.isSaving = false;
      },
      error: error => this.fail(error, 'Error al deshabilitar empresa')
    });
  }

  saveUser(): void {
    if (!this.userForm.usuario || !this.userForm.nombre || !this.userForm.id_rol || !this.userForm.id_suscrito || this.isSaving) return;

    this.isSaving = true;
    const request = this.editingUserId
      ? this.accessService.putUser(this.editingUserId, this.userForm)
      : this.accessService.postUser(this.userForm);

    request.subscribe({
      next: () => {
        this.notify('Usuario guardado', 'El acceso fue actualizado correctamente.');
        this.cancelUser();
        this.loadAll();
        this.isSaving = false;
      },
      error: error => this.fail(error, 'Error al guardar usuario')
    });
  }

  editUser(item: AccessUserDTO): void {
    this.editingUserId = item.id || null;
    this.userForm = {
      ...item,
      nombre: item.colaborador
    };
  }

  disableUser(item: AccessUserDTO): void {
    if (!item.id || this.isSaving) return;
    this.isSaving = true;
    this.accessService.deleteUser(item.id).subscribe({
      next: () => {
        this.notify('Usuario deshabilitado', 'El usuario queda inactivo sin eliminarse.');
        this.loadAll();
        this.isSaving = false;
      },
      error: error => this.fail(error, 'Error al deshabilitar usuario')
    });
  }

  saveRole(): void {
    if (!this.roleForm.rol || this.isSaving) return;

    this.isSaving = true;
    const request = this.editingRoleId
      ? this.accessService.putRole(this.editingRoleId, this.roleForm)
      : this.accessService.postRole(this.roleForm);

    request.subscribe({
      next: () => {
        this.notify('Rol guardado', 'El rol fue actualizado correctamente.');
        this.cancelRole();
        this.loadAll();
        this.isSaving = false;
      },
      error: error => this.fail(error, 'Error al guardar rol')
    });
  }

  editRole(item: RoleDTO): void {
    this.editingRoleId = item.id || null;
    this.roleForm = { ...item };
  }

  disableRole(item: RoleDTO): void {
    if (!item.id || this.isSaving) return;
    this.isSaving = true;
    this.accessService.deleteRole(item.id).subscribe({
      next: () => {
        this.notify('Rol deshabilitado', 'El rol queda inactivo sin eliminarse.');
        this.loadAll();
        this.isSaving = false;
      },
      error: error => this.fail(error, 'Error al deshabilitar rol')
    });
  }

  selectRole(role: RoleDTO): void {
    this.selectedRoleId = role.id || null;
    this.selectedModules = {};
    this.catalogs.modules.forEach(module => {
      if (!module.id || !this.selectedRoleId) return;
      this.selectedModules[module.id] = this.hasModule(this.selectedRoleId, module.id);
    });
  }

  savePermissions(): void {
    if (!this.selectedRoleId || this.isSaving) return;

    const moduleIds = Object.keys(this.selectedModules)
      .filter(key => this.selectedModules[Number(key)])
      .map(Number);

    this.isSaving = true;
    this.accessService.updateRoleModules(this.selectedRoleId, moduleIds).subscribe({
      next: data => {
        this.catalogs.roleModules = data.result || [];
        this.notify('Permisos actualizados', 'Los modulos del rol fueron sincronizados.');
        this.isSaving = false;
      },
      error: error => this.fail(error, 'Error al guardar permisos')
    });
  }

  hasModule(roleId: number, moduleId: number): boolean {
    return this.catalogs.roleModules.some(item => item.id_rol === roleId && item.id_modulo === moduleId && item.id_estado === 1);
  }

  toggleModule(module: AccessModuleDTO, event: Event): void {
    if (!module.id) return;
    this.selectedModules[module.id] = (event.target as HTMLInputElement).checked;
  }

  cancelSubscriber(): void {
    this.editingSubscriberId = null;
    this.subscriberForm = this.emptySubscriber();
  }

  cancelUser(): void {
    this.editingUserId = null;
    this.userForm = this.emptyUser();
  }

  cancelRole(): void {
    this.editingRoleId = null;
    this.roleForm = this.emptyRole();
  }

  private emptySubscriber(): SubscriberDTO {
    return { responsable: '', contacto_n: '', correo: '', nit: '', id_plan: undefined, fecha_finalizacion: new Date().toISOString().slice(0, 10) };
  }

  private emptyUser(): AccessUserDTO {
    return { usuario: '', password: '', nombre: '', cargo: 'Usuario', id_rol: undefined, id_suscrito: undefined, id_estado: 1 };
  }

  private emptyRole(): RoleDTO {
    return { rol: '', descripcion: '' };
  }

  private notify(title: string, message: string): void {
    this.toastService.showToast({ title, message, type: 'success', timeout: 3000 });
  }

  private fail(error: any, fallback: string): void {
    this.showError(error, fallback);
    this.isSaving = false;
  }

  private showError(error: any, fallback: string): void {
    this.toastService.showToast({
      title: 'Error ' + (error.status || ''),
      message: error.error?.message || error.message || fallback,
      type: 'error',
      timeout: 3000
    });
  }
}
