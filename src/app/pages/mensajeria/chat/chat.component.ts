import { Component, OnInit, OnDestroy, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { AuthService } from '../../../services/auth.service';
import { ArticleService } from '../../../services/article.service';
import { ReportTypeComponent } from '../../../shared/report-type/report-type.component';

interface Mensaje {
  id: number;
  contenido: string;
  fecha: string;
  created_at: string;
  usuarios_id: number;
  articulos_id: number;
  usuario: string;
  foto: string;
}

interface Conversacion {
  articulos_id: number;
  titulo: string;
  usuario: string;
  foto: string;
  ultimo_mensaje: string;
  fecha_ultimo_mensaje: string;
  otro_usuario_id?: number;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportTypeComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {

  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private articleService = inject(ArticleService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  usuarioActualId: number = 0;
  articuloIdDesdeUrl: number | null = null;

  conversaciones: Conversacion[] = [];
  conversacionActiva: Conversacion | null = null;
  mensajesActivos: Mensaje[] = [];
  nuevoMensaje: string = '';
  busqueda: string = '';

  mostrarModalReporte = signal(false);
  reportado = signal(false);

  mostrarModalVendido: boolean = false;
  tipoPagoSeleccionado: string = 'Efectivo';
  precioAcordado: number = 0;
  marcandoVendido: boolean = false;
  articuloVendido: boolean = false;
  esVendedor: boolean = false;
  esUsuario: boolean = false;

  private pollingMensajes: any;
  private pollingConversaciones: any;

  ngOnInit() {
    this.usuarioActualId = this.authService.getUserId() || 0;
    this.articuloIdDesdeUrl = Number(this.route.snapshot.queryParamMap.get('articuloId')) || null;
    this.cargarConversaciones();
    const role = this.authService.getUserRole();
    if (role === 'USUARIO') {
      this.esUsuario = true;
    }

    this.pollingConversaciones = setInterval(() => {
      this.cargarConversaciones();
    }, 5000);
  }

  onReportar(): void {
    this.mostrarModalReporte.set(true);
  }

  cerrarModalReporte(): void {
    this.mostrarModalReporte.set(false);
  }

  gestionarReport(): void {
    this.reportado.set(true);
  }

  abrirModalVendido(): void {
    this.mostrarModalVendido = true;
    this.tipoPagoSeleccionado = 'Efectivo';
    this.precioAcordado = 0;
  }

  cerrarModalVendido(): void {
    this.mostrarModalVendido = false;
  }

  marcarVendido(): void {
    if (!this.conversacionActiva || !this.tipoPagoSeleccionado || !this.precioAcordado) return;
    this.marcandoVendido = true;

    this.articleService.marcarVendido(
      String(this.conversacionActiva.articulos_id),
      { tipoPago: this.tipoPagoSeleccionado, precio: this.precioAcordado }
    ).subscribe({
      next: () => {
        this.marcandoVendido = false;
        this.articuloVendido = true;
        this.cerrarModalVendido();

        const mensaje = {
          contenido: `✅ El artículo "${this.conversacionActiva?.titulo}" ha sido marcado como vendido por ${this.precioAcordado}€ mediante ${this.tipoPagoSeleccionado}. ¡Gracias por usar ReVendo!`,
          usuarios_id: this.usuarioActualId,
          articulos_id: this.conversacionActiva!.articulos_id
        };

        this.chatService.enviarMensaje(mensaje).subscribe({
          next: () => {
            this.cargarMensajes(this.conversacionActiva!.articulos_id);
          }
        });

        this.cdr.detectChanges();
      },
      error: () => {
        this.marcandoVendido = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.pollingMensajes) clearInterval(this.pollingMensajes);
    if (this.pollingConversaciones) clearInterval(this.pollingConversaciones);
    this.chatService.setMensajesNoLeidos(0);
  }

  cargarConversaciones() {
    this.chatService.getConversacionesPorUsuario(this.usuarioActualId).subscribe({
      next: (data) => {
        if (this.conversacionActiva && !data.some((c: any) => c.articulos_id === this.conversacionActiva?.articulos_id)) {
          this.conversaciones = [...data, this.conversacionActiva];
        } else {
          this.conversaciones = data;
        }

        const totalNoLeidos = data.reduce((acc: number, conv: any) => {
          return acc + (conv.mensajes_no_leidos || 0);
        }, 0);
        this.chatService.setMensajesNoLeidos(totalNoLeidos);

        if (this.articuloIdDesdeUrl) {
          const articuloId = this.articuloIdDesdeUrl;
          const convExistente = this.conversaciones.find(c => c.articulos_id === articuloId);
          if (convExistente) {
            this.seleccionarConversacion(convExistente);
            this.articuloIdDesdeUrl = null;
          } else {
            this.chatService.getArticuloPorId(articuloId).subscribe({
              next: (resp) => {
                const articulo = resp.data;
                const convTemporal: Conversacion = {
                  articulos_id: articuloId,
                  titulo: articulo.titulo || '',
                  usuario: articulo.seller?.usuario || '',
                  foto: articulo.seller?.foto || '',
                  ultimo_mensaje: '',
                  fecha_ultimo_mensaje: ''
                };
                this.conversaciones = [...this.conversaciones, convTemporal];
                this.seleccionarConversacion(convTemporal);
                this.articuloIdDesdeUrl = null;
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Error al obtener artículo:', err);
                this.articuloIdDesdeUrl = null;
              }
            });
          }
        }

        this.cdr.detectChanges();
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
      c.usuario.toLowerCase().includes(texto) ||
      c.titulo.toLowerCase().includes(texto)
    );
  }

  seleccionarConversacion(conv: Conversacion) {
    this.conversacionActiva = conv;
    this.articuloVendido = false;
    this.cargarMensajes(conv.articulos_id);

    this.chatService.getArticuloPorId(conv.articulos_id).subscribe({
      next: (resp) => {
        const articulo = resp.data;
        this.esVendedor = Number(articulo.usuarios_id) === this.usuarioActualId;
        this.articuloVendido = articulo.estadoVenta === 'VENDIDO';
        this.cdr.detectChanges();
      }
    });

    if (this.pollingMensajes) clearInterval(this.pollingMensajes);

    this.pollingMensajes = setInterval(() => {
      this.cargarMensajes(conv.articulos_id);
    }, 3000);
  }

  cargarMensajes(articuloId: number) {
    this.chatService.getMensajesPorArticulo(articuloId).subscribe({
      next: (data) => {
        this.mensajesActivos = data;
        this.cdr.detectChanges();
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
          this.cargarMensajes(this.conversacionActiva.articulos_id);
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

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/images/avatar_usuario.png';
  }
}