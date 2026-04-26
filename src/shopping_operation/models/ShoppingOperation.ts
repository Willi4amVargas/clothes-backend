export interface ShoppingOperation {
  id: number;
  operation_type: string;
  document_no: string;
  emission_date: string;
  description: string;
  user_id: number;
  total_amount: number;
  total_net: number;
  total_tax: number;
  total: number;
  credit: number;
  cash: number;
  total_count_details: number;
  pending: boolean;
}
