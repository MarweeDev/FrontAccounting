export type PaymentMethodType = 'cash' | 'terminal' | 'transfer' | 'qr' | 'breb' | 'wallet' | 'link' | 'credit' | 'mixed';

export interface PaymentMethodConfigDTO {
  id?: number;
  name: string;
  method_type: PaymentMethodType | string;
  icon?: string;
  color?: string;
  priority?: number;
  requires_reference?: boolean;
  requires_confirmation?: boolean;
  allows_qr?: boolean;
  account_label?: string | null;
  account_value?: string | null;
  qr_value?: string | null;
  instructions?: string | null;
  id_tipopago_legacy?: number | null;
  id_subtipopago_legacy?: number | null;
  auto_print_after_payment?: boolean;
  enabled?: boolean;
}

export interface PaymentTransactionDetailDTO {
  codigo_orden: string;
  id_payment_method_config?: number | null;
  method_name: string;
  method_type: string;
  reference?: string | null;
  account_value?: string | null;
  confirmation_status?: string;
  amount?: number | null;
  payload?: any;
}
