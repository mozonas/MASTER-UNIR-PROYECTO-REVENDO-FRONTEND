import { Component, Input } from '@angular/core';
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
   ngOnInit(): void {
    console.log("HOLAAAA ",this.article);
  }
}
