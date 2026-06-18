import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Article } from '../../models/article.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input({ required: true }) article!: Article;
  @Input() showActions = false;
  @Output() editClicked = new EventEmitter<Article>();
  @Output() deleteClicked = new EventEmitter<Article>();

  get estaReportado(): boolean {
    return !!this.article.estado_reporte;
  }

  get estaVendido(): boolean {
    return this.article.estadoVenta === 'VENDIDO';
  }
}
