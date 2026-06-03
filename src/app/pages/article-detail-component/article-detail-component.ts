import { Component } from '@angular/core';
import { HeaderMenuComponent } from "../../shared/headers/header-menu/header-menu.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-article-detail-component',
  imports: [HeaderMenuComponent, CommonModule],
  templateUrl: './article-detail-component.html',
  styleUrl: './article-detail-component.css',
})
export class ArticleDetailComponent {
  modalOpen = false;
  selectedImage: string | null = null;

  openImageModal(img: string) {
    this.selectedImage = img;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedImage = null;
  }
}
