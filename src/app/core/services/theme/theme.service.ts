import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeName = 'marwee' | 'classic' | 'dark';
export type VisualEffectName = 'none' | 'christmas' | 'halloween';

export interface ThemeOption {
  id: ThemeName;
  label: string;
  description: string;
  swatches: string[];
}

export interface VisualEffectOption {
  id: VisualEffectName;
  label: string;
  description: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'accounts_theme';
  private readonly effectStorageKey = 'accounts_visual_effect';
  private readonly defaultTheme: ThemeName = 'marwee';
  private readonly defaultEffect: VisualEffectName = 'none';
  private currentTheme: ThemeName = this.defaultTheme;
  private currentEffect: VisualEffectName = this.defaultEffect;
  private effectSubject = new BehaviorSubject<VisualEffectName>(this.defaultEffect);
  effect$ = this.effectSubject.asObservable();

  private readonly themes: ThemeOption[] = [
    {
      id: 'marwee',
      label: 'Corporativo Marwee',
      description: 'Identidad oficial con naranja, profundidad calida y superficies limpias.',
      swatches: ['#FF3300', '#FF7900', '#FFF4ED', '#1A1A1A']
    },
    {
      id: 'classic',
      label: 'Classic',
      description: 'Apariencia anterior de Accounts con acentos oscuros y base operativa.',
      swatches: ['rgb(23,25,33)', 'rgba(55,146,141,1)', '#f5f5f5', '#d9d9d9']
    },
    {
      id: 'dark',
      label: 'Dark operativo',
      description: 'Modo oscuro para jornadas largas, con contraste alto y acentos Marwee.',
      swatches: ['#101114', '#1F2228', '#FF7900', '#F6F4F2']
    }
  ];

  private readonly visualEffects: VisualEffectOption[] = [
    {
      id: 'none',
      label: 'Sin efecto',
      description: 'Interfaz limpia para operacion diaria.',
      icon: 'fa-regular fa-circle'
    },
    {
      id: 'christmas',
      label: 'Nieve suave',
      description: 'Particulas ligeras para temporada navidena.',
      icon: 'fa-regular fa-snowflake'
    },
    {
      id: 'halloween',
      label: 'Sombras sutiles',
      description: 'Movimiento oscuro muy discreto para Halloween.',
      icon: 'fa-solid fa-moon'
    }
  ];

  getThemes(): ThemeOption[] {
    return this.themes;
  }

  getCurrentTheme(): ThemeName {
    return this.currentTheme;
  }

  getVisualEffects(): VisualEffectOption[] {
    return this.visualEffects;
  }

  getCurrentEffect(): VisualEffectName {
    return this.currentEffect;
  }

  loadTheme(): ThemeName {
    const savedTheme = localStorage.getItem(this.storageKey);
    const nextTheme = this.isSupportedTheme(savedTheme) ? savedTheme : this.defaultTheme;
    return this.applyTheme(nextTheme, false);
  }

  loadEffect(): VisualEffectName {
    const savedEffect = localStorage.getItem(this.effectStorageKey);
    const nextEffect = this.isSupportedEffect(savedEffect) ? savedEffect : this.defaultEffect;
    return this.applyEffect(nextEffect, false);
  }

  setTheme(theme: ThemeName): ThemeName {
    return this.applyTheme(theme, true);
  }

  setVisualEffect(effect: VisualEffectName): VisualEffectName {
    return this.applyEffect(effect, true);
  }

  private applyTheme(theme: ThemeName, persist: boolean): ThemeName {
    const nextTheme = this.isSupportedTheme(theme) ? theme : this.defaultTheme;
    document.body.classList.remove(...this.themes.map(item => `theme-${item.id}`));
    document.body.classList.add(`theme-${nextTheme}`);
    this.currentTheme = nextTheme;

    if (persist) {
      localStorage.setItem(this.storageKey, nextTheme);
    }

    return nextTheme;
  }

  private isSupportedTheme(theme: string | null): theme is ThemeName {
    return this.themes.some(item => item.id === theme);
  }

  private applyEffect(effect: VisualEffectName, persist: boolean): VisualEffectName {
    const nextEffect = this.isSupportedEffect(effect) ? effect : this.defaultEffect;
    document.body.classList.remove(...this.visualEffects.map(item => `effect-${item.id}`));
    document.body.classList.add(`effect-${nextEffect}`);
    this.currentEffect = nextEffect;
    this.effectSubject.next(nextEffect);

    if (persist) {
      localStorage.setItem(this.effectStorageKey, nextEffect);
    }

    return nextEffect;
  }

  private isSupportedEffect(effect: string | null): effect is VisualEffectName {
    return this.visualEffects.some(item => item.id === effect);
  }
}
