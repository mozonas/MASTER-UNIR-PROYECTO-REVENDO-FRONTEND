import { Injectable, signal } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Mock data para desarrollo
  private mockProducts: Product[] = [
    {
      id: '1',
      title: 'iPhone 14 Pro',
      description: 'iPhone 14 Pro en excelente estado, con accesorios originales',
      price: 899,
      image: 'https://via.placeholder.com/300x300?text=iPhone+14+Pro',
      status: 'available',
      createdAt: new Date('2024-05-20')
    },
    {
      id: '2',
      title: 'Laptop Dell XPS 13',
      description: 'Laptop ultra delgada, rápida y eficiente para trabajo',
      price: 1200,
      image: 'https://via.placeholder.com/300x300?text=Dell+XPS+13',
      status: 'available',
      createdAt: new Date('2024-05-15')
    },
    {
      id: '3',
      title: 'Auriculares Sony WH-1000XM5',
      description: 'Auriculares con cancelación de ruido activa premium',
      price: 399,
      image: 'https://via.placeholder.com/300x300?text=Sony+Headphones',
      status: 'sold',
      createdAt: new Date('2024-05-10')
    },
    {
      id: '4',
      title: 'Smartwatch Apple Watch Series 9',
      description: 'Reloj inteligente con múltiples funciones de salud',
      price: 429,
      image: 'https://via.placeholder.com/300x300?text=Apple+Watch',
      status: 'available',
      createdAt: new Date('2024-05-05')
    },
    {
      id: '5',
      title: 'Tablet Samsung Galaxy Tab S8',
      description: 'Tablet con pantalla AMOLED de alta resolución',
      price: 599,
      image: 'https://via.placeholder.com/300x300?text=Samsung+Tablet',
      status: 'sold',
      createdAt: new Date('2024-04-30')
    },
    {
      id: '6',
      title: 'Cámara Canon EOS R50',
      description: 'Cámara mirrorless profesional con lentes',
      price: 1500,
      image: 'https://via.placeholder.com/300x300?text=Canon+Camera',
      status: 'available',
      createdAt: new Date('2024-04-25')
    },
    {
      id: '7',
      title: 'Monitor LG UltraWide 34"',
      description: 'Monitor ultraancho 34 pulgadas para productividad',
      price: 599,
      image: 'https://via.placeholder.com/300x300?text=LG+Monitor',
      status: 'reported',
      createdAt: new Date('2024-04-20')
    },
    {
      id: '8',
      title: 'Bicicleta Eléctrica Urban E-Flow',
      description: 'Bicicleta compacta para la ciudad con batería extraíble',
      price: 1299,
      image: 'https://via.placeholder.com/300x300?text=Bici+El%C3%A9ctrica',
      status: 'available',
      createdAt: new Date('2024-03-28')
    },
    {
      id: '9',
      title: 'Guitarra Fender Stratocaster',
      description: 'Guitarra eléctrica de color negro con estuche incluido',
      price: 799,
      image: 'https://via.placeholder.com/300x300?text=Fender+Stratocaster',
      status: 'sold',
      createdAt: new Date('2024-03-15')
    },
    {
      id: '10',
      title: 'Cámara GoPro HERO11',
      description: 'Cámara de acción 5.3K para tus mejores aventuras',
      price: 429,
      image: 'https://via.placeholder.com/300x300?text=GoPro+HERO11',
      status: 'available',
      createdAt: new Date('2024-03-10')
    },
    {
      id: '11',
      title: 'Set de maletas Samsonite',
      description: 'Juego de 3 maletas rígidas, poco uso y excelente estado',
      price: 249,
      image: 'https://via.placeholder.com/300x300?text=Samsonite',
      status: 'available',
      createdAt: new Date('2024-02-25')
    },
    {
      id: '12',
      title: 'iPad Air 5ª Generación',
      description: 'Tablet Apple con lápiz y funda original',
      price: 699,
      image: 'https://via.placeholder.com/300x300?text=iPad+Air',
      status: 'reported',
      createdAt: new Date('2024-02-18')
    }
  ];

  products = signal<Product[]>(this.mockProducts);

  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  deleteProduct(id: string): void {
    const updatedProducts = this.products().filter(p => p.id !== id);
    this.products.set(updatedProducts);
  }

  updateProduct(id: string, updatedProduct: Partial<Product>): void {
    const products = [...this.products()];
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      this.products.set(products);
    }
  }
}
