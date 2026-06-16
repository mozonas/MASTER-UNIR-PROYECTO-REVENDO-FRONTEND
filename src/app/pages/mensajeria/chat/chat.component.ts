import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';

interface Mensaje {
  id: number;
  contenido: string;
  fecha: string;
  created_at: string;
  usuarios_id: number;
  articulos_id: number;
  nombre: string;
  apellidos: string;
  foto: string;
}

interface Conversacion {
  articulos_id: number;
  titulo: string;
  nombre: string;
  foto: string;
  ultimo_mensaje: string;
  fecha_ultimo_mensaje: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  private chatService = inject(ChatService);
  private authService = inject(AuthService);

  usuarioActualId: number = 0;

  conversaciones: Conversacion[] = [];
  conversacionActiva: Conversacion | null = null;
  mensajesActivos: Mensaje[] = [];
  nuevoMensaje: string = '';
  busqueda: string = '';

  ngOnInit() {
    this.usuarioActualId = this.authService.getUserId() || 0;
    this.cargarConversaciones();
  }

  cargarConversaciones() {
    this.chatService.getConversacionesPorUsuario(this.usuarioActualId).subscribe({
      next: (data) => {
        this.conversaciones = data;
      },
      error: (err) => {
        console.error('Error al cargar conversaciones:', err);
      }
    });
  }

  get conversacionesFiltradas(): Conversacion[] {
    if (!this.busqueda.trim()) return this.conversaciones;
    const texto = this.busqueda.toLowerCase();
    return this.conversaciones.filter(c =>
      c.nombre.toLowerCase().includes(texto) ||
      c.titulo.toLowerCase().includes(texto)
    );
  }

  seleccionarConversacion(conv: Conversacion) {
    this.conversacionActiva = conv;
    this.chatService.getMensajesPorArticulo(conv.articulos_id).subscribe({
      next: (data) => {
        this.mensajesActivos = data;
      },
      error: (err) => {
        console.error('Error al cargar mensajes:', err);
      }
    });
  }

  esMio(mensaje: Mensaje): boolean {
    return mensaje.usuarios_id === this.usuarioActualId;
  }

  mostrarFecha(mensajes: Mensaje[], index: number): boolean {
    if (index === 0) return true;
    const fechaActual = new Date(mensajes[index].created_at).toLocaleDateString('es-ES');
    const fechaAnterior = new Date(mensajes[index - 1].created_at).toLocaleDateString('es-ES');
    return fechaActual !== fechaAnterior;
  }

  etiquetaFecha(fechaISO: string): string {
    const hoy = new Date().toLocaleDateString('es-ES');
    const ayer = new Date(Date.now() - 86400000).toLocaleDateString('es-ES');
    const fecha = new Date(fechaISO).toLocaleDateString('es-ES');
    if (fecha === hoy) return 'Hoy';
    if (fecha === ayer) return 'Ayer';
    return fecha;
  }

  horaMensaje(fechaISO: string): string {
    return new Date(fechaISO).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim() || !this.conversacionActiva) return;

    const mensaje = {
      contenido: this.nuevoMensaje,
      usuarios_id: this.usuarioActualId,
      articulos_id: this.conversacionActiva.articulos_id
    };

    this.chatService.enviarMensaje(mensaje).subscribe({
      next: () => {
        this.nuevoMensaje = '';
        if (this.conversacionActiva) {
          this.seleccionarConversacion(this.conversacionActiva);
        }
      },
      error: (err) => {
        console.error('Error al enviar mensaje:', err);
      }
    });
  }

  enviarConEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.enviarMensaje();
    }
  }
}