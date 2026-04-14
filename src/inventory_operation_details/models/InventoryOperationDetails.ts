export interface InventoryOperationDetails {
  main_id: number;
  line: number;
  product_id: number;
  description_product: string;
  amount: number;
  unit: number;
  unitary_cost: number;
  aliquot: number;
  total_cost: number;
  total_tax: number;
  total: number;
}
