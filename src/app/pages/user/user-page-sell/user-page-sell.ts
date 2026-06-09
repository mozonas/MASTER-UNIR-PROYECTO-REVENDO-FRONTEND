import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ArticleService } from '../../../services/article.service';
import { iArticle } from '../../../interfaces/article.interface';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { HeaderMenuComponent } from '../../../shared/headers/header-menu/header-menu.component';

@Component({
  selector: 'app-user-page-sell',
  imports: [CommonModule, HeaderMenuComponent, FooterComponent],
  templateUrl: './user-page-sell.html',
  styleUrls: ['./user-page-sell.css'],
})

export class UserPageSell implements OnInit {

  // 1. INYECTORES DE DEPENDENCIAS

  private articleService = inject(ArticleService);
  private router = inject(Router);
  // 2. PROPIEDADES Y SIGNALS ESTÁNDAR
  articles = this.articleService.Articles;
  selectedFilter = signal<'all' | 'DISPONIBLE' | 'VENDIDO' | 'RESERVADO'>('all');
  currentPage = signal(1);
  pageSize = 6;

  // 3. PROPIEDADES COMPUTADAS (COMPUTED SIGNALS)

  filteredarticles = computed(() => {
    const filter = this.selectedFilter();
    const allarticles = this.articles();
    const articlesArray = Array.isArray(allarticles) ? allarticles : [];
    if (filter === 'all') return articlesArray;
    return articlesArray.filter(p => p.estadoVenta === filter);
  });
  pageCount = computed(() => {
    return Math.max(1, Math.ceil(this.filteredarticles().length / this.pageSize));
  });
  pageNumbers = computed(() => {
    return Array.from({ length: this.pageCount() }, (_, index) => index + 1);
  });
  currentPagearticles = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    const filtered = this.filteredarticles();
    const filteredArray = Array.isArray(filtered) ? filtered : [];
    return filteredArray.slice(start, start + this.pageSize);
  });

  // 4. CICLO DE VIDA (LIFECYCLE HOOKS)

  ngOnInit(): void {
    this.loadArticles();
  }

  // 5. PETICIONES A LA API Y SERVICIOS
  private loadArticles(): void {
    this.articleService.getAllUserArticles().subscribe({
      next: (articles) => {
        // Asignamos los datos reales del backend a la Signal global del servicio
        this.articleService.Articles.set(articles);
 
        // PRUEBA DE LOG: Verificación en la consola del navegador
        console.log('--- PRUEBA DE LOG EN FRONTEND ---');
        console.log('Datos directos recibidos desde Express:', articles);
        console.log('Contenido de la Signal local actualizada:', this.articles());
        console.table(articles); 
      },
      error: (error) => {
        console.error('Error al cargar artículos:', error);
      }
    });
  }
  deleteArticle(article: iArticle) {
    const confirmed = confirm(`¿Está seguro de que desea eliminar "${article.titulo}"? Esta acción no se puede deshacer.`);
    if (confirmed) {
      this.articleService.deleteArticle(article.id);
      this.currentPage.set(Math.min(this.currentPage(), this.pageCount()));
      console.log('Articulo eliminado:', article.titulo);
    }
  }
 
  // 6. ACCIONES DE LA INTERFAZ / EVENTOS DE USUARIO

  setFilter(filter: 'all' | 'DISPONIBLE' | 'VENDIDO' | 'RESERVADO') {
    this.selectedFilter.set(filter);
    this.currentPage.set(1);
  }
  setPage(page: number) {
    if (page < 1 || page > this.pageCount()) {
      return;
    }
    this.currentPage.set(page);
  }
  editArticle(article: iArticle) {
    console.log('Editar articleo:', article);
    alert(`Editar articleo: ${article.titulo}\n(Placeholder - Vista de edición aún no implementada)`);
  }
  addNewArticle() {
    console.log('Agregar nuevo articleo');
    alert('Crear nuevo artículo\n(Placeholder - Vista de creación aún no implementada)');
  }
 
  // 7. MÉTODOS FORMATO Y PLANTILLA (TEMPLATE UTILS)
  
  getStatusBadgeClass(estado: string): string {
    switch (estado) {
      case 'VENDIDO':
        return 'badge-danger';
      case 'RESERVADO':
        return 'badge-warning';
      default:
        return 'badge-success';
    }
  }
  getStatusText(estado: string): string {
    switch (estado) {
      case 'VENDIDO':
        return 'Vendido';
      case 'RESERVADO':
        return 'Reportado';
      default:
        return 'Disponible';
    }
  }

  getFilterCount(filter: 'all' | 'DISPONIBLE' | 'VENDIDO' | 'RESERVADO'): number {
    const allarticles = this.articles();
    const articlesArray = Array.isArray(allarticles) ? allarticles : [];
    if (filter === 'all') return articlesArray.length;
    return articlesArray.filter(p => p.estadoVenta === filter).length;
  }
}