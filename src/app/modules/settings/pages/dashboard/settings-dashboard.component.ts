import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { PaymentMethodConfigDTO } from 'src/app/core/models/paymentMethod';
import { BusinessProfileDTO, BusinessProfileType } from 'src/app/core/models/businessProfile';
import { TaxDTO, TaxModuleScope } from 'src/app/core/models/tax';
import { PaymentMethodService } from 'src/app/core/services/payment-method/payment-method.service';
import { PeripheralService } from 'src/app/core/services/peripherals/peripheral.service';
import { SettingParameterDTO } from 'src/app/core/models/settingParameter';
import { SettingParameterService } from 'src/app/core/services/setting-parameter/setting-parameter.service';
import { TaxService } from 'src/app/core/services/tax/tax.service';
import { ThemeName, ThemeOption, ThemeService, VisualEffectName, VisualEffectOption } from 'src/app/core/services/theme/theme.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

interface SettingDefinition {
  group: string;
  key: string;
  label: string;
  description: string;
  type: 'texto' | 'numero' | 'booleano';
  icon: string;
  placeholder?: string;
}

interface SettingSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  settings: SettingDefinition[];
}

@Component({
  selector: 'app-settings-dashboard',
  templateUrl: './settings-dashboard.component.html',
  styleUrls: ['./settings-dashboard.component.css']
})
export class SettingsDashboardComponent implements OnInit {
  ListParameter: SettingParameterDTO[] = [];
  activeSection = 'empresa';
  values: Record<string, string> = {};
  savingKey: string | null = null;
  themes: ThemeOption[] = [];
  selectedTheme: ThemeName = 'marwee';
  visualEffects: VisualEffectOption[] = [];
  selectedEffect: VisualEffectName = 'none';
  paymentMethods: PaymentMethodConfigDTO[] = [];
  paymentMethodForm: PaymentMethodConfigDTO = this.getEmptyPaymentMethod();
  taxes: TaxDTO[] = [];
  taxForm: TaxDTO = this.getEmptyTax();
  businessProfiles: BusinessProfileDTO[] = this.getBusinessProfiles();
  selectedBusinessProfile: BusinessProfileType = 'pymes';
  shiftEnabledProfiles: BusinessProfileType[] = ['pymes', 'gastronomia'];

