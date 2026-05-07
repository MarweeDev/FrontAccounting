import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { DevelopmentResourceDTO } from 'src/app/core/models/developmentResource';
import { DevelopmentResourceService } from 'src/app/core/services/development-resource/development-resource.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

@Component({
  selector: 'app-dev-resources',
  templateUrl: './dev-resources.component.html',
  styleUrls: ['./dev-resources.component.css']
})
export class DevResourcesComponent implements OnInit {
  ListResource: DevelopmentResourceDTO[] = [];
  FilterListResource: DevelopmentResourceDTO[] = [];
  form: DevelopmentResourceDTO = this.getEmptyForm();
  editingId: number | null = null;
  isSaving = false;
  activeType = 'todos';

  resourceTypes = [
    { id: 'todos', label: 'Todos', icon: 'fa-solid fa-layer-group' },
    { id: 'api', label: 'APIs', icon: 'fa-solid fa-plug' },
    { id: 'documento', label: 'Documentos', icon: 'fa-solid fa-file-lines' },
    { id: 'version', label: 'Versiones', icon: 'fa-solid fa-code-branch' },
    { id: 'enlace', label: 'Enlaces', icon: 'fa-solid fa-link' },
    { id: 'nota', label: 'Notas', icon: 'fa-solid fa-note-sticky' }
  ];

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
    private dataShared: DataSharedServicesService,
    private resourceService: DevelopmentResourceService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.app.listNav = [
      { nombre: 'Refrescar', url: 'dev/resources', icon: 'fa-solid fa-rotate-right', type: 'btn-success' }
    ];
    this.dataShared.OnSetNav(this.app.listNav);

    this.route.data.subscribe(data => {
      this.dataShared.OnSetBreadcrumb(data['breadcrumb']);
    });

    this.onLoad();
  }

  onLoad(): void {
    this.resourceService.get().subscribe({
      next: data => {
        this.ListResource = data.result || [];
        this.applyFilter();
      },
      error: error => this.showError(error, 'Error al cargar recursos')
    });
  }

  setType(type: string): void {
    this.activeType = type;
    this.applyFilter();
    if (type !== 'todos') {
      this.form.tipo_recurso = type;
    }
  }

  applyFilter(): void {
    this.FilterListResource = this.activeType === 'todos'
      ? this.ListResource
      : this.ListResource.filter(item => item.tipo_recurso === this.activeType);
  }

  countByType(type: string): number {
    if (type === 'todos') return this.ListResource.length;
    return this.ListResource.filter(item => item.tipo_recurso === type).length;
  }

  save(): void {
    if (!this.form.titulo || !this.form.tipo_recurso || this.isSaving) return;

    this.isSaving = true;
    const request = this.editingId
      ? this.resourceService.put(this.editingId, this.form)
      : this.resourceService.post(this.form);

    request.subscribe({
      next: () => {
        this.toastService.showToast({
          title: this.editingId ? 'Recurso actualizado' : 'Recurso creado',
          message: 'El recurso tecnico fue guardado correctamente.',
          type: 'success',
          timeout: 3000
        });
        this.cancelEdit();
        this.onLoad();
        this.isSaving = false;
      },
      error: error => {
        this.showError(error, 'Error al guardar recurso');
        this.isSaving = false;
      }
    });
  }

  edit(item: DevelopmentResourceDTO): void {
    this.editingId = item.id || null;
    this.form = { ...item };
  }

  disable(item: DevelopmentResourceDTO): void {
    if (!item.id || this.isSaving) return;

    this.isSaving = true;
    this.resourceService.delete(item.id).subscribe({
      next: () => {
        this.toastService.showToast({
          title: 'Recurso deshabilitado',
          message: 'El registro permanece en base de datos con estado inactivo.',
          type: 'success',
          timeout: 3000
        });
        this.onLoad();
        this.isSaving = false;
      },
      error: error => {
        this.showError(error, 'Error al deshabilitar recurso');
        this.isSaving = false;
      }
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = this.getEmptyForm();
  }

  private getEmptyForm(): DevelopmentResourceDTO {
    return {
      titulo: '',
      descripcion: '',
      tipo_recurso: this.activeType === 'todos' ? 'api' : this.activeType,
      ruta: '',
      version: '',
      id_modulo: 6,
      visible: true
    };
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
