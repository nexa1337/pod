
export type Currency = 'USD' | 'EUR' | 'MAD';

export interface Product {
  id: string;
  title: string;
  tagline: string;
  price: number; // Base price in USD
  rating: number;
  reviewCount: number;
  salesCount: number;
  shippingType: 'Morocco' | 'International';
  images: string[];
  description: string; // Can contain HTML/Markdown-like structure
  category: string;
  sizes: string[];
  colors: string[]; // Hex codes
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  excerpt: string;
}

export interface CODFormData {
  fullName: string;
  country: string;
  city: string;
  zipCode: string;
  whatsapp: string;
  isCustomLogo: boolean;
  customLogoFile?: File | null;
  customInstructions?: string;
}
