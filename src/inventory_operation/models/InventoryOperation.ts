export interface InventoryOperation {
  description: string;
  document_no: string;
  emission_date: string;
  id: number;
  operation_type: string;
  total: number;
  total_amount: number;
  total_details: number;
  total_net: number;
  total_tax: number;
  user_id: number;
}
