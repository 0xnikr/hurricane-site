// ─── Product ─────────────────────────────────────────
export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  short_description: string | null;
  full_description: string | null;
  price: number;
  compare_at_price: number | null;
  taxable: boolean;
  active: boolean;
  featured: boolean;
  category: string | null;
  stock: number | null;
  sort_order: number;
  primary_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

// ─── Homepage ────────────────────────────────────────
export interface HomepageFeaturedProduct {
  id: string;
  product_id: string;
  section_key: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  product?: Product; // joined
}

// ─── Orders ──────────────────────────────────────────
export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_first_name: string | null;
  shipping_last_name: string | null;
  shipping_address1: string | null;
  shipping_address2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  billing_same_as_shipping: boolean;
  billing_first_name: string | null;
  billing_last_name: string | null;
  billing_address1: string | null;
  billing_address2: string | null;
  billing_city: string | null;
  billing_state: string | null;
  billing_postal_code: string | null;
  billing_country: string | null;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  grand_total: number;
  payment_status: string;
  order_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  sku_snapshot: string;
  title_snapshot: string;
  unit_price_snapshot: number;
  taxable_snapshot: boolean;
  quantity: number;
  line_total: number;
  created_at: string;
}

// ─── Cart ────────────────────────────────────────────
export interface CartItem {
  product_id: string;
  title: string;
  price: number;
  image_url: string | null;
  slug: string;
  quantity: number;
}

// ─── Admin ───────────────────────────────────────────
export interface AdminUser {
  id: string;
  email: string;
  role: string;
  active: boolean;
  created_at: string;
}
