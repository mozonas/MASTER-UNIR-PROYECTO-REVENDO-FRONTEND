import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Article } from '../../models/article.model';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { iArticle } from '../../../interfaces/article.interface';

@Component({
  selector: 'app-article-card',
  imports: [CurrencyPipe],
  templateUrl: './article-card.component.html',
  styleUrl: './article-card.component.css',
})
export class ArticleCardComponent {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  isAdminViewing: boolean = false;

  @Input({ required: true }) article!: iArticle;
  @Input() showActions = false;
  @Output() editClicked = new EventEmitter<Article>();
  @Output() deleteClicked = new EventEmitter<Article>();
  private router = inject(Router);

  ngOnInit() {
    let userIdParaCargar: number | null = null;

    // 1. Intentamos obtener el ID desde los parámetros de la URL (ruta de Admin)
    const idFromRoute = this.route.snapshot.paramMap.get('id');

    if (idFromRoute) {
      userIdParaCargar = Number(idFromRoute);
      this.isAdminViewing = true; // El admin está auditando un perfil ajeno
      console.log(`📋 Modo Admin: Visualizando usuario desde URL con ID: ${userIdParaCargar}`);
    } else {
      // 2. Si no hay ID en la URL, mantenemos tu comportamiento original (Perfil propio del usuario logueado)
      userIdParaCargar = this.authService.getUserId();
      console.log(`👤 Modo Usuario: Visualizando perfil propio con ID: ${userIdParaCargar}`);
    }
  }

  get estaReportado(): boolean {
    return !!this.article.estado_reporte;
  }

  get estaVendido(): boolean {
    return this.article.estadoVenta === 'VENDIDO';
  }

  viewArticle(article: iArticle) {
    console.log('Ver artículo:', this.article.id);
    this.router.navigate(['/article-detail', this.article.id]);
  }
}

