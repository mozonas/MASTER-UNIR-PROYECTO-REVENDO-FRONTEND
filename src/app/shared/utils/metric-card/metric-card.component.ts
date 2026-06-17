import { Component, input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  imports: [],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.css',
})
export class MetricCardComponent {
  title = input<string>();
  value = input<number>();
  diff = input<number>(0); // valor por defecto
}
