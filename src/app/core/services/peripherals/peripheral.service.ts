import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, timeout } from 'rxjs';

export type PeripheralMode = 'disabled' | 'local-agent' | 'web' | 'simulation';
export type DeviceCapability = 'print' | 'payment-terminal' | 'serial' | 'usb' | 'bluetooth';

export interface PeripheralStatus {
  mode: PeripheralMode;
  available: boolean;
  label: string;
  detail: string;
  capabilities: DeviceCapability[];
}

export interface PrintJob {
  documentType: 'order-receipt' | 'shopping-support';
  title: string;
  reference: string;
  businessName?: string;
  customerName?: string;
  providerName?: string;
  createdAt?: string;
  paymentMethod?: string;
  lines: PrintJobLine[];
  totals: PrintJobTotal[];
  disclaimer: string;
}

export interface PrintJobLine {
  description: string;
  quantity: number;
  unitValue: number;
  total: number;
}

export interface PrintJobTotal {
  label: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class PeripheralService {
  private readonly agentUrlKey = 'peripherals.localAgentUrl';
  private readonly modeKey = 'peripherals.mode';
  private readonly enabledKey = 'peripherals.enabled';
  private readonly defaultAgentUrl = 'http://localhost:8765';

  private rawHttp: HttpClient;

  constructor(private httpBackend: HttpBackend) {
    this.rawHttp = new HttpClient(this.httpBackend);
  }

  getLocalAgentUrl(): string {
    return localStorage.getItem(this.agentUrlKey) || this.defaultAgentUrl;
  }

  setLocalAgentUrl(url: string): void {
    localStorage.setItem(this.agentUrlKey, url || this.defaultAgentUrl);
  }

  getMode(): PeripheralMode {
    const mode = localStorage.getItem(this.modeKey) as PeripheralMode | null;
    return mode || 'local-agent';
  }

  setMode(mode: PeripheralMode): void {
    localStorage.setItem(this.modeKey, mode);
  }

  isEnabled(): boolean {
    return localStorage.getItem(this.enabledKey) === 'true';
  }

  setEnabled(enabled: boolean): void {
    localStorage.setItem(this.enabledKey, enabled ? 'true' : 'false');
  }

  getStatus(): Observable<PeripheralStatus> {
    if (!this.isEnabled()) {
      return of({
        mode: 'disabled',
        available: false,
        label: 'Periféricos inactivos',
        detail: 'La integración con impresora, datáfono y agente local está desactivada en ajustes.',
        capabilities: []
      });
    }

    if (this.getMode() === 'simulation') {
      return of({
        mode: 'simulation',
        available: true,
        label: 'Simulador activo',
        detail: 'Periféricos simulados desde la plataforma, sin consola ni hardware.',
        capabilities: ['print', 'payment-terminal', 'usb', 'bluetooth']
      });
    }

    const agentUrl = this.getLocalAgentUrl();
    return this.rawHttp.get<any>(`${agentUrl}/health`).pipe(
      timeout(1200),
      map(response => ({
        mode: 'local-agent' as PeripheralMode,
        available: true,
        label: 'Agente local conectado',
        detail: `Listo para periféricos${response?.version ? ' v' + response.version : ''}.`,
        capabilities: this.normalizeCapabilities(response?.capabilities)
      })),
      catchError(() => of(this.getWebFallbackStatus()))
    );
  }

  print(job: PrintJob): Observable<{ mode: PeripheralMode; success: boolean; message: string }> {
    if (!this.isEnabled()) {
      return of({
        mode: 'disabled',
        success: false,
        message: 'Periféricos desactivados en ajustes.'
      });
    }

    if (this.getMode() === 'simulation') {
      return of({
        mode: 'simulation',
        success: true,
        message: `Comprobante ${job.reference || ''} recibido por impresora simulada.`
      });
    }

    const agentUrl = this.getLocalAgentUrl();
    return this.rawHttp.post<{ message?: string }>(`${agentUrl}/print`, job).pipe(
      timeout(2500),
      map(response => ({
        mode: 'local-agent' as PeripheralMode,
        success: true,
        message: response?.message || 'Trabajo enviado al agente local.'
      })),
      catchError(() => of({
        mode: 'web' as PeripheralMode,
        success: false,
        message: 'Agente local no disponible. Se usará impresión del navegador.'
      }))
    );
  }

  private getWebFallbackStatus(): PeripheralStatus {
    const capabilities: DeviceCapability[] = ['print'];
    if ('serial' in navigator) capabilities.push('serial');
    if ('usb' in navigator) capabilities.push('usb');
    if ('bluetooth' in navigator) capabilities.push('bluetooth');

    return {
      mode: capabilities.length > 1 ? 'web' : 'simulation',
      available: true,
      label: capabilities.length > 1 ? 'Modo navegador' : 'Modo simulación',
      detail: capabilities.length > 1
        ? 'El agente local no responde; se detectaron capacidades web limitadas.'
        : 'El agente local no responde; solo se puede previsualizar o imprimir desde el navegador.',
      capabilities
    };
  }

  private normalizeCapabilities(value: any): DeviceCapability[] {
    if (!Array.isArray(value)) return ['print'];
    const allowed: DeviceCapability[] = ['print', 'payment-terminal', 'serial', 'usb', 'bluetooth'];
    return value.filter(item => allowed.includes(item));
  }
}
