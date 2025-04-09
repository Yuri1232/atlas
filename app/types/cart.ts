export interface CartItem {
  id: number;
  slug: string;
  name: string;
  price: string;
  quantity: number;
  image?: {
    data: Array<{
      attributes: {
        url: string;
      };
    }>;
  };
  features?: {
    color?: string;
    storage?: string;
    ram?: string;
  };
}
