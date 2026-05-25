import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PersonalDetail {
  label: string;
  value: string;
}

interface Stat {
  count: string;
  label: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

@Component({
  selector: 'app-user-page-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-page-info.html',
  styleUrls: ['./user-page-info.css']
})
export class UserPageInfoComponent {

  personalDetails: PersonalDetail[] = [
    { label: 'Cumpleaños', value: '4 Abr 1998' },
    { label: 'Email',      value: 'info@domain.com' },
    { label: 'Edad',       value: '22 años' },
    { label: 'Teléfono',   value: '820-885-3321' },
    { label: 'Residencia', value: 'Canada' },
    { label: 'Dirección',  value: 'California, USA' },
  ];

  stats: Stat[] = [
    { count: '500+', label: 'Clientes felices' },
    { count: '150',  label: 'Proyectos completados' },
    { count: '850',  label: 'Fotos capturadas' },
    { count: '190',  label: 'Llamadas realizadas' },
  ];

  products: Product[] = [
    {
      id: 1,
      name: 'Biokinetic Interface Theme',
      category: 'UI Templates',
      price: 49.99,
      image: 'https://bootdey.com/img/Content/avatar/avatar1.png',
      description: 'Layout limpio, ligero y super responsive.'
    },
    {
      id: 2,
      name: 'Adaptive Agenda Plugin',
      category: 'Angular Tools',
      price: 29.50,
      image: 'https://bootdey.com/img/Content/avatar/avatar7.png',
      description: 'Motor fluido de workflow para tu IDE personal.'
    },
    {
      id: 3,
      name: 'Flow Map Dashboard',
      category: 'Kinetic Aesthetics',
      price: 79.00,
      image: 'https://bootdey.com/img/Content/avatar/avatar6.png',
      description: 'Módulos avanzados de datos y estadísticas.'
    },
    {
      id: 4,
      name: 'Bio-Command Core Pack',
      category: 'Bundles',
      price: 120.00,
      image: 'https://bootdey.com/img/Content/avatar/avatar2.png',
      description: 'Blueprint completo y optimización de motor.'
    },
  ];

  comprarProducto(productoId: number): void {
    console.log(`Producto ${productoId} añadido al carrito.`);
    // Aquí puedes añadir lógica de redirección o pasarela de pago
  }
}