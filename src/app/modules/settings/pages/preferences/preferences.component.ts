import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ThemeName, ThemeOption, ThemeService, VisualEffectName, VisualEffectOption } from 'src/app/core/services/theme/theme.service';
import { DataSharedServicesService } from 'src/app/shared/directives/data-shared-services.service';
import { ToastService } from 'src/app/shared/directives/toast.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  themes: ThemeOption[] = [];
  effects: VisualEffectOption[] = [];
  selectedTheme: ThemeName = 'marwee';
  selectedEffect: VisualEffectName = 'none';

  constructor(
    private route: ActivatedRoute,
    public app: AppComponent,
    private dataShared: DataSharedServicesService,
    private themeService: ThemeService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.themes = this.themeService.getThemes();
    this.effects = this.themeService.getVisualEffects();
    this.selectedTheme = this.themeService.getCurrentTheme();
    this.selectedEffect = this.themeService.getCurrentEffect();
    this.app.listNav = [];
    this.dataShared.OnSetNav(this.app.listNav);
    this.route.data.subscribe(data => this.dataShared.OnSetBreadcrumb(data['breadcrumb']));
  }

  setTheme(theme: ThemeName): void {
    this.selectedTheme = this.themeService.setTheme(theme);
    this.showApplied('Apariencia actualizada', 'El tema fue guardado para este navegador.');
  }

  setEffect(effect: VisualEffectName): void {
    this.selectedEffect = this.themeService.setVisualEffect(effect);
    this.showApplied('Ambiente actualizado', 'El efecto visual fue guardado para este navegador.');
  }

  private showApplied(title: string, message: string): void {
    this.toastService.showToast({ title, message, type: 'success', timeout: 2500 });
  }
}
