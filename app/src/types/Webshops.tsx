interface Selectors {
  product_container: string;
  url: string;
  title: string;
  price: string;
}

export interface Webshop {
  name: string;
  selectors: Selectors;
  res: any[]; // If `res` has a specific type, replace `any` with that type
  query_url: string;
  main_category: string;
  subcategories: string[];
}

interface Webshops {
  [key: string]: Webshop;
}

export default Webshops;
