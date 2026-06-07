import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarOption } from '../../interfaces/sidebar.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})

export class SidebarComponent {
  // Titulo del menú lateral
  @Input() title: string = 'Menu';
  // Opciones del menú lateral
  @Input() options: SidebarOption[] = [];
  @Input() activeTab: string = '';

  @Output() optionSelected = new EventEmitter<string>();

  onOptionClick(optionId: string): void {
    // Emitir el evento con el ID de la opción seleccionada
    this.optionSelected.emit(optionId);
  }
}
