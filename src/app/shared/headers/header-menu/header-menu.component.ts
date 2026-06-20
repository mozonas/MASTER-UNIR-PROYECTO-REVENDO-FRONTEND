import { Component, computed, inject, Input, signal, OnInit, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CategoryService } from '../../../services/category.service';

interface Categoria { id: number; nombre: string; }
interface GrupoCategoria { label: string; ids: number[]; subcategorias: Categoria[]; }

const GRUPOS_CONFIG: { label: string; ids: number[] }[] = [
  { label: 'Electrónica',       ids: [1, 2, 3, 4, 5] },
  { label: 'Hogar y muebles',   ids: [6, 7, 11, 20] },
  { label: 'Moda y accesorios', ids: [8, 9, 10] },
  { label: 'Ocio y deportes',   ids: [14, 17, 18, 19] },
  { label: 'Motor y familia',   ids: [12, 13, 15, 16] },
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
  private categoryService = inject(CategoryService);

  gruposCategorias = signal<GrupoCategoria[]>([]);

  role = signal(this.authService.getUserRole() ?? 'USUARIO');
  username = signal(this.authService.getUserName() ?? '');
  isStaff = computed(() => ['ADMIN', 'MODERADOR'].includes(this.role()));

  ngOnInit(): void {

    //MOG Cargar categorías desde MI service
    this.categoryService.loadCategories();

    //MOG Reconstruir grupos cuando cambien las categorías
    effect(() => {
      const todas = this.categoryService.categories();

      const grupos = GRUPOS_CONFIG.map(g => ({
        label: g.label,
        ids: g.ids,
        subcategorias: todas.filter(c => g.ids.includes(c.id))
      }));

      this.gruposCategorias.set(grupos);
    });
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
