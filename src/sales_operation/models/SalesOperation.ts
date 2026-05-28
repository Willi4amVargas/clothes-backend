export interface SalesOperation {
  cash: number;
  client_id: number;
  credit: number;
  credit_days: number;
  description: string;
  discount: number;
  document_no: string;
  emission_date: string;
  id: number;
  operation_type: string;
  pending: boolean;
  percent_discount: number;
  seller: string;
  total: number;
  total_amount: number;
  total_cost: number;
  total_count_details: number;
  total_exempt: number;
  total_net: number;
  total_net_cost: number;
  total_tax: number;
  total_tax_cost: number;
  user_id: number;
}
