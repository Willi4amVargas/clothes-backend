export interface SalesOperationDetail {
  main_id: number;
  line: number;
  product_id: number;
  description_product: string;
  amount: number;
  unit: number;
  unitary_cost: number;
  sale_aliquot: number;
  buy_aliquot: number;
  price: number;
  total_net_cost: number;
  total_tax_cost: number;
  total_cost: number;
  percent_discount: number;
  discount: number;
  total_net: number;
  total_tax: number;
  total: number;
}
