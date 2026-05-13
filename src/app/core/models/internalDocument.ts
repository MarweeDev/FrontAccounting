export interface EmailDocumentRequestDTO {
  documentType: 'order-receipt' | 'shopping-support';
  reference: string;
  email: string;
  subject?: string;
  payload: any;
}
