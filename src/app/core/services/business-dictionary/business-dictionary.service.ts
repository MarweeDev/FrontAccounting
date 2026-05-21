import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { BUSINESS_DICTIONARIES, BusinessDictionaryKey } from '../../dictionaries/business-dictionary';
import { BusinessProfileType } from '../../models/businessProfile';
import { SettingParameterService } from '../setting-parameter/setting-parameter.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessDictionaryService {
  private profileSubject = new BehaviorSubject<BusinessProfileType>('pymes');
  profile$ = this.profileSubject.asObservable();

  constructor(private settingParameterService: SettingParameterService) { }

  loadProfile(): Observable<BusinessProfileType> {
    return this.settingParameterService.get().pipe(
      map(data => {
        const parameter = (data.result || []).find(item => item.grupo === 'empresa' && item.clave === 'perfil_negocio');
        return this.normalizeProfile(parameter?.valor || '');
      }),
      tap(profile => this.profileSubject.next(profile)),
      catchError(() => of(this.profileSubject.value))
    );
  }

  setProfile(profile: BusinessProfileType): void {
    this.profileSubject.next(profile);
  }

  getProfile(): BusinessProfileType {
    return this.profileSubject.value;
  }

  term(key: BusinessDictionaryKey): string {
    return BUSINESS_DICTIONARIES[this.profileSubject.value][key] || BUSINESS_DICTIONARIES.pymes[key] || key;
  }

  getTerms(profile: BusinessProfileType = this.profileSubject.value): Array<{ key: BusinessDictionaryKey; value: string }> {
    return Object.entries(BUSINESS_DICTIONARIES[profile]).map(([key, value]) => ({
      key: key as BusinessDictionaryKey,
      value
    }));
  }

  normalizeProfile(value: string): BusinessProfileType {
    if (value === 'instituto') return 'instituciones';
    if (value === 'restaurante' || value === 'bar') return 'gastronomia';
    if (value === 'servicios' || value === 'productos' || value === 'pyme' || value === 'personalizado') return 'pymes';
    if (value === 'pymes' || value === 'gastronomia' || value === 'instituciones') return value;
    return 'pymes';
  }
}
