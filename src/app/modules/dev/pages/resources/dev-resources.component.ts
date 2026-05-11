import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { DevelopmentResourceDTO } from 'src/app/core/models/developmentResource';
import { PeripheralConfigDTO } from 'src/app/core/models/peripheral';
import { PeripheralConfigService } from 'src/app/core/services/peripherals/peripheral-config.service';
import { PeripheralMode, PeripheralService, PeripheralStatus } from 'src/app/core/services/peripherals/peripheral.service';
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
  activeView: 'resources' | 'typography' | 'peripherals' = 'resources';
  peripheralStatus?: PeripheralStatus;
  peripheralMode: PeripheralMode = 'local-agent';
  peripheralConfig?: PeripheralConfigDTO | null;

  typographyConfig = {
    fontFamily: 'Outfit',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: 0
  };

  fontFamilies = ['Outfit', 'Poppins', 'Roboto', 'MuseoModerno', 'Viga', 'Chathura'];
  fontWeights = [300, 400, 500, 600, 700, 800];
  previewModes = [
    { id: 'headings', label: 'Encabezados', icon: 'fa-solid fa-heading' },
    { id: 'form', label: 'Formulario', icon: 'fa-solid fa-pen-to-square' },
    { id: 'table', label: 'Tabla', icon: 'fa-solid fa-table' },
    { id: 'cards', label: 'Cards', icon: 'fa-solid fa-id-card' },
    { id: 'copy', label: 'Texto largo', icon: 'fa-solid fa-align-left' }
  ];
  activePreviewMode = 'headings';

  resourceTypes = [
    { id: 'todos', label: 'Todos', icon: 'fa-solid fa-layer-group' },
    { id: 'api', label: 'APIs', icon: 'fa-solid fa-plug' },
    { id: 'documento', label: 'Documentos', icon: 'fa-solid fa-file-lines' },
    { id: 'version', label: 'Versiones', icon: 'fa-solid fa-code-branch' },
    { id: 'enlace', label: 'Enlaces', icon: 'fa-solid fa-link' },
    { id: 'nota', label: 'Notas', icon: 'fa-solid fa-note-sticky' }
  ];

  viewTabs = [
    { id: 'resources', label: 'Recursos', icon: 'fa-solid fa-folder-tree' },
    { id: 'typography', label: 'Tipografia', icon: 'fa-solid fa-font' },
    { id: 'peripherals', label: 'Perifericos', icon: 'fa-solid fa-print' }
  ];

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
    private dataShared: DataSharedServicesService,
    private resourceService: DevelopmentResourceService,
    private peripheralConfigService: PeripheralConfigService,
    private peripheralService: PeripheralService,
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
    this.loadPeripheralConfig();
    this.loadPeripheralStatus();
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
    this.activeView = 'resources';
    this.activeType = type;
    this.applyFilter();
    if (type !== 'todos') {
      this.form.tipo_recurso = type;
    }
  }

  setView(view: 'resources' | 'typography' | 'peripherals'): void {
    this.activeView = view;
    if (view === 'peripherals') {
      this.loadPeripheralStatus();
    }
  }

  loadPeripheralStatus(): void {
    this.peripheralMode = this.peripheralService.getMode();
    this.peripheralService.getStatus().subscribe(status => {
      this.peripheralStatus = status;
    });
  }

  loadPeripheralConfig(): void {
    this.peripheralConfigService.get().subscribe({
      next: data => {
        this.peripheralConfig = data.result;
        if (data.result?.agent_url) {
          this.peripheralService.setLocalAgentUrl(data.result.agent_url);
        }
        if (data.result?.modo && this.peripheralService.getMode() !== 'simulation') {
          this.peripheralService.setMode(data.result.modo);
        }
        this.loadPeripheralStatus();
      },
      error: () => {
        this.peripheralConfig = null;
      }
    });
  }

  setPeripheralMode(mode: PeripheralMode): void {
    this.peripheralService.setMode(mode);
    this.loadPeripheralStatus();

    if (mode !== 'simulation') {
      this.savePeripheralConfig(mode);
    }

    this.toastService.showToast({
      title: 'Modo de perifericos',
      message: mode === 'simulation'
        ? 'Simulador de desarrollo activo para datáfono e impresion.'
        : 'La app intentara usar el agente local real.',
      type: 'success',
      timeout: 3000
    });
  }

  savePeripheralConfig(mode: PeripheralMode = this.peripheralMode): void {
    const payload: PeripheralConfigDTO = {
      modo: mode,
      agent_url: this.peripheralService.getLocalAgentUrl(),
      printer_name: this.peripheralConfig?.printer_name || 'POS-58',
      printer_type: this.peripheralConfig?.printer_type || 'thermal',
      payment_terminal_enabled: true,
      payment_provider: this.peripheralConfig?.payment_provider || 'pending-provider',
      auto_print_after_payment: this.peripheralConfig?.auto_print_after_payment || false,
      print_copies: this.peripheralConfig?.print_copies || 1
    };

    this.peripheralConfigService.save(payload).subscribe({
      next: data => this.peripheralConfig = data.result,
      error: error => this.showError(error, 'Error al guardar configuracion de perifericos')
    });
  }

  setPreviewMode(mode: string): void {
    this.activePreviewMode = mode;
  }

  get typographyPreviewStyle(): Record<string, string> {
    return {
      'font-family': `"${this.typographyConfig.fontFamily}", sans-serif`,
      'font-size.px': String(this.typographyConfig.fontSize),
      'font-weight': String(this.typographyConfig.fontWeight),
      'line-height': String(this.typographyConfig.lineHeight),
      'letter-spacing.px': String(this.typographyConfig.letterSpacing)
    };
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
