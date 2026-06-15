import { Component, effect, inject, input, signal } from '@angular/core';
import { HeaderMenuComponent } from "../../shared/headers/header-menu/header-menu.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-article-detail-component',
  imports: [HeaderMenuComponent, CommonModule, FooterComponent, RouterLink],
  templateUrl: './article-detail-component.html',
  styleUrl: './article-detail-component.css',
})
export class ArticleDetailComponent {
  modalOpen = false;
  selectedImage: string | null = null;
  productId = input<string>()
  product = signal<any | null>(null);
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductService);

  constructor() {
    effect(() => {
      console.log('Producto actualizado:', this.product());
    });
  }

  async ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');

    console.log('ID de la ruta:', id);

    if (!id) return;

    try {

      const response = await this.productsService.getProductById(id).subscribe(data => {
            console.log('Producto cargado:', data);
           this.product.set(data);
          });

      console.log('Respuesta API:', response);

    } catch (error) {
      console.error('Error cargando producto:', error);
    }
  }

  openImageModal(img: string) {
    this.selectedImage = img;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedImage = null;
  }
}
