import { ChangeDetectorRef, Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { DetailSeller } from "../../shared/detail-seller/detail-seller";

@Component({
  selector: 'app-article-detail-component',
  imports: [CommonModule, DetailSeller],
  templateUrl: './article-detail-component.html',
  styleUrl: './article-detail-component.css',
})
export class ArticleDetailComponent {
  modalOpen = false;
  selectedImage: string | null = null;
  article = signal<any | null>(null);
  private route = inject(ActivatedRoute);
  private articlesService = inject(ArticleService);
  private router = inject(Router);
  idVendedor: number = Number(this.route.snapshot.paramMap.get('id'));

  constructor() {
    effect(() => {
      console.log('Artículo actualizado:', this.article());
    });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.getArticleData(id)
    this.idVendedor = Number(id)
  }

  /**
   * Función que solicita los datos de un artículo al Backend
   * @param id id del artículo del que solicitamos los datos
   */
  async getArticleData(id: string) {
    this.articlesService.getArticleById(id).subscribe({
      next: (data) => {
        this.article.set(data);
      },
      error: (err) => {
        console.error('Error cargando producto:', err);
        if (err.status === 404) {
          this.router.navigate(['/404']);
        }
      }
    });
  }

  /**
   * Función que abre el modal que muestra la imagen del carrusel
   * @param img 
   */
  openImageModal(img: string) {
    this.selectedImage = img;
    this.modalOpen = true;
  }

  /**
   * Función que cierra el modal de la imagen
   */
  closeModal() {
    this.modalOpen = false;
    this.selectedImage = null;
  }

}
