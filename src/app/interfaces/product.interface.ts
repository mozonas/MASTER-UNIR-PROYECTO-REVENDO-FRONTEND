export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  status: 'available' | 'sold' | 'reported';
  createdAt: Date;
}