  sections: SettingSection[] = [
    {
      id: 'apariencia',
      title: 'Apariencia',
      icon: 'fa-solid fa-palette',
      description: 'Control visual local de Accounts para adaptar el producto a la identidad preferida.',
      settings: []
    },
    {
      id: 'empresa',
      title: 'Empresa',
      icon: 'fa-solid fa-store',
      description: 'Identidad y datos principales del negocio.',
      settings: [
        { group: 'empresa', key: 'nombre_comercial', label: 'Nombre comercial', description: 'Nombre visible en pantallas, reportes y documentos.', type: 'texto', icon: 'fa-solid fa-signature', placeholder: 'Ej: Gratin Burger' },
        { group: 'empresa', key: 'nit', label: 'Identificacion tributaria', description: 'NIT o documento fiscal del negocio.', type: 'texto', icon: 'fa-solid fa-id-card', placeholder: 'Ej: 900000000-1' },
        { group: 'empresa', key: 'telefono', label: 'Telefono de contacto', description: 'Numero principal para atencion o soporte.', type: 'texto', icon: 'fa-solid fa-phone', placeholder: 'Ej: 300 000 0000' }
      ]
    },
    {
      id: 'inventario',
      title: 'Inventario',
      icon: 'fa-solid fa-boxes-stacked',
      description: 'Reglas operativas para controlar existencias.',
      settings: [
        { group: 'inventario', key: 'stock_minimo', label: 'Stock minimo', description: 'Cantidad desde la que un producto se marca como bajo.', type: 'numero', icon: 'fa-solid fa-arrow-trend-down', placeholder: '5' },
        { group: 'inventario', key: 'permitir_stock_negativo', label: 'Permitir stock negativo', description: 'Define si ventas o ajustes pueden dejar existencias por debajo de cero.', type: 'booleano', icon: 'fa-solid fa-circle-minus' }
      ]
    },
    {
      id: 'impuestos',
      title: 'Impuestos',
      icon: 'fa-solid fa-percent',
      description: 'Catalogo fiscal reutilizable por ventas, compras y documentos internos.',
      settings: []
    },
    {
      id: 'medios_pago',
      title: 'Medios de pago',
      icon: 'fa-solid fa-wallet',
      description: 'Catalogo configurable para caja: tarjetas, Bre-B, QR, transferencias y billeteras.',
      settings: []
    },
    {
      id: 'ventas',
      title: 'Ventas',
      icon: 'fa-solid fa-cash-register',
      description: 'Comportamiento de ordenes, impuestos y pagos.',
      settings: [
        { group: 'ventas', key: 'moneda', label: 'Moneda', description: 'Simbolo usado para mostrar valores en ventas y reportes.', type: 'texto', icon: 'fa-solid fa-coins', placeholder: 'COP' },
        { group: 'ventas', key: 'porcentaje_impuesto', label: 'Porcentaje de impuesto', description: 'Valor porcentual aplicado como referencia fiscal.', type: 'numero', icon: 'fa-solid fa-percent', placeholder: '19' },
        { group: 'ventas', key: 'observacion_obligatoria', label: 'Observacion obligatoria', description: 'Solicita observacion antes de cerrar una orden.', type: 'booleano', icon: 'fa-solid fa-message' }
      ]
    },
    {
      id: 'caja',
      title: 'Caja',
      icon: 'fa-solid fa-wallet',
      description: 'Preferencias de cierre y control diario.',
      settings: [
        { group: 'caja', key: 'requiere_cierre_diario', label: 'Requiere cierre diario', description: 'Activa control de cierre al terminar la jornada.', type: 'booleano', icon: 'fa-solid fa-calendar-check' },
        { group: 'caja', key: 'monto_base', label: 'Monto base', description: 'Valor inicial esperado en caja.', type: 'numero', icon: 'fa-solid fa-money-bill-1', placeholder: '0' }
      ]
    },
    {
      id: 'perifericos',
      title: 'Perifericos',
      icon: 'fa-solid fa-print',
      description: 'Conexion con impresoras, agente local y preparacion para datáfono.',
      settings: [
        { group: 'perifericos', key: 'habilitar_perifericos', label: 'Activar perifericos', description: 'Muestra y habilita impresora, datáfono, agente local y bitácoras de periféricos.', type: 'booleano', icon: 'fa-solid fa-toggle-on' },
        { group: 'perifericos', key: 'modo_impresion', label: 'Modo de impresion', description: 'Define local-agent, web o simulation segun el punto de venta.', type: 'texto', icon: 'fa-solid fa-plug', placeholder: 'local-agent' },
        { group: 'perifericos', key: 'url_agente_local', label: 'URL agente local', description: 'Servicio puente para impresoras y futuros datáfonos.', type: 'texto', icon: 'fa-solid fa-network-wired', placeholder: 'http://localhost:8765' },
        { group: 'perifericos', key: 'impresora_predeterminada', label: 'Impresora predeterminada', description: 'Nombre sugerido para el agente local al imprimir comprobantes internos.', type: 'texto', icon: 'fa-solid fa-print', placeholder: 'POS-58' },
        { group: 'perifericos', key: 'habilitar_datafono', label: 'Preparar datáfono', description: 'Deja visible la capacidad, sin ejecutar pagos automaticos todavia.', type: 'booleano', icon: 'fa-solid fa-credit-card' }
      ]
    },
    {
      id: 'ia',
      title: 'IA',
      icon: 'fa-solid fa-wand-magic-sparkles',
      description: 'Vista previa sin consumo API: ideas y reglas locales para el asistente operativo.',
      settings: [
        { group: 'ia', key: 'habilitar_demo_local', label: 'Demo local', description: 'Muestra recomendaciones generadas por reglas internas, sin OpenAI.', type: 'booleano', icon: 'fa-solid fa-toggle-on' },
        { group: 'ia', key: 'estado_integracion', label: 'Estado integracion', description: 'Marca el modulo como no conectado, demo local o listo para backend futuro.', type: 'texto', icon: 'fa-solid fa-circle-nodes', placeholder: 'demo-local' },
        { group: 'ia', key: 'modelo_futuro', label: 'Modelo futuro', description: 'Referencia visual para una conexion posterior; no se consume en esta fase.', type: 'texto', icon: 'fa-solid fa-microchip', placeholder: 'gpt-5.4-mini' }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private app: AppComponent,
    private dataShared: DataSharedServicesService,
    private paymentMethodService: PaymentMethodService,
    private peripheralService: PeripheralService,
    private parameterService: SettingParameterService,
    private taxService: TaxService,
    private themeService: ThemeService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.themes = this.themeService.getThemes();
    this.selectedTheme = this.themeService.getCurrentTheme();
    this.visualEffects = this.themeService.getVisualEffects();
    this.selectedEffect = this.themeService.getCurrentEffect();

    this.app.listNav = [
      { nombre: 'Refrescar', url: 'settings/dashboard', icon: 'fa-solid fa-rotate-right', type: 'btn-success' }
    ];
    this.dataShared.OnSetNav(this.app.listNav);

    this.route.data.subscribe(data => {
      this.dataShared.OnSetBreadcrumb(data['breadcrumb']);
    });

    this.onLoad();
    this.loadPaymentMethods();
    this.loadTaxes();
  }

  get currentSection(): SettingSection {
    return this.sections.find(section => section.id === this.activeSection) || this.sections[0];
  }

  get configuredCount(): number {
    return this.sections
      .flatMap(section => section.settings)
      .filter(setting => this.getValue(setting)).length;
  }

  onLoad(): void {
    this.parameterService.get().subscribe({
      next: data => {
        this.ListParameter = data.result || [];
        this.hydrateValues();
        this.syncPeripheralFeatureFlag();
      },
      error: error => this.showError(error, 'Error al cargar ajustes')
    });
  }

  setSection(sectionId: string): void {
    this.activeSection = sectionId;
    if (sectionId === 'medios_pago') {
      this.loadPaymentMethods();
    }
    if (sectionId === 'impuestos') {
      this.loadTaxes();
    }
  }

  loadTaxes(): void {
    this.taxService.get().subscribe({
      next: data => this.taxes = data.result || [],
      error: error => this.showError(error, 'Error al cargar impuestos')
    });
  }

  editTax(tax: TaxDTO): void {
    this.taxForm = { ...tax };
  }

  newTax(): void {
    this.taxForm = this.getEmptyTax();
  }

  saveTax(): void {
    if (!this.taxForm.name || this.taxForm.percentage === undefined) {
      this.toastService.showToast({
        title: 'Datos incompletos',
        message: 'Nombre y porcentaje son obligatorios.',
        type: 'warning',
        timeout: 3000
      });
      return;
    }

    const request = this.taxForm.id
      ? this.taxService.put(this.taxForm.id, this.taxForm)
      : this.taxService.post(this.taxForm);

    request.subscribe({
      next: () => {
        this.toastService.showToast({
          title: 'Impuesto guardado',
          message: 'El catalogo fiscal fue actualizado correctamente.',
          type: 'success',
          timeout: 3000
        });
        this.newTax();
        this.loadTaxes();
      },
      error: error => this.showError(error, 'Error al guardar impuesto')
    });
  }

  disableTax(tax: TaxDTO): void {
    if (!tax.id) return;
    this.taxService.delete(tax.id).subscribe({
      next: () => {
        this.toastService.showToast({
          title: 'Impuesto deshabilitado',
          message: 'El impuesto ya no aparecera para nuevos documentos.',
          type: 'success',
          timeout: 3000
        });
        this.loadTaxes();
      },
      error: error => this.showError(error, 'Error al deshabilitar impuesto')
    });
  }

  loadPaymentMethods(): void {
    this.paymentMethodService.getMethods().subscribe({
      next: data => this.paymentMethods = data.result || [],
      error: error => this.showError(error, 'Error al cargar medios de pago')
    });
  }

  editPaymentMethod(method: PaymentMethodConfigDTO): void {
    this.paymentMethodForm = { ...method };
  }

  newPaymentMethod(): void {
    this.paymentMethodForm = this.getEmptyPaymentMethod();
  }

  savePaymentMethod(): void {
    if (!this.paymentMethodForm.name || !this.paymentMethodForm.method_type) {
      this.toastService.showToast({
        title: 'Datos incompletos',
        message: 'Nombre y tipo son obligatorios.',
        type: 'warning',
        timeout: 3000
      });
      return;
    }

    this.paymentMethodService.saveMethod(this.paymentMethodForm).subscribe({
      next: () => {
        this.toastService.showToast({
          title: 'Medio guardado',
          message: 'El medio de pago fue actualizado correctamente.',
          type: 'success',
          timeout: 3000
        });
        this.newPaymentMethod();
        this.loadPaymentMethods();
      },
      error: error => this.showError(error, 'Error al guardar medio de pago')
    });
  }

  togglePaymentMethod(method: PaymentMethodConfigDTO): void {
    this.paymentMethodService.saveMethod({ ...method, enabled: !method.enabled }).subscribe({
      next: () => this.loadPaymentMethods(),
      error: error => this.showError(error, 'Error al cambiar estado del medio')
    });
  }

  setTheme(theme: ThemeName): void {
    this.selectedTheme = this.themeService.setTheme(theme);
    const selected = this.themes.find(item => item.id === this.selectedTheme);
    this.toastService.showToast({
      title: 'Tema aplicado',
      message: (selected?.label || 'Tema') + ' esta activo en este navegador.',
      type: 'success',
      timeout: 2500
    });
  }

  setBusinessProfile(profile: BusinessProfileDTO): void {
    this.selectedBusinessProfile = profile.type;
    const setting: SettingDefinition = {
      group: 'empresa',
      key: 'perfil_negocio',
      label: 'Perfil de negocio',
      description: 'Tipo de empresa usado para adaptar experiencia visual y lenguaje.',
      type: 'texto',
      icon: profile.icon
    };
    this.values[this.getSettingId(setting)] = profile.type;
    this.save(setting);
  }

  setVisualEffect(effect: VisualEffectName): void {
    this.selectedEffect = this.themeService.setVisualEffect(effect);
    const selected = this.visualEffects.find(item => item.id === this.selectedEffect);
    this.toastService.showToast({
      title: 'Efecto aplicado',
      message: (selected?.label || 'Efecto') + ' queda activo en este navegador.',
      type: 'success',
      timeout: 2500
    });
  }

  getValue(setting: SettingDefinition): string {
    return this.values[this.getSettingId(setting)] || '';
  }

  setValue(setting: SettingDefinition, event: Event): void {
    const input = event.target as HTMLInputElement | HTMLSelectElement;
    this.values[this.getSettingId(setting)] = input.value;
  }

  save(setting: SettingDefinition): void {
    const settingId = this.getSettingId(setting);
    const existing = this.findParameter(setting);
    const payload: SettingParameterDTO = {
      grupo: setting.group,
      clave: setting.key,
      valor: this.values[settingId] || '',
      tipo_dato: setting.type,
      descripcion: setting.description
    };

    this.savingKey = settingId;
    const request = existing?.id
      ? this.parameterService.put(existing.id, payload)
      : this.parameterService.post(payload);

    request.subscribe({
      next: () => {
        this.toastService.showToast({
          title: 'Ajuste guardado',
          message: setting.label + ' fue actualizado correctamente.',
          type: 'success',
          timeout: 3000
        });
        this.onLoad();
        this.syncLocalFeatureFlags(setting, payload.valor || '');
        this.savingKey = null;
      },
      error: error => {
        this.showError(error, 'Error al guardar ajuste');
        this.savingKey = null;
      }
    });
  }

  disable(setting: SettingDefinition): void {
    const existing = this.findParameter(setting);
    if (!existing?.id) return;

    const settingId = this.getSettingId(setting);
    this.savingKey = settingId;
    this.parameterService.delete(existing.id).subscribe({
      next: () => {
        this.values[settingId] = '';
        this.syncLocalFeatureFlags(setting, '');
        this.toastService.showToast({
          title: 'Ajuste deshabilitado',
          message: 'El valor queda inactivo y no se elimina de la base de datos.',
          type: 'success',
          timeout: 3000
        });
        this.onLoad();
        this.savingKey = null;
      },
      error: error => {
        this.showError(error, 'Error al deshabilitar ajuste');
        this.savingKey = null;
      }
    });
  }

  hasParameter(setting: SettingDefinition): boolean {
    return !!this.findParameter(setting);
  }

  isSaving(setting: SettingDefinition): boolean {
    return this.savingKey === this.getSettingId(setting);
  }

  private hydrateValues(): void {
    this.sections.flatMap(section => section.settings).forEach(setting => {
      const parameter = this.findParameter(setting);
      this.values[this.getSettingId(setting)] = parameter?.valor || '';
    });
    const profileParameter = this.ListParameter.find(item => item.grupo === 'empresa' && item.clave === 'perfil_negocio');
    const profile = this.normalizeBusinessProfile(profileParameter?.valor || '');
    if (profile) {
      this.selectedBusinessProfile = profile;
      this.values['empresa.perfil_negocio'] = profile;
    }
    this.hydrateShiftEnabledProfiles();
  }

  private syncPeripheralFeatureFlag(): void {
    this.peripheralService.setEnabled(this.values['perifericos.habilitar_perifericos'] === 'true');
  }

  private syncLocalFeatureFlags(setting: SettingDefinition, value: string): void {
    if (setting.group === 'perifericos' && setting.key === 'habilitar_perifericos') {
      this.peripheralService.setEnabled(value === 'true');
    }
  }

  private findParameter(setting: SettingDefinition): SettingParameterDTO | undefined {
    return this.ListParameter.find(item => item.grupo === setting.group && item.clave === setting.key);
  }

  private getSettingId(setting: SettingDefinition): string {
    return `${setting.group}.${setting.key}`;
  }

  private showError(error: any, fallback: string): void {
    this.toastService.showToast({
      title: 'Error ' + (error.status || ''),
      message: error.error?.message || error.message || fallback,
      type: 'error',
      timeout: 3000
    });
  }

  private getEmptyPaymentMethod(): PaymentMethodConfigDTO {
    return {
      name: '',
      method_type: 'transfer',
      icon: 'fa-solid fa-building-columns',
      color: '#2c8e84',
      priority: 50,
      requires_reference: true,
      requires_confirmation: true,
      allows_qr: false,
      account_label: '',
      account_value: '',
      qr_value: '',
      instructions: '',
      id_tipopago_legacy: null,
      id_subtipopago_legacy: 1,
      auto_print_after_payment: false,
      enabled: true
    };
  }

  private getEmptyTax(): TaxDTO {
    return {
      name: '',
      percentage: 0,
      module_scope: 'both' as TaxModuleScope,
      visible_modules: ['sales', 'shopping'],
      id_estado: 1
    };
  }

  isShiftEnabledForProfile(profile: BusinessProfileDTO): boolean {
    return this.shiftEnabledProfiles.includes(profile.type);
  }

  toggleShiftForProfile(profile: BusinessProfileDTO, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.shiftEnabledProfiles = checked
      ? [...new Set([...this.shiftEnabledProfiles, profile.type])]
      : this.shiftEnabledProfiles.filter(item => item !== profile.type);
    this.saveShiftEnabledProfiles();
  }

  private hydrateShiftEnabledProfiles(): void {
    const parameter = this.ListParameter.find(item => item.grupo === 'empresa' && item.clave === 'perfiles_turno_habilitado');
    if (!parameter?.valor) return;

    try {
      const values = JSON.parse(parameter.valor);
      if (Array.isArray(values)) {
        this.shiftEnabledProfiles = values
          .map(value => this.normalizeBusinessProfile(value))
          .filter((value): value is BusinessProfileType => !!value);
      }
    } catch {
      this.shiftEnabledProfiles = ['pymes', 'gastronomia'];
    }
  }

  private saveShiftEnabledProfiles(): void {
    const existing = this.ListParameter.find(item => item.grupo === 'empresa' && item.clave === 'perfiles_turno_habilitado');
    const payload: SettingParameterDTO = {
      grupo: 'empresa',
      clave: 'perfiles_turno_habilitado',
      valor: JSON.stringify(this.shiftEnabledProfiles),
      tipo_dato: 'json',
      descripcion: 'Tipos de empresa donde se muestra control de caja, turno o jornada en el aside.'
    };
    const request = existing?.id
      ? this.parameterService.put(existing.id, payload)
      : this.parameterService.post(payload);

    request.subscribe({
      next: () => {
        this.toastService.showToast({
          title: 'Configuracion guardada',
          message: 'La visibilidad del control operativo fue actualizada.',
          type: 'success',
          timeout: 2500
        });
        this.onLoad();
      },
      error: error => this.showError(error, 'Error al guardar visibilidad por empresa')
    });
  }

  private normalizeBusinessProfile(value: string): BusinessProfileType | null {
    if (value === 'instituto') return 'instituciones';
    if (value === 'restaurante' || value === 'bar') return 'gastronomia';
    if (value === 'servicios' || value === 'productos' || value === 'pyme' || value === 'personalizado') return 'pymes';
    if (value === 'pymes' || value === 'gastronomia' || value === 'instituciones') return value;
    return null;
  }

  private getBusinessProfiles(): BusinessProfileDTO[] {
    return [
      { type: 'pymes', label: 'Pymes', description: 'Ventas, compras, caja, inventario y reportes para negocios comerciales o de servicios.', theme: 'marwee', icon: 'fa-solid fa-store', highlightedModules: ['ventas', 'compras', 'inventario'] },
      { type: 'gastronomia', label: 'Gastronomia', description: 'Pedidos, mesas, turnos, recargos, insumos y rotacion de productos.', theme: 'marwee', icon: 'fa-solid fa-utensils', highlightedModules: ['pedidos', 'mesas', 'turnos'] },
      { type: 'instituciones', label: 'Instituciones', description: 'Jornadas, pagos, estudiantes o usuarios, servicios y reportes administrativos.', theme: 'marwee', icon: 'fa-solid fa-graduation-cap', highlightedModules: ['jornadas', 'pagos', 'servicios'] }
    ];
  }
}
