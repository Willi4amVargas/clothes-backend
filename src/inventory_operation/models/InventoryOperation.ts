export interface InventoryOperation {
  correlative: number;
  emission_date: string;
  operation_type: string;
  document_no: string;
  description: string;
  total: number;
  total_net: number;
  total_tax: number;
  user_code: string;
  total_details: number;
  total_amount: number;
}
