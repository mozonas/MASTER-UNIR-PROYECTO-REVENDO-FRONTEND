import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Article } from '../../models/article.model';
import { ModerationService } from '../../../services/moderation.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input({ required: true }) article!: Article;

  mostrarModal = false;
  motivoReporte = '';
  enviando = false;
  mensajeExito = '';

  constructor(
    private moderationService: ModerationService,
    private authService: AuthService
  ) {}

  onReportar(event: Event): void {
    event.stopPropagation();
    this.mostrarModal = true;
    this.motivoReporte = '';
    this.mensajeExito = '';
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  enviarReporte(): void {
    const usuarioId = this.authService.getUserId();
    if (!usuarioId) return;

    this.enviando = true;
    this.moderationService.reportArticle(this.article.id, this.motivoReporte.trim(), usuarioId).subscribe({
      next: () => {
        this.article.estadoVenta = 'EN_REVISION';
        this.mensajeExito = 'Artículo reportado. Quedará en revisión por un moderador.';
        this.enviando = false;
        setTimeout(() => this.cerrarModal(), 2000);
      },
      error: () => {
        this.mensajeExito = 'Error al enviar el reporte. Inténtalo de nuevo.';
        this.enviando = false;
      }
    });
  }
}
