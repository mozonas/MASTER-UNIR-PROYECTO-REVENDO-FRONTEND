import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarOption } from '../../interfaces/sidebar.interface';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterOutlet],
  templateUrl: './moderation.component.html',
  styleUrl: './moderation.component.css'
})
export class ModerationComponent {
  private router = inject(Router);

  activeTab: string = 'panel';

  menuOptions: SidebarOption[] = [
    { id: 'panel', name: 'Panel principal', icon: 'bi-speedometer2' },
    { id: 'articulos', name: 'Gestión de artículos', icon: 'bi-box-seam' },
    { id: 'chat', name: 'Gestión de mensajería', icon: 'bi-chat-left-text' }
  ];

  handleNavigation(tabId: string): void {
    this.activeTab = tabId;
    this.router.navigate([`/moderation/${tabId}`]);
  }
}

