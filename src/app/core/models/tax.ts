export type TaxModuleScope = 'sales' | 'shopping' | 'both';

export interface TaxDTO {
  id?: number;
  name: string;
  percentage: number;
  module_scope: TaxModuleScope;
  visible_modules?: string[];
  id_estado?: number;
}

export interface AppliedTaxDTO {
  id_tax?: number;
  name: string;
  percentage: number;
  base: number;
  value: number;
}
