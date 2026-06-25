import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat-fab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-fab.component.html',
  styleUrl: './chat-fab.component.css'
})
export class ChatFabComponent implements OnInit, OnDestroy {

  protected router = inject(Router);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);

  posX: number = window.innerWidth - 90;
  posY: number = window.innerHeight - 100;

  private arrastrando = false;
  private offsetX = 0;
  private offsetY = 0;
  private seMovio = false;

  mensajesNoLeidos: number = 0;
  private usuarioActualId: number = 0;
  private pollingNotificaciones: any;

  ngOnInit() {
    this.usuarioActualId = this.authService.getUserId() || 0;

    this.chatService.mensajesNoLeidos$.subscribe(cantidad => {
      this.mensajesNoLeidos = cantidad;
    });

    // Comprueba notificaciones cada 10 segundos
    this.pollingNotificaciones = setInterval(() => {
      this.comprobarNotificaciones();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.pollingNotificaciones) clearInterval(this.pollingNotificaciones);
  }

  comprobarNotificaciones() {
    if (this.usuarioActualId === 0) return;
    this.chatService.getConversacionesPorUsuario(this.usuarioActualId).subscribe({
      next: (data) => {
        const total = data.reduce((acc: number, conv: any) => {
          return acc + (conv.mensajes_no_leidos || 0);
        }, 0);
        this.chatService.setMensajesNoLeidos(total);
      }
    });
  }

  iniciarArrastre(event: MouseEvent) {
    this.arrastrando = true;
    this.seMovio = false;
    this.offsetX = event.clientX - this.posX;
    this.offsetY = event.clientY - this.posY;
  }

  @HostListener('document:mousemove', ['$event'])
  moverIcono(event: MouseEvent) {
    if (!this.arrastrando) return;
    this.seMovio = true;
    this.posX = event.clientX - this.offsetX;
    this.posY = event.clientY - this.offsetY;
  }

  @HostListener('document:mouseup')
  soltarIcono() {
    this.arrastrando = false;
  }

  irAlChat() {
    if (!this.seMovio) {
      if (this.router.url === '/chat') {
        window.history.back();
      } else {
        this.router.navigate(['/chat']);
      }
    }
  }
}