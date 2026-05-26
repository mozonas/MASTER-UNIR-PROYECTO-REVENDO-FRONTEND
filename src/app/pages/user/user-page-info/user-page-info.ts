import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interfaz adaptada 100% a tu tabla `usuarios`
interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  usuario: string;
  foto: string;
  // perfil: 'USUARIO' | 'MODERADOR' | 'ADMIN';
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

  // Objeto que representa la fila de la base de datos
  currentUser: Usuario = {
    id: 1,
    nombre: 'Alex',
    apellidos: 'García Pérez',
    email: 'info@domain.com',
    usuario: 'alex_ux_designer',
    foto: 'https://bootdey.com/img/Content/avatar/avatar7.png', // Mapeado a tu campo `foto`
    // perfil: 'USUARIO', // Mapeado a tu ENUM
    created_at: '2026-01-15 10:30:00'
  };

  // Mapeo dinámico para la sección "Información del vendedor"
  personalDetails: { label: string; value: string; lowercase?: boolean }[] = [];

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

  ngOnInit(): void {
    this.generarDetallesPersonales();
  }

  // Estructura los datos reales de la BD para la vista
  private generarDetallesPersonales(): void {
    this.personalDetails = [
      { label: 'Nombre', value: `${this.currentUser.nombre} ${this.currentUser.apellidos}` },
      { label: 'Usuario', value: `@${this.currentUser.usuario}` },
      { label: 'Email', value: this.currentUser.email, lowercase: true },
      // { label: 'Rol de Perfil', value: this.currentUser.perfil },
      { label: 'Miembro desde', value: new Date(this.currentUser.created_at).toLocaleDateString('es-ES') }
    ];
  }

  comprarProducto(productoId: number): void {
    console.log(`Producto ${productoId} añadido al carrito.`);
  }
}