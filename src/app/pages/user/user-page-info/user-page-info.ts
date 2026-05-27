import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  usuario: string;
  foto: string;
  created_at: string;
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
export class UserPageInfoComponent implements OnInit {
  // 3. Inyecta el Router
  private router = inject(Router);

  currentUser: Usuario = {
    id: 1,
    nombre: 'Alex',
    apellidos: 'García Pérez',
    email: 'info@domain.com',
    usuario: 'alex_ux_designer',
    foto: 'https://bootdey.com/img/Content/avatar/avatar7.png',
    created_at: '2026-01-15 10:30:00'
  };

  personalDetails: { label: string; value: string; lowercase?: boolean }[] = [];

  stats: Stat[] = [
    { count: '500+', label: 'Clientes felices' },
    { count: '150', label: 'Proyectos completados' },
    { count: '850', label: 'Fotos capturadas' },
    { count: '190', label: 'Llamadas realizadas' },
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
      price: 79.00, image: 'https://bootdey.com/img/Content/avatar/avatar6.png',
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

  ngOnInit(): void {
    this.generarDetallesPersonales();
  }

  private generarDetallesPersonales(): void {
    this.personalDetails = [
      { label: 'Nombre', value: `${this.currentUser.nombre} ${this.currentUser.apellidos}` },
      { label: 'Usuario', value: `@${this.currentUser.usuario}` },
      { label: 'Email', value: this.currentUser.email, lowercase: true },
      { label: 'Miembro desde', value: new Date(this.currentUser.created_at).toLocaleDateString('es-ES') }
    ];
  }

  // 4. Método para redirigir a la ruta de edición
  irAEditar(): void {
    this.router.navigate(['/user-edit']);
  }

  comprarProducto(productoId: number): void {
    console.log(`Producto ${productoId} añadido al carrito.`);
  }
}