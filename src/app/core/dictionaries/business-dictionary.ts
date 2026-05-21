import { BusinessProfileType } from '../models/businessProfile';
import { DICCIONARIO_GASTRONOMIA } from './diccionario-gastronomia';
import { DICCIONARIO_INSTITUCIONES } from './diccionario-instituciones';
import { DICCIONARIO_PYMES } from './diccionario-pymes';

export type BusinessDictionaryKey =
  | 'shell.operationCenter'
  | 'shift.openTitle'
  | 'shift.closedTitle'
  | 'shift.openingPlaceholder'
  | 'shift.closingPlaceholder'
  | 'shift.openAction'
  | 'shift.closeAction'
  | 'module.salesKind'
  | 'module.shoppingKind'
  | 'module.inventoryKind'
  | 'module.reportsKind'
  | 'module.settingsKind'
  | 'module.accessKind'
  | 'module.devKind'
  | 'module.defaultKind';

export type BusinessDictionary = Record<BusinessDictionaryKey, string>;

export const BUSINESS_DICTIONARIES: Record<BusinessProfileType, BusinessDictionary> = {
  pymes: DICCIONARIO_PYMES,
  gastronomia: DICCIONARIO_GASTRONOMIA,
  instituciones: DICCIONARIO_INSTITUCIONES
};
