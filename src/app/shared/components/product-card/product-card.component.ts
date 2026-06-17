import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
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
  @Input() showActions = false;
  @Output() editClicked = new EventEmitter<Article>();
  @Output() deleteClicked = new EventEmitter<Article>();

  mostrarModal = signal(false);
  motivoReporte = signal('');
  enviando = signal(false);
  mensajeExito = signal('');
  reportado = signal(false);

  constructor(
    private moderationService: ModerationService,
    private authService: AuthService
  ) {}

  get estaReportado(): boolean {
    return this.reportado() || !!this.article.estado_reporte;
  }

  get estaVendido(): boolean {
    return this.article.estadoVenta === 'VENDIDO';
  }

  onReportar(event: Event): void {
    event.stopPropagation();
    this.mostrarModal.set(true);
    this.motivoReporte.set('');
    this.mensajeExito.set('');
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
  }

  enviarReporte(): void {
    const usuarioId = this.authService.getUserId();
    if (!usuarioId) {
      this.mensajeExito.set('Error: debes iniciar sesión para reportar.');
      return;
    }

    this.enviando.set(true);
    this.moderationService.reportArticle(this.article.id, this.motivoReporte().trim(), usuarioId).subscribe({
      next: () => {
        this.reportado.set(true);
        this.mensajeExito.set('Artículo reportado. Quedará en revisión por un moderador.');
        this.enviando.set(false);
        setTimeout(() => this.cerrarModal(), 2000);
      },
      error: () => {
        this.mensajeExito.set('Error al enviar el reporte. Inténtalo de nuevo.');
        this.enviando.set(false);
      }
    });
  }
}
