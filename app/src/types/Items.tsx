export interface Item {
  name: string;
  description: string;
  target_price: number;
  target_discount_percentage: number;
  base_price: number;
  brand: string;
  main_category: string;
  subcategories: string[];
  bought: boolean;
  search_term: string;
}

interface Items {
  [key: string]: Item;
}

export default Items;
