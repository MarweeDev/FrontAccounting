export type BusinessProfileType = 'pymes' | 'gastronomia' | 'instituciones';

export interface BusinessProfileDTO {
  id?: number;
  type: BusinessProfileType;
  label: string;
  description: string;
  theme: 'marwee' | 'classic' | 'dark';
  icon: string;
  highlightedModules: string[];
}
