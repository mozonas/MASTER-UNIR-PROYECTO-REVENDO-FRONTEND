import { Component, computed, inject, Input, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { AsideComponent } from "../../aside/aside.component";

interface Categoria { id: number; nombre: string; }
interface GrupoCategoria { label: string; ids: number[]; subcategorias: Categoria[]; }

// Agrupación visual: los IDs vienen de SELECT id, nombre FROM categorias
const GRUPOS_CONFIG: { label: string; ids: number[] }[] = [
  { label: 'Electrónica',       ids: [1, 2, 3, 4, 5] },          // Móviles, Tablets, Ordenadores, Consolas, Televisores
  { label: 'Hogar y muebles',   ids: [6, 7, 11, 20] },           // Muebles, Electrodomésticos, Jardín, Bricolaje
  { label: 'Moda y accesorios', ids: [8, 9, 10] },               // Ropa, Calzado, Accesorios
  { label: 'Ocio y deportes',   ids: [14, 17, 18, 19] },         // Instrumentos, Libros y ocio, Coleccionismo, Deporte y aire libre
  { label: 'Motor y familia',   ids: [12, 13, 15, 16] },         // Bebés, Mascotas, Coches, Motos
];

@Component({
  selector: 'app-header-menu',
  imports: [RouterLink, CommonModule],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css',
})
export class HeaderMenuComponent implements OnInit {

  @Input() mostrarMenu: boolean = true;

  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  gruposCategorias = signal<GrupoCategoria[]>([]);

  role = signal(this.authService.getUserRole() ?? 'USUARIO');
  username = signal(this.authService.getUserName() ?? '');
  isStaff = computed(() => ['ADMIN', 'MODERADOR'].includes(this.role()));

  ngOnInit(): void {
    this.http.get<{ status: string; data: Categoria[] }>('http://localhost:3000/api/categories').subscribe({
      next: (resp) => {
        const todas = resp.data;
        const grupos: GrupoCategoria[] = GRUPOS_CONFIG.map(g => ({
          label: g.label,
          ids: g.ids,
          subcategorias: todas.filter(c => g.ids.includes(c.id))
        }));
        this.gruposCategorias.set(grupos);
      },
      error: () => {
        // Sin conexión al back: mostrar grupos sin subcategorías
        this.gruposCategorias.set(GRUPOS_CONFIG.map(g => ({ label: g.label, ids: g.ids, subcategorias: [] as Categoria[] })));
      }
    });
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
