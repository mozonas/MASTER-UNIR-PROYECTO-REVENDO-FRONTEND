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

  // Guardamos las dimensiones previas de la pantalla para calcular la proporción al redimensionar
  private ultimoAnchoPantalla = window.innerWidth;
  private ultimoAltoPantalla = window.innerHeight;

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

  // --- DETECTOR DE CAMBIO DE TAMAÑO DE PANTALLA ---
  @HostListener('window:resize')
  onResize() {
    const nuevoAncho = window.innerWidth;
    const nuevoAlto = window.innerHeight;

    // Calculamos la posición proporcional para que acompañe el redimensionamiento
    this.posX = (this.posX / this.ultimoAnchoPantalla) * nuevoAncho;
    this.posY = (this.posY / this.ultimoAltoPantalla) * nuevoAlto;

    // Evitamos que el botón se salga por los bordes (límites de seguridad)
    const tamanoFab = nuevoAncho <= 576 ? 48 : 56; // Ajusta según tus Media Queries de CSS
    const margen = 16;

    if (this.posX + tamanoFab > nuevoAncho) this.posX = nuevoAncho - tamanoFab - margen;
    if (this.posX < margen) this.posX = margen;
    if (this.posY + tamanoFab > nuevoAlto) this.posY = nuevoAlto - tamanoFab - margen;
    if (this.posY < margen) this.posY = margen;

    // Actualizamos el histórico para el próximo resize
    this.ultimoAnchoPantalla = nuevoAncho;
    this.ultimoAltoPantalla = nuevoAlto;
  }

  // Cambiamos el tipo a MouseEvent | TouchEvent
  iniciarArrastre(event: MouseEvent | TouchEvent) {
    this.arrastrando = true;
    this.seMovio = false;

    // Extraemos clientX y clientY de forma segura para ratón o táctil
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    this.offsetX = clientX - this.posX;
    this.offsetY = clientY - this.posY;
  }

  // Añadimos touchmove al listener de documentos para móviles
  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  moverIcono(event: MouseEvent | TouchEvent) {
    if (!this.arrastrando) return;
    this.seMovio = true;

    // Prevenimos el scroll de la pantalla mientras se arrastra en móvil
    if (event instanceof TouchEvent) {
      event.preventDefault();
    }

    // Extraemos clientX y clientY de forma segura
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    let nuevaX = clientX - this.offsetX;
    let nuevaY = clientY - this.offsetY;

    const tamanoFab = window.innerWidth <= 576 ? 48 : 56;

    if (nuevaX < 0) nuevaX = 0;
    if (nuevaX + tamanoFab > window.innerWidth) nuevaX = window.innerWidth - tamanoFab;
    if (nuevaY < 0) nuevaY = 0;
    if (nuevaY + tamanoFab > window.innerHeight) nuevaY = window.innerHeight - tamanoFab;

    this.posX = nuevaX;
    this.posY = nuevaY;
  }

  // Añadimos touchend para dejar de arrastrar en móvil
  @HostListener('document:mouseup')
  @HostListener('document:touchend')
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