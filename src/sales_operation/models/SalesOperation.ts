export interface SalesOperation {
  id: number;
  operation_type: string;
  document_no: string;
  emission_date: string;
  client_id: number;
  seller: string;
  credit_days: number;
  description: string;
  user_id: number;
  total_amount: number;
  percent_discount: number;
  discount: number;
  total_net: number;
  total_exempt: number;
  total_tax: number;
  total: number;
  credit: number;
  cash: number;
  total_net_cost: number;
  total_tax_cost: number;
  total_cost: number;
  total_count_details: number;
  pending: boolean;
}
