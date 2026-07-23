export type ProductStatus = "available" | "sold" | "made_to_order";

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  storage_path: string;
  position: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  dimensions: string | null;
  status: ProductStatus;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  product_images?: ProductImage[];
};
