import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavDTO } from './core/models/nav';
import { InactivityService } from './shared/directives/inactivity.service';
import { Observable } from 'rxjs';
import { ThemeService, VisualEffectName } from './core/services/theme/theme.service';

export interface BrandingBrief {
  product: string;
  audience: string;
  objective: string;
  notes: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //#region properties

  /*Nav options*/
  listNav : NavDTO[] = [];

  visualEffect$!: Observable<VisualEffectName>;
  snowParticles = Array.from({ length: 70 }, (_, index) => ({
    x: `${(index * 37) % 100}vw`,
    delay: `${-(index * 0.33)}s`,
    duration: `${10 + (index % 9) * 1.1}s`,
    size: `${3 + (index % 5)}px`,
    drift: `${-28 + (index % 9) * 7}px`,
    opacity: `${0.45 + (index % 5) * 0.1}`
  }));
  shadowParticles = Array.from({ length: 10 }, (_, index) => ({
    top: `${10 + (index % 5) * 13}vh`,
    delay: `${-(index * 1.2)}s`,
    duration: `${13 + (index % 4) * 2}s`,
    scale: `${0.72 + (index % 4) * 0.12}`,
    opacity: `${0.24 + (index % 4) * 0.08}`
  }));

  /*Estado menu*/
  statusDisabledMain : boolean = false;
  statusDisabledBtnMain : boolean = false;
  navDisabled : boolean = false;

  /*Propiedad para titulo del breadcrumbs*/
  globalTitle : string = "module"

  /*searchterm*/
  searchTerm = '';
  private readonly brandingCaptureKey = 'dev.brandingCapture.enabled';
  private readonly brandingBriefKey = 'dev.brandingCapture.brief';
  brandingToastVisible = false;
  brandingCaptureBusy = false;
  brandingBrief: BrandingBrief = {
    product: 'Accounts POS',
    audience: 'Comercios, restaurantes y equipos de caja',
    objective: 'Capturar pantallas para brief visual, branding y revision de UI.',
    notes: ''
  };

  //#endregion
  
  //#region Constructor
  constructor(
    private cdRef: ChangeDetectorRef,
    private themeService: ThemeService,
    //private inactivityService: InactivityService
  ) {}

  ngOnInit(): void {
    this.themeService.loadTheme();
    this.themeService.loadEffect();
    this.visualEffect$ = this.themeService.effect$;
    this.loadBrandingCaptureState();
  }
  //#endregion

  //#region methods
  OnExpandBar(){
    let element :any = document.getElementById('icon_btn_open');
    if(element != undefined){
      this.statusDisabledMain = !this.statusDisabledMain;
      element.className = this.statusDisabledMain ? "fa-solid fa-bars-staggered" : "fa-solid fa-bars";
    }
  }
  OnHiddenBar(){
    let element :any = document.getElementById('icon_btn_open');
    if(element != undefined){
      element.className = "fa-solid fa-bars";
    }
    this.statusDisabledMain = false;
  }

  OnHiddenBarAsync(){
    this.statusDisabledMain = true;
    this.cdRef.detectChanges();
  }

  setBrandingCapture(enabled: boolean, brief?: Partial<BrandingBrief>): void {
    if (brief) {
      this.brandingBrief = { ...this.brandingBrief, ...brief };
    }
    this.brandingToastVisible = enabled;
    localStorage.setItem(this.brandingCaptureKey, enabled ? 'true' : 'false');
    localStorage.setItem(this.brandingBriefKey, JSON.stringify(this.brandingBrief));
  }

  closeBrandingToast(): void {
    if (this.brandingCaptureBusy) return;
    this.setBrandingCapture(false);
  }

  copyBrandingBrief(): void {
    const text = [
      `Producto: ${this.brandingBrief.product}`,
      `Audiencia: ${this.brandingBrief.audience}`,
      `Objetivo: ${this.brandingBrief.objective}`,
      `Notas: ${this.brandingBrief.notes || 'Sin notas adicionales'}`,
      'Uso: referencias visuales para branding, UI y brief de diseno.'
    ].join('\n');

    navigator.clipboard?.writeText(text);
  }

  persistBrandingBrief(): void {
    localStorage.setItem(this.brandingBriefKey, JSON.stringify(this.brandingBrief));
  }

  async captureProductScreenshot(): Promise<void> {
    const mediaDevices = navigator.mediaDevices as any;
    if (!mediaDevices?.getDisplayMedia) return;

    this.brandingCaptureBusy = true;
    try {
      const stream = await mediaDevices.getDisplayMedia({ video: true, audio: false });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `accounts-brief-${new Date().toISOString().slice(0, 10)}.png`;
      link.click();
    } finally {
      this.brandingCaptureBusy = false;
      this.persistBrandingBrief();
    }
  }

  private loadBrandingCaptureState(): void {
    const stored = localStorage.getItem(this.brandingBriefKey);
    if (stored) {
      try {
        this.brandingBrief = { ...this.brandingBrief, ...JSON.parse(stored) };
      } catch {
        localStorage.removeItem(this.brandingBriefKey);
      }
    }
    this.brandingToastVisible = localStorage.getItem(this.brandingCaptureKey) === 'true';
  }
  //#endregion  
}
