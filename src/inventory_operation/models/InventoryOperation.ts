export interface InventoryOperation {
  id: number;
  operation_type: string;
  document_no: string;
  emission_date: string;
  description: string;
  total: number;
  total_net: number;
  total_tax: number;
  user_id: number;
  total_details: number;
  total_amount: number;
}
