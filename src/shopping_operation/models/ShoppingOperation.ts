export interface ShoppingOperation {
  cash: number;
  credit: number;
  description: string;
  document_no: string;
  emission_date: string;
  id: number;
  operation_type: string;
  pending: boolean;
  total: number;
  total_amount: number;
  total_count_details: number;
  total_net: number;
  total_tax: number;
  user_id: number;
}
