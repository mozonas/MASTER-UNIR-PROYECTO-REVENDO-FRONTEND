import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Mensaje {
  texto: string;
  mio: boolean;
  hora: string;
  fecha?: string;
}

interface Conversacion {
  id: number;
  nombre: string;
  avatar: string;
  ultimoMensaje: string;
  articulo: string;
  mensajes: Mensaje[];
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {

  conversacionActiva: Conversacion | null = null;
  nuevoMensaje: string = '';
  busqueda: string = '';

  get conversacionesFiltradas(): Conversacion[] {
    if (!this.busqueda.trim()) return this.conversaciones;
    const texto = this.busqueda.toLowerCase();
    return this.conversaciones.filter(c =>
      c.nombre.toLowerCase().includes(texto) ||
      c.articulo.toLowerCase().includes(texto)
    );
  }

  mostrarFecha(mensajes: Mensaje[], index: number): boolean {
    if (index === 0) return true;
    return mensajes[index].fecha !== mensajes[index - 1].fecha;
  }

  etiquetaFecha(fecha?: string): string {
    if (!fecha) return '';
    const hoy = new Date().toLocaleDateString('es-ES');
    const ayer = new Date(Date.now() - 86400000).toLocaleDateString('es-ES');
    if (fecha === hoy) return 'Hoy';
    if (fecha === ayer) return 'Ayer';
    return fecha;
  }

  conversaciones: Conversacion[] = [
    {
      id: 1,
      nombre: 'Carlos García',
      avatar: '/images/avatar_usuario.png',
      ultimoMensaje: '¿Sigue disponible?',
      articulo: 'Bicicleta de montaña',
      mensajes: [
        { texto: '¡Hola! ¿Sigue disponible la bicicleta?', mio: false, hora: '10:30', fecha: '01/06/2026' },
        { texto: 'Sí, todavía está disponible', mio: true, hora: '10:32', fecha: '01/06/2026' },
        { texto: '¿Sigue disponible?', mio: false, hora: '10:35', fecha: '02/06/2026' },
      ]
    },
    {
      id: 2,
      nombre: 'Laura Martínez',
      avatar: '/images/avatar_usuario.png',
      ultimoMensaje: 'Perfecto, nos vemos mañana',
      articulo: 'iPhone 13',
      mensajes: [
        { texto: '¿Puedes hacer un descuento?', mio: false, hora: '09:00', fecha: '01/06/2026' },
        { texto: 'Podría dejártelo en 400€', mio: true, hora: '09:05', fecha: '01/06/2026' },
        { texto: 'Perfecto, nos vemos mañana', mio: false, hora: '09:10', fecha: '01/06/2026' },
      ]
    },
    {
      id: 3,
      nombre: 'Miguel Sánchez',
      avatar: '/images/avatar_usuario.png',
      ultimoMensaje: '¿Cuál es la ubicación?',
      articulo: 'Seat Ibiza 2006',
      mensajes: [
        { texto: '¿Cuál es la ubicación exacta?', mio: false, hora: '08:00', fecha: '01/06/2026' },
      ]
    }
  ];

  seleccionarConversacion(conv: Conversacion) {
    this.conversacionActiva = conv;
  }

  enviarMensaje() {
    if (!this.nuevoMensaje.trim() || !this.conversacionActiva) return;

    const mensaje: Mensaje = {
      texto: this.nuevoMensaje,
      mio: true,
      hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      fecha: new Date().toLocaleDateString('es-ES')
    };

    this.conversacionActiva.mensajes.push(mensaje);
    this.conversacionActiva.ultimoMensaje = this.nuevoMensaje;
    this.nuevoMensaje = '';
  }

  enviarConEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.enviarMensaje();
    }
  }
}